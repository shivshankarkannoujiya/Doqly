# Doqly

Doqly is a full‑stack document question‑answering application that ingests PDF documents, extracts embeddings, stores them in a vector store, and provides an interactive RAG (retrieval‑augmented generation) chat interface.

Key capabilities:

- Upload and process PDFs (background worker + queue)
- Store embeddings in Qdrant and perform semantic search
- Query documents via an interactive chat UI with cited sources

---

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Getting started (development)](#getting-started-development)
- [Environment variables](#environment-variables)
- [Docker (optional)](#docker-optional)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License & contact](#license--contact)

---

## Features

- Upload multi‑page PDFs and process them asynchronously
- Background PDF parsing and embedding via worker queues
- Vector search using Qdrant for high‑quality retrieval
- Chat UI with provenance / citations for answers

## Architecture

- Frontend: Next.js app (app/ directory) — UI for uploading documents and chatting
- Backend: Bun + Express TypeScript server (backend/) — API, ingestion endpoints, and job queue
- Worker: background worker processes PDF parsing and indexing (backend/src/workers)
- Queue & cache: Valkey/Redis (used via BullMQ)
- Vector store: Qdrant (stores embeddings and supports semantic search)
- LLM / embeddings: OpenAI (configured via OPENAI_API_KEY)

## Tech stack

- Frontend: Next.js, React, Tailwind (TypeScript)
- Backend: TypeScript, Express, Bun runtime, BullMQ, LangChain
- Storage & infra: Qdrant, Valkey (Redis), Docker Compose optional

## Getting started (development)

Prerequisites

- Node.js (for frontend) — recommended LTS
- Bun (for backend) — used by backend scripts
- Docker (optional) — to run `qdrant` and `valkey` locally

Frontend

1. Open a terminal and install dependencies:

```bash
cd frontend
npm install
```

2. Run the dev server:

```bash
npm run dev
```

Backend

1. Open a terminal and install dependencies with Bun:

```bash
cd backend
bun install
```

2. Configure environment variables (see below)

3. Start the dev server:

```bash
bun run dev
```

4. Run the background worker (PDF processing):

```bash
bun run worker
```

The frontend communicates with the backend using `NEXT_PUBLIC_API_URL` (see environment variables).

## Environment variables

Create `.env` (backend) and `.env.local` (frontend) files as needed. The backend expects the following variables (see `backend/src/config/env.config.ts`):

- `PORT` — port the backend listens on (default: 8000)
- `VALKEY_HOST` — valkey/redis host (default: localhost)
- `VALKEY_PORT` — valkey/redis port (default: 6379)
- `OPENAI_API_KEY` — **required** — key for OpenAI API
- `QDRANT_URL` — URL for Qdrant (must be a valid URL)
- `QDRANT_COLLECTION_NAME` — collection name to use in Qdrant

Frontend environment:

- `NEXT_PUBLIC_API_URL` — base URL for the backend API (e.g. `http://localhost:8000`)

## Docker (optional)

The repository includes a simple `backend/docker-compose.yml` that can launch local `valkey` and `qdrant` instances for development:

```bash
cd backend
docker compose up -d
```

After the services are up, point your backend `QDRANT_URL` and `VALKEY_HOST` to the compose services (defaults are `http://localhost:6333` for Qdrant and host `localhost`, port `6379` for valkey).

## Deployment

- Frontend: build with `npm run build` in `frontend` and serve with `npm start` or deploy to any static/Node host that supports Next.js.
- Backend: run with Bun in production (`bun run start`). For production deployments consider containerizing the backend and running Qdrant and Redis in managed services.

## Contributing

- Fork, create a feature branch, and open a pull request with a clear description and any testing notes.
- Add or update tests and keep changes scoped.

## License & contact

This project does not include a license file by default. Add a `LICENSE` if you intend to open source it.
