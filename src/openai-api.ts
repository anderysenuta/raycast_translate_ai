import { getPreferenceValues } from "@raycast/api";
import { type TranslateRequest, type Preferences, type OpenAIApiResponse } from "./types";
import { getTranslationPrompt } from "./prompts";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-5-mini";

export async function translateText({ text, lang }: TranslateRequest): Promise<string> {
  const preferences = getPreferenceValues<Preferences>();
  const { openaiApiKey } = preferences;

  if (!openaiApiKey) {
    throw new Error("OpenAI API key not configured. Please add it in extension preferences.");
  }

  const prompt = getTranslationPrompt(text, lang);

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as OpenAIApiResponse;

  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  }

  throw new Error("No translation returned from OpenAI API");
}
