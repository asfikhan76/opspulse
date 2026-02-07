# OpsPulse — AI-Powered Business Command Center

> **Prompt to Production — Peshawar 2026 | Track 05: Data & Ops**

OpsPulse is a real-time operational intelligence platform that transforms raw business data into actionable insights using AI. Ask questions in natural language, upload CSVs for instant analysis, detect anomalies, and generate executive-ready reports — all from a single command center.

## Features

- **AI-Powered Natural Language Query** — Ask questions like "Show me revenue trends" and get instant charts + insights powered by Google Gemini
- **Smart CSV Analysis** — Upload any CSV file and get AI-generated summaries, key insights, recommendations, and anomaly detection
- **Automated Report Generation** — Generate professional business reports with executive summaries, revenue analysis, KPI breakdowns, and strategic recommendations
- **Real-Time Dashboard** — Live KPI cards, revenue/profit trends, channel performance, and system health metrics
- **Anomaly Detection & Alerts** — Critical, warning, and info-level alerts with severity tracking and resolution status
- **Advanced Analytics** — Deep-dive charts for revenue vs profit, user growth, weekly patterns, and traffic channels
- **Dark/Light Mode** — Fully responsive theme support across all components

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| AI/LLM | Google Gemini 2.5 Flash |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| UI Components | Radix UI Primitives |
| Theming | next-themes |
| Data Parsing | PapaParse |

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([Get one free](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/opspulse.git
cd opspulse

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Gemini API key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (query, analyze-csv, generate-report)
│   ├── alerts/             # Anomaly alerts page
│   ├── analytics/          # Advanced analytics page
│   ├── query/              # AI query interface page
│   ├── reports/            # Report generation page
│   └── upload/             # CSV upload & analysis page
├── components/
│   ├── dashboard/          # Dashboard widgets (KPI, charts, activity feed)
│   ├── layout/             # Header, sidebar navigation
│   ├── alerts/             # Anomaly alert components
│   ├── query/              # Natural language query interface
│   ├── reports/            # Report generator component
│   ├── upload/             # CSV upload & analysis component
│   └── ui/                 # Reusable UI primitives (Button, Card, Tabs, etc.)
└── lib/                    # Utilities, data, types, Gemini client
```

## AI Integration

OpsPulse uses Google Gemini 2.5 Flash for three core AI features:

1. **Natural Language Query** (`/api/query`) — Interprets user questions, analyzes business data context, and returns structured responses with chart data and actionable insights.

2. **CSV Analysis** (`/api/analyze-csv`) — Processes uploaded CSV data through AI to generate summaries, identify patterns, flag anomalies, and recommend visualizations.

3. **Report Generation** (`/api/generate-report`) — Produces professional markdown reports with executive summaries, revenue analysis, KPI evaluations, and strategic recommendations based on real business data.

All AI features include intelligent fallbacks — if the API is unavailable, the app continues to function with pre-computed analytics.

## Screenshots

| Dashboard | AI Query | Reports |
|-----------|----------|---------|
| Real-time KPI monitoring | Ask anything in natural language | AI-generated executive reports |

## License

MIT
