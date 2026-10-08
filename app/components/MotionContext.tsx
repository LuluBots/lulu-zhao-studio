"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";

export type CharacterState =
  | "resting"
  | "greeting"
  | "looking"
  | "curious"
  | "presenting"
  | "delivered"
  | "quiet";

export type LookData = { x?: number; y?: number };

interface MotionContextType {
  motionEnabled: boolean;
  toggleMotion: () => void;
  characterState: CharacterState;
  lookCoords: { x: number; y: number };
  triggerAction: (
    action: "greet" | "curious" | "present" | "delivered" | "look" | "rest",
    data?: LookData
  ) => void;
  statusMessage: string | null;
  copyEmail: () => Promise<boolean>;
}

const MotionContext = createContext<MotionContextType | null>(null);

function subscribeMotion(callback: () => void) {
  window.addEventListener("storage", callback);
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    media.removeEventListener("change", callback);
  };
}

function getMotionSnapshot() {
  const stored = localStorage.getItem("luluzhao_motion_pref");
  if (stored !== null) return stored === "true";
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getMotionServerSnapshot() {
  return true;
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const systemMotionEnabled = useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot
  );

  const [overrideMotion, setOverrideMotion] = useState<boolean | null>(null);
  const motionEnabled = overrideMotion !== null ? overrideMotion : systemMotionEnabled;

  const [characterState, setCharacterState] = useState<CharacterState>("resting");
  const [lookCoords, setLookCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastActionTime, setLastActionTime] = useState<number>(0);

  const toggleMotion = useCallback(() => {
    const next = !motionEnabled;
    setOverrideMotion(next);
    try {
      localStorage.setItem("luluzhao_motion_pref", String(next));
    } catch {
      // Ignore localStorage issues
    }
    if (!next) {
      setCharacterState("quiet");
    } else {
      setCharacterState("resting");
    }
  }, [motionEnabled]);

  const triggerAction = useCallback(
    (
      action: "greet" | "curious" | "present" | "delivered" | "look" | "rest",
      data?: LookData
    ) => {
      if (!motionEnabled) {
        setCharacterState("quiet");
        return;
      }

      const now = Date.now();

      if (action === "curious") {
        if (now - lastActionTime < 1500) return; // 1.5s cooldown
        setLastActionTime(now);
        setCharacterState("curious");
        setTimeout(() => {
          setCharacterState((curr) => (curr === "curious" ? "resting" : curr));
        }, 850);
      } else if (action === "greet") {
        setCharacterState("greeting");
        setTimeout(() => {
          setCharacterState((curr) => (curr === "greeting" ? "resting" : curr));
        }, 900);
      } else if (action === "delivered") {
        setCharacterState("delivered");
        setTimeout(() => {
          setCharacterState((curr) => (curr === "delivered" ? "resting" : curr));
        }, 1100);
      } else if (action === "present") {
        setCharacterState("presenting");
      } else if (action === "look") {
        if (characterState !== "curious" && characterState !== "delivered") {
          setCharacterState("looking");
          if (data && typeof data.x === "number" && typeof data.y === "number") {
            setLookCoords({ x: data.x, y: data.y });
          }
        }
      } else if (action === "rest") {
        if (characterState === "presenting" || characterState === "looking") {
          setCharacterState("resting");
          setLookCoords({ x: 0, y: 0 });
        }
      }
    },
    [motionEnabled, characterState, lastActionTime]
  );

  const copyEmail = useCallback(async () => {
    const email = "lz625@cornell.edu";
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      triggerAction("delivered");
      setStatusMessage("Email copied.");
      setTimeout(() => {
        setStatusMessage(null);
      }, 3500);
      return true;
    } catch {
      setStatusMessage("Couldn’t copy. You can select: lz625@cornell.edu");
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
      return false;
    }
  }, [triggerAction]);

  return (
    <MotionContext.Provider
      value={{
        motionEnabled,
        toggleMotion,
        characterState: motionEnabled ? characterState : "quiet",
        lookCoords,
        triggerAction,
        statusMessage,
        copyEmail,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within MotionProvider");
  }
  return context;
}
