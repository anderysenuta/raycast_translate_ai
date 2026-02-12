import { useEffect, useState } from "react";
import {
  ActionPanel,
  Form,
  Action,
  getSelectedText,
  showToast,
  Toast,
  Clipboard,
  getPreferenceValues,
} from "@raycast/api";
import { type TargetLanguage, type Preferences } from "./types";
import { translateRequest as translateWithClaude } from "./claude-api";
import { translateText as translateWithOpenAI } from "./openai-api";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [text, setText] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const handleTextChange = (newValue: string) => {
    setText(newValue);
  };

  const handleSubmit = async (lang: TargetLanguage) => {
    if (!text.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Please enter text to translate",
      });
      return;
    }

    // validate at least one api key is provided
    if (!preferences.claudeApiKey && !preferences.openaiApiKey) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Please configure Claude or OpenAI API key in preferences",
      });
      return;
    }

    setIsTranslating(true);
    setTranslation("");

    try {
      // auto-detect which api to use based on which key is provided
      // prefer claude if both are provided
      const result = preferences.claudeApiKey
        ? await translateWithClaude({ text, lang })
        : await translateWithOpenAI({ text, lang });

      setTranslation(result);

      // conditionally copy to clipboard
      if (preferences.copyToClipboard) {
        await Clipboard.copy(result);
      }

      await showToast({
        style: Toast.Style.Success,
        title: "Translation complete",
        message: preferences.copyToClipboard ? "Copied to clipboard" : undefined,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

      await showToast({
        style: Toast.Style.Failure,
        title: "Translation failed",
        message: errorMessage,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const selectedText = await getSelectedText();
        setText(selectedText);
      } catch {
        // no text selected, that's fine
      }
    };
    void init();

    return () => {
      console.log('aaa');
      setText('');
      setTranslation('');
      setIsTranslating(false);
    }
  }, []);

  return (
    <Form
      isLoading={isTranslating}
      actions={
        <ActionPanel>
          <ActionPanel.Submenu title="Translate to …">
            <Action title="EN" onAction={() => handleSubmit("en" as TargetLanguage)} />
            <Action title="RU" onAction={() => handleSubmit("ru" as TargetLanguage)} />
            <Action title="PL" onAction={() => handleSubmit("pl" as TargetLanguage)} />
          </ActionPanel.Submenu>
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="text"
        title="Source Text"
        placeholder="Enter text to translate..."
        value={text}
        onChange={handleTextChange}
      />
      <Form.Separator />
      <Form.TextArea
        id="translation"
        title="Translation"
        placeholder="Translation will appear here..."
        value={translation}
      />
    </Form>
  );
}
