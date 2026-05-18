# Prototype: AI-Assisted Dynamic Webpage Builder

This project implements a component-based webpage builder with real-time preview,
structured HTML generation, and AI-powered text summarisation/simplification
using Gemini.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- AI: Gemini API via `@google/generative-ai`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
copy .env.example .env
```

3. Add your Gemini key, port, and Firebase config in `.env`:

```env
GEMINI_API_KEY=your_key_here
PORT=3000
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

4. Run frontend + backend together:

```bash
npm run dev:all
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:3000`.

## Firestore Save Flow

- The image component lets users choose a local file from their computer.
- The file is converted to a data URL and stored in the component data.
- The full page layout, including images, can be saved to Firestore with the `Save to Firestore` button.
- The `Load from Firestore` button restores the saved page document.
- Because the image is stored as a data URL, keep uploads reasonably small.

## Implemented Features

1. Dynamic HTML webpage generation from section data
2. Component-based section system (header, text, image, content block)
3. Interactive builder UI for add/remove/reorder/edit operations
4. Real-time page preview as content changes
5. AI summarisation with Gemini API
6. AI simplification for readability improvement
7. Node.js backend integration for API processing
8. External API-based AI integration (Gemini)
9. Editable content system for all sections
10. Automated content processing with one-click AI actions
11. Structured layout generation to keep output consistent
12. Usability-focused UI flow
13. Efficiency improvements via reusable components and automation
14. Readability improvements via simplification pipeline

## API Endpoints

- `GET /api/health`: health check
- `POST /api/process-text`
	- Body:

```json
{
	"inputText": "Long text here",
	"mode": "summarize"
}
```

`mode` accepts `summarize` or `simplify`.
