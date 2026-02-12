import { type TargetLanguage } from "./types";

export function getTranslationPrompt(text: string, lang: TargetLanguage): string {
  return `Detect the source language automatically and translate the following text to ${lang}.
If the text is already in ${lang}, return it unchanged.
Return only the translation or original text,
without any explanations or additional text:

${text}`;
}
