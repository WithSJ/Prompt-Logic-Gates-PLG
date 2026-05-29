---
category: documentation
updated: 2026-05-29
tags: [plg, api, ai, providers, configuration]
---

# API & AI Integration

This document covers how PLG connects to AI providers, how to configure API keys, how the CORS proxy works, and what happens during AI-assisted compilation.

---

## Supported AI Providers

| Provider | Default Model | API Endpoint (proxied) | Key Format |
| :--- | :--- | :--- | :--- |
| **Anthropic (Claude)** | `claude-3-5-sonnet-latest` | `/api/anthropic/v1/messages` | `sk-ant-...` |
| **OpenAI (ChatGPT)** | `gpt-4o-mini` | `/api/openai/v1/chat/completions` | `sk-...` |
| **Google (Gemini)** | `gemini-1.5-flash` | `/api/google/v1beta/models/{model}:generateContent` | `AIza...` |
| **OpenRouter** | `openai/gpt-4o-mini` | `/api/openrouter/api/v1/chat/completions` | `sk-or-...` |

---

## Configuration Steps

1. Click **AI Models** in the top bar.
2. Switch **Compiler Mode** to **AI-assisted**.
3. Select your provider.
4. Enter your API key in the password field.
5. Optionally change the model version.
6. Click **Test Connection** to verify the key works.
7. Click **Save & Close**.

Settings are persisted in `localStorage` under the key `plg_settings`.

---

## How AI Calls Work

The core function `callAI(system, user, settings)` in [semanticCompiler.js](file:///c:/Users/jadam/Desktop/PLG/src/compiler/semanticCompiler.js) handles all provider communication.

### Request Format by Provider

#### Anthropic (Claude)
```javascript
fetch('/api/anthropic/v1/messages', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': key,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-latest',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  })
});
```

#### OpenAI (ChatGPT)
```javascript
fetch('/api/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + key
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2
  })
});
```

#### Google (Gemini)
```javascript
fetch(`/api/google/v1beta/models/${model}:generateContent?key=${key}`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: { temperature: 0.2 }
  })
});
```

#### OpenRouter
```javascript
fetch('/api/openrouter/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + key,
    'X-Title': 'PLG IDE'
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2
  })
});
```

---

## CORS Proxy Configuration

Browsers block cross-origin API calls. PLG solves this with Vite's built-in proxy server. The proxy rules in [vite.config.js](file:///c:/Users/jadam/Desktop/PLG/vite.config.js) are:

```javascript
server: {
  proxy: {
    '/api/anthropic': {
      target: 'https://api.anthropic.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/anthropic/, '')
    },
    '/api/openai': {
      target: 'https://api.openai.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/openai/, '')
    },
    '/api/google': {
      target: 'https://generativelanguage.googleapis.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/google/, '')
    },
    '/api/openrouter': {
      target: 'https://openrouter.ai',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/openrouter/, '')
    }
  }
}
```

**Important**: This proxy only works with `npm run dev`. For production deployment, you would need:
- A backend proxy server (e.g., Express, Cloudflare Worker)
- Or an edge function that forwards requests to the AI provider

---

## Security Notes

- API keys are stored **only** in the browser's LocalStorage
- Keys are sent **directly** to the provider via the CORS proxy — they never touch a third-party server
- The `anthropic-dangerous-direct-browser-access` header is required by Anthropic for browser-based calls
- All temperatures are set to `0.2` for deterministic, focused responses
- Max tokens are set to `1024` — sufficient for prompt compilation

---

## Test Connection Feature

The Settings Modal includes a **Test Connection** button that:
1. Sends a minimal prompt to the selected provider: `System: "Reply with OK."` / `User: "Reply with OK."`
2. Shows the response (truncated to 30 characters)
3. Displays success (✅) or error (❌) with the error message

This uses the same `callAI()` function as compilation, ensuring the test validates the exact same code path.

---

## Error Handling

If an AI call fails during compilation:
1. The error is caught per-gate
2. A stage trace is recorded: `"✕ AI Call Failed for AND. Falling back to Rule-based logic."`
3. The gate runs its offline rule-based fallback
4. Compilation continues with the next gate
5. A toast notification shows: `"Compilation failed"` or the specific error message

Common error causes:
- Invalid API key → 401 Unauthorized
- Insufficient credits → 402 Payment Required
- Rate limiting → 429 Too Many Requests
- Network issues → fetch failure
- Invalid model name → 404 Not Found

---

## Changing Models

You can use any model your provider supports by editing the **Model Version** field:

### Anthropic Examples
- `claude-3-5-sonnet-latest` (default, best balance)
- `claude-3-opus-latest` (highest quality, slower)
- `claude-3-haiku-20240307` (fastest, cheaper)

### OpenAI Examples
- `gpt-4o-mini` (default, fast and cheap)
- `gpt-4o` (higher quality)
- `gpt-4-turbo` (previous generation)

### Google Examples
- `gemini-1.5-flash` (default, fast)
- `gemini-1.5-pro` (higher quality)
- `gemini-2.0-flash` (latest)

### OpenRouter Examples
- `openai/gpt-4o-mini` (default)
- `anthropic/claude-3.5-sonnet` (access Claude via OpenRouter)
- `meta-llama/llama-3-70b-instruct` (open-source)
- Any model listed on [openrouter.ai/models](https://openrouter.ai/models)
