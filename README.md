# AI-Interviewer (Face-to-Face Interview UI)

This project provides a face-to-face interview experience using LiveKit for real-time audio/video and a React/Next.js UI. It includes an interview timer, chat/transcription stream, and session controls suitable for simulating an interview session.

Note: By default, this repo is configured as a frontend UI that connects to a LiveKit server. You supply your own LiveKit credentials to spin up a room and test the flow.

## Prerequisites
- Node.js 18+
- pnpm or npm
- A LiveKit server (cloud or self-hosted)

## Project Structure
- `Ai-Automation-Interview/` — Next.js app (UI)
  - `app/api/connection-details/route.ts` — Issues room tokens using your LiveKit credentials
  - `components/` — UI components (timer, chat message view, media tiles, agent control bar)
  - `hooks/` — Hooks for connection details and merged chat/transcriptions
  - `lib/` — Utility helpers and types

## Environment Variables
Create a file named `.env.local` inside `Ai-Automation-Interview/` with the following variables:

```
LIVEKIT_URL="wss://<your-livekit-host>"
LIVEKIT_API_KEY="<your-api-key>"
LIVEKIT_API_SECRET="<your-api-secret>"
```

- `LIVEKIT_URL`: Your LiveKit websocket URL (e.g., `wss://your-domain.livekit.cloud`)
- `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`: Credentials for token generation

The token issuing endpoint validates these variables at runtime and returns clear errors if missing.

## Install and Run
From the project root:

```bash
# 1) Install dependencies
pnpm install

# 2) Start the Next.js app (runs in Ai-Automation-Interview)
cd Ai-Automation-Interview
pnpm dev
```

Then open `http://localhost:3000`.

If you prefer npm:

```bash
npm install
cd Ai-Automation-Interview
npm run dev
```

## How It Works
- Start Screen: The `Welcome` component shows a start button to begin the session.
- Room Connect: When you start, the app requests connection details from `app/api/connection-details`, then connects the local participant to the LiveKit room and enables the microphone.
- Session UI:
  - `InterviewTimer` displays current phase/time and transitions through interview segments.
  - `MediaTiles` renders local video/camera and screen share tiles.
  - `ChatMessageView` displays merged chat and transcriptions via `useChatAndTranscription`.
  - `AgentControlBar` provides device controls and chat input support.

## Customization
- Timing and Phases: See `components/interview-timer.tsx` to tweak the phase durations and labels.
- Capabilities: `components/session-view.tsx` reads capabilities from `appConfig` to toggle chat/video/screenshare features.
- Styling: Tailwind CSS in `globals.css` plus component-level classes.

## Troubleshooting
- Media Permissions: If your mic/camera aren’t accessible, check browser permissions and that HTTPS is used.
- LiveKit Credentials: If `LIVEKIT_*` variables are unset or incorrect, `POST /api/connection-details` returns an error; check server logs/console.
- Disconnections: The app listens for `RoomEvent.Disconnected` and resets state safely.

## Scripts
- `pnpm dev` — Run the Next.js app in dev mode
- `pnpm build` — Build for production
- `pnpm start` — Start the production build

## License
See `LICENSE`.
