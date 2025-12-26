# nomore - Student Well-being PWA

A Progressive Web App focused on student well-being, disciplined productivity, and responsible AI usage.

## 🎯 Purpose

nomore helps students maintain discipline without burnout, supports mental well-being (non-medical), reduces screen addiction, and promotes ethical learning while avoiding addictive UX patterns.

## 🧱 Tech Stack

- **Frontend**: React + TypeScript + PWA
- **Backend**: Azure Functions (Node.js)
- **Database**: Azure Cosmos DB (SQL API)
- **Storage**: Azure Blob Storage
- **AI**: Azure OpenAI API
- **Auth**: Azure AD B2C
- **Hosting**: Azure Static Web Apps + Azure Functions

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- Azure CLI
- Azure Functions Core Tools

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
func start
```

### Environment Variables
Copy `.env.example` to `.env` and fill in your Azure credentials:
- AZURE_OPENAI_ENDPOINT
- AZURE_OPENAI_KEY
- COSMOS_DB_ENDPOINT
- COSMOS_DB_KEY
- BLOB_STORAGE_CONNECTION_STRING

## 📁 Project Structure

```
nomore/
├── frontend/          # React PWA
├── backend/           # Azure Functions
├── docs/             # Documentation
├── .env.example      # Environment template
└── README.md         # This file
```

## 🔐 Ethical AI Boundaries

This app implements strict AI usage guidelines:
- ❌ NO full assignment generation
- ❌ NO direct exam answers
- ❌ NO medical/financial advice
- ✅ Concept explanations only
- ✅ Encourages independent thinking

## 📖 Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md)
- [AI Usage Guidelines](./docs/AI_USAGE.md)

## 🏆 Built for Imagine Cup 2026

Focusing on student impact and responsible technology use.