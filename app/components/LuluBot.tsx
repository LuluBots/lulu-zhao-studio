"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMotion } from "./MotionContext";

interface LuluBotProps {
  size?: "hero" | "compact" | "tiny";
  className?: string;
  interactive?: boolean;
}

export function LuluBot({
  size = "hero",
  className = "",
  interactive = true,
}: LuluBotProps) {
  const {
    motionEnabled,
    characterState,
    lookCoords,
    triggerAction,
  } = useMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const [blinking, setBlinking] = useState(false);

  // Handle idle natural blink (every 8-14s)
  useEffect(() => {
    if (!motionEnabled || characterState === "quiet") return;

    let timeoutId: NodeJS.Timeout;
    const scheduleNextBlink = () => {
      const delay = 8000 + Math.random() * 6000;
      timeoutId = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleNextBlink();
        }, 180);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(timeoutId);
  }, [motionEnabled, characterState]);

  // Handle first-time greeting in hero
  useEffect(() => {
    if (!motionEnabled || size !== "hero") return;

    try {
      const hasGreeted = sessionStorage.getItem("lulubot_hero_greeted");
      if (!hasGreeted) {
        sessionStorage.setItem("lulubot_hero_greeted", "true");
        const timer = setTimeout(() => {
          triggerAction("greet");
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors
    }
  }, [motionEnabled, size, triggerAction]);

  // Track mouse looking inside scene
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!motionEnabled || characterState === "curious" || characterState === "delivered") return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const dy = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    triggerAction("look", { x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    if (characterState === "looking") {
      triggerAction("rest");
    }
  };

  // State derivations
  const isQuiet = !motionEnabled || characterState === "quiet";
  const isGreeting = !isQuiet && characterState === "greeting";
  const isCurious = !isQuiet && characterState === "curious";
  const isPresenting = !isQuiet && characterState === "presenting";
  const isDelivered = !isQuiet && characterState === "delivered";

  // Head tilt calculation
  let headTilt = 0;
  let headY = 0;
  if (isCurious) {
    headTilt = 8;
    headY = -2;
  } else if (isDelivered) {
    headTilt = 0;
    headY = 4;
  } else if (!isQuiet && characterState === "looking") {
    headTilt = lookCoords.x * 5;
  }

  // Pupil offset calculation (max 4px)
  let pupilX = 0;
  let pupilY = 0;
  if (!isQuiet) {
    if (isPresenting) {
      pupilX = -3.5;
      pupilY = 2;
    } else if (characterState === "looking") {
      pupilX = lookCoords.x * 3.5;
      pupilY = lookCoords.y * 2.5;
    }
  }

  // Right arm transform (wave vs point vs rest)
  let rightArmTransform = "rotate(0 118 108)";
  if (isGreeting) {
    rightArmTransform = "rotate(-65 118 108)";
  } else if (isPresenting) {
    rightArmTransform = "rotate(-40 118 108)";
  }

  const dimensions =
    size === "hero"
      ? { width: 180, height: 210, box: "240px" }
      : size === "compact"
      ? { width: 110, height: 130, box: "140px" }
      : { width: 70, height: 85, box: "90px" };

  return (
    <div
      ref={containerRef}
      className={`lulubot-container ${className} ${interactive ? "interactive" : ""}`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        position: "relative",
      }}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
    >
      <button
        type="button"
        className="lulubot-button"
        aria-label="Say hello to LuluBot"
        onClick={() => {
          if (interactive) triggerAction("curious");
        }}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: interactive ? "pointer" : "default",
          outline: "none",
          display: "block",
          position: "relative",
        }}
      >
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 160 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{
            overflow: "visible",
            filter: "drop-shadow(0 4px 12px rgba(40, 37, 34, 0.05))",
          }}
        >
          {/* Question mark when curious */}
          <g
            className="lulubot-question"
            style={{
              opacity: isCurious ? 1 : 0,
              transform: isCurious
                ? "translateY(0) scale(1)"
                : "translateY(8px) scale(0.6)",
              transformOrigin: "115px 25px",
              transition: isQuiet
                ? "none"
                : "opacity 200ms ease, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <path
              d="M110 32C110 24 116 18 123 18C130 18 135 23 135 29C135 34 131 38 127 41C124 43 123 46 123 50"
              stroke="#E76F51"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="123" cy="57" r="2" fill="#E76F51" />
          </g>

          {/* Ground shadow */}
          <ellipse
            cx="80"
            cy="180"
            rx="46"
            ry="6"
            fill="#DDD3C4"
            opacity="0.55"
          />

          {/* Legs */}
          <g className="lulubot-legs">
            {/* Left leg */}
            <rect
              x="62"
              y="152"
              width="11"
              height="22"
              rx="5"
              fill="#282522"
            />
            {/* Right leg */}
            <rect
              x="87"
              y="152"
              width="11"
              height="22"
              rx="5"
              fill="#282522"
            />
          </g>

          {/* Torso & Backpack */}
          <g className="lulubot-body">
            {/* Backpack / battery */}
            <rect
              x="42"
              y="108"
              width="76"
              height="44"
              rx="12"
              fill="#F2C94C"
              stroke="#282522"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Chest plate */}
            <rect
              x="48"
              y="114"
              width="64"
              height="32"
              rx="8"
              fill="#FFFEFB"
              stroke="#282522"
              strokeWidth="2.2"
            />
            {/* Meter / heart line */}
            <path
              d="M58 130H68L72 124L77 136L82 130H92"
              stroke="#E76F51"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Small status indicator light */}
            <circle cx="102" cy="130" r="2.5" fill="#345D9D" />
          </g>

          {/* Arms */}
          {/* Left Arm (viewer right, holds naturally) */}
          <g className="lulubot-arm-left">
            <path
              d="M44 116C34 122 32 136 38 144C40 147 43 147 45 144"
              stroke="#282522"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Right Arm (interactive waving / pointing) */}
          <g
            className={`lulubot-arm-right ${isGreeting ? "anim-wave" : ""}`}
            style={{
              transform: rightArmTransform,
              transformOrigin: "116px 114px",
              transition: isQuiet ? "none" : "transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <path
              d="M116 114C126 120 128 134 122 142C120 145 117 145 115 142"
              stroke="#282522"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Head Group (tilts and nods) */}
          <g
            className={`lulubot-head-group ${isDelivered ? "anim-nod" : ""}`}
            style={{
              transform: `rotate(${headTilt}deg) translateY(${headY}px)`,
              transformOrigin: "80px 104px",
              transition: isQuiet
                ? "none"
                : "transform 260ms cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            {/* Neck connection */}
            <rect
              x="74"
              y="97"
              width="12"
              height="8"
              rx="3"
              fill="#DDD3C4"
              stroke="#282522"
              strokeWidth="2.2"
            />

            {/* Antenna */}
            <path
              d="M80 43V28"
              stroke="#282522"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle
              cx="80"
              cy="25"
              r="4.5"
              fill="#E76F51"
              stroke="#282522"
              strokeWidth="2.4"
            />

            {/* Head Box (slightly asymmetrical rounded shape) */}
            <path
              d="M40 50C40 43 45 40 52 40H108C115 40 120 43 120 50V94C120 101 115 104 108 104H52C45 104 40 101 40 94V50Z"
              fill="#FFFEFB"
              stroke="#282522"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Ear dials */}
            <rect
              x="36"
              y="64"
              width="5"
              height="16"
              rx="2.5"
              fill="#DDD3C4"
              stroke="#282522"
              strokeWidth="2.2"
            />
            <rect
              x="119"
              y="64"
              width="5"
              height="16"
              rx="2.5"
              fill="#DDD3C4"
              stroke="#282522"
              strokeWidth="2.2"
            />

            {/* Screen frame */}
            <rect
              x="47"
              y="48"
              width="66"
              height="48"
              rx="8"
              fill="#FFFDF5"
              stroke="#DDD3C4"
              strokeWidth="1.8"
            />

            {/* Coral Cheek Blushes */}
            <circle cx="56" cy="80" r="3.8" fill="#E76F51" opacity="0.6" />
            <circle cx="104" cy="80" r="3.8" fill="#E76F51" opacity="0.6" />

            {/* Eyes */}
            {blinking ? (
              // Blink lines
              <g stroke="#282522" strokeWidth="2.6" strokeLinecap="round">
                <line x1="61" y1="67" x2="71" y2="67" />
                <line x1="89" y1="67" x2="99" y2="67" />
              </g>
            ) : (
              // Open eyes with moveable pupils
              <g className="lulubot-eyes">
                {/* Left eye socket */}
                <circle cx="66" cy="66" r="7.5" fill="#282522" />
                {/* Right eye socket */}
                <circle cx="94" cy="66" r="7.5" fill="#282522" />

                {/* Left pupil highlight */}
                <circle
                  cx={64.5 + pupilX}
                  cy={64.5 + pupilY}
                  r="2.6"
                  fill="#FFFEFB"
                  style={{
                    transition: isQuiet ? "none" : "cx 120ms ease, cy 120ms ease",
                  }}
                />
                {/* Right pupil highlight */}
                <circle
                  cx={92.5 + pupilX}
                  cy={64.5 + pupilY}
                  r="2.6"
                  fill="#FFFEFB"
                  style={{
                    transition: isQuiet ? "none" : "cx 120ms ease, cy 120ms ease",
                  }}
                />
              </g>
            )}

            {/* Mouth */}
            <g className="lulubot-mouth">
              {isCurious ? (
                // Little 'o' surprised mouth
                <circle
                  cx="80"
                  cy="80"
                  r="3.2"
                  stroke="#282522"
                  strokeWidth="2.2"
                  fill="none"
                />
              ) : isDelivered ? (
                // Cheerful open smile
                <path
                  d="M74 78C76 83 84 83 86 78"
                  stroke="#282522"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                // Gentle content smile
                <path
                  d="M75 79C77 82 83 82 85 79"
                  stroke="#282522"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          </g>
        </svg>
      </button>

      {/* Accessible button focus outline */}
      <style jsx>{`
        .lulubot-button:focus-visible {
          outline: 2px dashed #345d9d;
          outline-offset: 4px;
          border-radius: 12px;
        }
        @keyframes waveHand {
          0% {
            transform: rotate(-65deg);
          }
          50% {
            transform: rotate(-25deg);
          }
          100% {
            transform: rotate(-65deg);
          }
        }
        @keyframes nodHead {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .anim-wave {
          animation: waveHand 400ms ease-in-out infinite;
        }
        .anim-nod {
          animation: nodHead 350ms ease-in-out 2;
        }
      `}</style>
    </div>
  );
}
