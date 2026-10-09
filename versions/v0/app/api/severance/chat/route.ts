type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const conversations = new Map<string, ChatMessage[]>();

const providers = {
  cornell: {
    label: "Cornell AI",
    apiBase: "https://api.ai.it.cornell.edu/v1",
    chatModel: "openai.gpt-5-mini",
    speechModel: "openai.gpt-4o-mini-tts",
  },
  openai: {
    label: "OpenAI",
    apiBase: "https://api.openai.com/v1",
    chatModel: "gpt-4o-mini",
    speechModel: "gpt-4o-mini-tts",
  },
} as const;

type ProviderName = keyof typeof providers;

class UpstreamError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function newConversationId() {
  return `conv_${crypto.randomUUID()}`;
}

async function upstreamError(response: Response, providerLabel: string) {
  if (response.status === 401) {
    return new UpstreamError(401, `${providerLabel} rejected this API key. Check the key and selected provider.`);
  }
  if (response.status === 403) {
    return new UpstreamError(403, `This API key does not have permission to use the selected model on ${providerLabel}.`);
  }
  if (response.status === 429) {
    return new UpstreamError(429, `${providerLabel} reported a rate limit or insufficient API credits.`);
  }
  if (response.status === 404) {
    return new UpstreamError(502, `The selected model is not available through ${providerLabel}.`);
  }
  return new UpstreamError(502, `${providerLabel} is temporarily unavailable (${response.status}).`);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      message?: string;
      conversationId?: string | null;
      system_prompt?: string;
      apiKey?: string;
      provider?: string;
    };
    const message = payload.message?.trim() || "";
    const systemPrompt = payload.system_prompt?.trim() || "You are a helpful assistant.";

    if (!message || message.length > 4_000 || systemPrompt.length > 16_000) {
      return Response.json({ error: "Invalid message." }, { status: 400 });
    }

    const apiKey = payload.apiKey?.trim() || "";
    if (!/^sk-[A-Za-z0-9_-]{20,}$/.test(apiKey)) {
      return Response.json({ error: "A valid API key is required." }, { status: 400 });
    }

    const providerName: ProviderName = payload.provider === "openai" ? "openai" : "cornell";
    const provider = providers[providerName];

    const existingId = payload.conversationId;
    const conversationId =
      existingId && /^[A-Za-z0-9_-]{1,100}$/.test(existingId)
        ? existingId
        : newConversationId();
    const history = conversations.get(conversationId) || [];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);

    const chatResponse = await fetch(`${provider.apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: provider.chatModel,
        messages: [
          { role: "developer", content: systemPrompt },
          ...history,
          { role: "user", content: message },
        ],
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!chatResponse.ok) {
      throw await upstreamError(chatResponse, provider.label);
    }

    const chatData = (await chatResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = chatData.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("The model returned no text.");

    const nextHistory: ChatMessage[] = [
      ...history,
      { role: "user", content: message },
      { role: "assistant", content: text },
    ].slice(-20);
    conversations.set(conversationId, nextHistory);
    if (conversations.size > 250) {
      const oldest = conversations.keys().next().value;
      if (oldest) conversations.delete(oldest);
    }

    let audioUrl: string | null = null;
    try {
      const speechResponse = await fetch(`${provider.apiBase}/audio/speech`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: provider.speechModel,
          voice: "nova",
          input: text.slice(0, 2_000),
          response_format: "mp3",
        }),
      });
      if (speechResponse.ok) {
        const bytes = await speechResponse.arrayBuffer();
        audioUrl = `data:audio/mpeg;base64,${Buffer.from(bytes).toString("base64")}`;
      }
    } catch {
      // Text remains fully usable when speech synthesis is unavailable.
    }

    return Response.json({ text, audioUrl, conversationId });
  } catch (error) {
    if (error instanceof UpstreamError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("Severance chat error", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "The machine is unavailable." }, { status: 500 });
  }
}
