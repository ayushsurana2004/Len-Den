Daily Udhari (Premium Edition)
Financial Intelligence & Squad Dynamics
Daily Udhari is a high-performance, full-stack financial ledger application designed for managing group expenses and debts. Built with security as a first-class citizen, it features a proprietary settlement protocol to ensure tamper-proof transactions.

🚀 The Core Value Proposition
Secure Financial Ledger: A robust MERN-stack application that centralizes group debt tracking, automating complex expense splits and delivering real-time, accurate net-balance calculations.

Proprietary Rotating Key Protocol: Engineered a "Daily Udhari" security layer where every member possesses a unique, group-specific key that automatically rotates after every settlement. This creates a tamper-proof 2FA-style verification for all transactions, effectively mitigating replay attacks.

Engineering Rigor: Built on a modular Controller-Service-Repository architecture and reinforced with a comprehensive End-to-End (E2E) testing suite using Playwright, ensuring 100% reliability across the entire financial lifecycle.

Production-Ready Polish: Optimized user experience with asynchronous skeleton loading to eliminate layout shifts and implemented intelligent, client-side transaction filtering that keeps the interface snappy even as the transaction ledger grows.

🛠 Tech Stack
Frontend:

React.js with Vite

TypeScript

Tailwind CSS & Framer Motion

Axios for API communication

Backend:

Node.js & Express

TypeScript

PostgreSQL with TypeORM

JWT-based Authentication

Testing & DevOps:

Playwright (E2E Testing)

Render (Backend Hosting)

Vercel (Frontend Hosting)

📋 Getting Started
Prerequisites
Node.js (v20+)

PostgreSQL Database

NPM or Yarn

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/Len-Den.git
cd Len-Den
Setup Backend:

Bash
cd server
npm install
# Create a .env file with your DATABASE_URL and JWT_SECRET
npm start
Setup Frontend:

Bash
cd ../client
npm install
# Create a .env file with VITE_API_URL=http://localhost:5050
npm run dev
🔗 Live Demo
Frontend: https://daily-udhari.vercel.app/

Backend API: https://len-den.onrender.com/

Built with precision, secured by protocol.