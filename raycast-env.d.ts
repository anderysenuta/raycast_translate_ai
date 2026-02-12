/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Copy to Clipboard - Automatically copy translated text to clipboard */
  "copyToClipboard": boolean,
  /** Claude API Key - Your Anthropic Claude API key (optional - provide either Claude or OpenAI key) */
  "claudeApiKey"?: string,
  /** OpenAI API Key - Your OpenAI API key (optional - provide either Claude or OpenAI key) */
  "openaiApiKey"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `translate-ai` command */
  export type TranslateAi = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `translate-ai` command */
  export type TranslateAi = {}
}

