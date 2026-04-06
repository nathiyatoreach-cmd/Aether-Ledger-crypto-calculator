import { AssistantRequest, AssistantResult, AIProviderSettings } from "@/lib/types";

function resolveBaseUrl(settings: AIProviderSettings) {
  if (settings.baseUrl) {
    return settings.baseUrl.replace(/\/$/, "");
  }

  switch (settings.providerType) {
    case "groq":
      return "https://api.groq.com/openai/v1";
    case "together":
      return "https://api.together.xyz/v1";
    case "anthropic":
      return "https://api.anthropic.com/v1";
    case "gemini":
      return "https://generativelanguage.googleapis.com/v1beta";
    default:
      return "https://api.openai.com/v1";
  }
}

async function callOpenAICompatible(
  settings: AIProviderSettings,
  request: AssistantRequest
) {
  const baseUrl = resolveBaseUrl(settings);
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: settings.model,
      temperature: settings.temperature,
      messages: [
        { role: "system", content: request.system },
        { role: "user", content: request.prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI-compatible request failed with ${response.status}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Provider did not return any message content.");
  }

  return String(content);
}

async function callAnthropic(settings: AIProviderSettings, request: AssistantRequest) {
  const baseUrl = resolveBaseUrl(settings);
  const response = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": settings.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: settings.model,
      temperature: settings.temperature,
      max_tokens: 900,
      system: request.system,
      messages: [{ role: "user", content: request.prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed with ${response.status}`);
  }

  const payload = await response.json();
  const content = payload.content?.[0]?.text;

  if (!content) {
    throw new Error("Anthropic provider did not return text content.");
  }

  return String(content);
}

async function callGemini(settings: AIProviderSettings, request: AssistantRequest) {
  const baseUrl = resolveBaseUrl(settings);
  const endpoint = `${baseUrl}/models/${settings.model}:generateContent?key=${encodeURIComponent(
    settings.apiKey
  )}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      generationConfig: {
        temperature: settings.temperature
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${request.system}\n\n${request.prompt}`
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with ${response.status}`);
  }

  const payload = await response.json();
  const content =
    payload.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("\n")
      .trim() ?? "";

  if (!content) {
    throw new Error("Gemini provider did not return text content.");
  }

  return content;
}

export async function generateAssistantCopy(
  settings: AIProviderSettings,
  request: AssistantRequest
): Promise<AssistantResult> {
  if (!settings.apiKey.trim()) {
    throw new Error("No API key configured.");
  }

  let content = "";

  if (settings.providerType === "anthropic") {
    content = await callAnthropic(settings, request);
  } else if (settings.providerType === "gemini") {
    content = await callGemini(settings, request);
  } else {
    content = await callOpenAICompatible(settings, request);
  }

  return {
    content,
    providerUsed: settings.providerName || settings.providerType,
    mode: "live"
  };
}
