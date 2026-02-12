# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Raycast extension called "translate-ai" - a translation tool that integrates with Raycast on macOS and Windows. 
The extension translates selected text (captured automatically) or text provided in the textarea to a selected target language. 
Supported languages: English (en), Polish (pl), Russian (ru).

## Development Commands

### Build and Run
```bash
npm run build        # build the extension using ray build
npm run dev          # run in development mode using ray develop
```

### Linting
```bash
npm run lint         # check code style with ray lint
npm run fix-lint     # auto-fix linting issues with ray lint --fix
```

### Publishing
```bash
npm run publish      # publish to Raycast Store using @raycast/api publish
```

Note: Direct npm publish is blocked - use `npm run publish` for Raycast Store deployment.

## Architecture

### Extension Structure
- Single command extension with one view mode command: "Translate AI"
- Main entry point: `src/translate-ai.tsx`
- Claude API integration: `src/claude-api.ts` (handles translation requests)
- Extension metadata: defined in `package.json` with Raycast schema
- Auto-generated type definitions: `raycast-env.d.ts` (generated from manifest, do not modify)

### API Integration
The `claude-api.ts` file provides:
- `translateText()`: main function to translate text using Claude API
- Support for three target languages: en, pl, ru
- Uses Claude Haiku 4.5 model (claude-haiku-4-5-20251001) for fast, cost-effective translations
- API key configured via Raycast extension preferences
- Proper error handling for API failures

### Configuration
Configure your Claude API key in Raycast extension preferences:
1. Open Raycast
2. Go to Extensions → Translate AI → Preferences
3. Enter your Anthropic API key (starts with `sk-ant-...`)

### Key Technologies
- **Raycast API** (`@raycast/api`): Core framework for building Raycast extensions
- **Raycast Utils** (`@raycast/utils`): Utility hooks like `useFetch`
- **React**: UI components using React with TypeScript
- **TypeScript**: Strict mode enabled with ES2023 target

### Main Component Pattern
The extension uses Raycast's Form component pattern:
- `getSelectedText()`: Captures currently selected text from the system on load
- Form state management with React hooks (`useState`, `useEffect`)
- `ActionPanel` with `Action.SubmitForm` for form submission
- Form components: `Form.TextArea`, `Form.Dropdown`, `Form.Separator`
- Toast notifications for success/error feedback

### Data Flow
1. Extension loads and attempts to capture selected text via `getSelectedText()`
2. Source text is displayed in first textarea (editable)
3. User selects target language from dropdown (en/pl/ru)
4. User submits form to trigger translation
5. `translateText()` API call is made with loading state
6. Translation result appears in second textarea (read-only)
7. Toast notification shows success or error message

## TypeScript Configuration
- Strict mode enabled
- CommonJS modules
- ES2023 target and lib
- JSX transforms to React JSX (react-jsx)
- Isolated modules for better build performance
