# CareTrack | Healthcare Operations Issue Tracker

CareTrack is a full-stack issue-tracking application designed to help healthcare operations teams manage, monitor, and resolve operational issues. It provides a centralized dashboard, issue management, a Kanban board, and AI-powered issue summaries using an LLM through OpenRouter.

**[Live Demo](https://care-track-five.vercel.app/)**

## Features

- **Dashboard:** View total issues, status distribution, priority metrics, and recently updated issues.
- **Issue Management:** Create, view, edit, delete, and search issues.
- **Filtering:** Filter issues by status, priority, and category.
- **Kanban Board:** Organize issues by status and update their progress.
- **AI-Powered Summaries:** Generate structured issue summaries, key observations, and three recommended next steps using an LLM.
- **Input Validation:** Validate and normalize incoming requests using Zod and Mongoose.
- **API Health Monitoring:** Check backend and database connectivity.
- **Responsive UI:** Navigate the application across desktop and mobile layouts.
- **Error Handling:** Centralized API error responses and user-friendly frontend feedback.
- **Mock API Mode:** Run the frontend with synthetic data for offline UI development.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Routing | React Router |
| API Communication | Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Validation | Zod |
| AI Integration | OpenRouter, OpenAI SDK |
| Data Visualization | Recharts |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```text
                   ┌─────────────────────┐
                   │   React + Vite UI   │
                   │ Dashboard / Issues  │
                   │     Kanban Board    │
                   └──────────┬──────────┘
                              │
                         Axios Client
                              │
                   ┌──────────▼──────────┐
                   │    Express 5 API    │
                   │                     │
                   │ Routes & Middleware │
                   │ Zod Validation      │
                   │ Controllers         │
                   └──────┬───────┬──────┘
                          │       │
                 ┌────────▼───┐   └──────────────┐
                 │  Mongoose  │                  │
                 └──────┬─────┘           ┌──────▼──────┐
                        │                 │ AI Service  │
                 ┌──────▼─────┐           │ OpenRouter  │
                 │  MongoDB   │           │ JSON + Zod  │
                 └────────────┘           └─────────────┘
```

### Request Flow

**Issue management**

1. The user performs an action in the React interface.
2. Axios sends a request to the Express API.
3. Route middleware validates incoming data using Zod.
4. The controller executes the relevant business logic.
5. Mongoose interacts with MongoDB.
6. The API returns a consistent JSON response to the client.

**AI summarization**

1. The client sends an issue's details to `POST /api/ai/summarize`.
2. The backend validates the request.
3. The AI service sends the issue details to an OpenRouter-hosted model.
4. The model returns a structured JSON response.
5. The backend parses the output and validates it against a Zod schema.
6. The validated summary is returned to the frontend.

The AI prompt restricts the model to the supplied issue information, discourages invented facts and medical advice, and treats issue descriptions as untrusted input.

## AI Integration and Reliability

The AI summarization service includes several safeguards:

- **Structured output:** Requests JSON-formatted responses where supported.
- **Schema validation:** Validates the response structure using Zod, including exactly three next steps.
- **Fallback handling:** Retries without JSON response mode if the provider rejects that option.
- **Timeout protection:** Uses a 30-second provider timeout.
- **Error mapping:** Handles provider timeouts, authentication failures, rate limits, and upstream errors.
- **Prompt-injection mitigation:** Instructs the model not to follow instructions embedded in issue content.

These safeguards improve reliability but do not guarantee that every generated summary is factually correct.

## API Endpoints

Base path: `/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check API and database status |
| GET | `/issues` | List issues with optional filters and search |
| GET | `/issues/:id` | Retrieve an issue by ID |
| POST | `/issues` | Create an issue |
| PUT | `/issues/:id` | Update an existing issue |
| DELETE | `/issues/:id` | Delete an issue |
| POST | `/ai/summarize` | Generate an AI-powered issue summary |

Issue listing supports status, priority, category, and text-search filters.

## Project Structure

```text
CareTrack/
├── client/
│   ├── src/
│   │   ├── api/             # Axios client and API functions
│   │   ├── components/      # Reusable UI components and modals
│   │   ├── constants/       # Navigation and issue metadata
│   │   ├── data/            # Mock data
│   │   ├── hooks/           # Issue fetching and debounce hooks
│   │   ├── layout/          # Application layout and sidebar
│   │   ├── pages/           # Dashboard, Issues, Kanban
│   │   └── utils/           # Statistics and formatting helpers
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── constants/       # Issue enums
│   │   ├── controllers/     # Request handlers
│   │   ├── db/              # MongoDB connection
│   │   ├── middleware/      # Validation and error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # AI summarization service
│   │   └── validators/      # Zod schemas
│   └── package.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB instance or MongoDB Atlas database
- OpenRouter API key for AI summarization

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd CareTrack
```

Replace the placeholder with your actual GitHub repository URL.

### 2. Install dependencies

Install the root dependencies if required by your root `package.json`:

```bash
npm install
```

Install the client and server dependencies:

```bash
cd client
npm install
cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `server` directory.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
CLIENT_ORIGIN=http://localhost:5173
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_supported_openrouter_model
```

Use the variable names and formats expected by the server's environment validator. The AI key and model are optional for starting the API, but AI summarization requires valid configuration.

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_API=false
```

Set `VITE_API_BASE_URL` to your deployed API URL when running against the production backend. Use mock mode only when you want the frontend to run on synthetic data.

**Important:** Never commit `.env` files or expose API keys in frontend environment variables. Vite exposes variables prefixed with `VITE_` to browser code.

### 4. Start the backend

```bash
cd server
npm run dev
```

Use the development script defined in `server/package.json`. If the project does not provide one, use its configured start script.

### 5. Start the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Deployment

- **Frontend:** Deployed on Vercel.
- **Backend:** Deployed on Render.
- **Database:** MongoDB.

Live application: **[https://care-track-five.vercel.app/](https://care-track-five.vercel.app/)**

For a successful deployment, configure the frontend API base URL, backend environment variables, MongoDB network access, and allowed CORS origins for the deployed frontend.

## Engineering Highlights

- Separated routing, validation, controllers, models, and services to keep backend responsibilities clear.
- Used Zod at the API boundary and Mongoose validation at the persistence layer.
- Rejected unexpected request fields to reduce mass-assignment risks.
- Escaped user-provided search text before constructing regular expressions.
- Centralized error handling for consistent client responses.
- Used debouncing to reduce unnecessary search requests.
- Added request-ID tracking in the AI summary modal to prevent stale responses from replacing newer results.
- Implemented graceful shutdown handling and database health reporting.

## Current Limitations

- No authentication or role-based access control.
- No API rate limiting on AI summarization.
- No pagination for issue listings.
- No caching or automatic retry strategy for AI requests.
- Kanban status updates use dropdowns rather than drag-and-drop.
- Search and filtering can require optimization for larger datasets.

## Future Improvements

- Add authentication and role-based permissions.
- Implement pagination and database indexing.
- Add rate limiting and usage controls for AI requests.
- Introduce automated unit and integration tests.
- Add optimistic UI updates and drag-and-drop Kanban interactions.
- Improve observability with structured logging and monitoring.

## Author

**Atharva Gaur**

Computer Science Engineering | AI & Machine Learning

[GitHub](https://github.com/Atharvagaur)

---

*CareTrack is a portfolio project demonstrating full-stack development, REST API design, database integration, validation, and LLM integration. It is not intended to provide medical advice or replace clinical decision-making.*
