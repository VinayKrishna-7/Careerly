# Careerly

A full-stack resume and cover letter builder with ATS-friendly templates and PDF export.

## Features

- ATS-friendly resume templates (Jake's, Modern, Minimal, Executive)
- Live preview with PDF export
- Section customization and reordering
- ATS keyword analysis and scoring
- Cover letter builder with matching styles
- Light and dark themes

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **PDF Generation:** Puppeteer

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (optional, in-memory database used as local fallback)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VinayKrishna-7/Careerly.git
   cd Careerly
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables in `server/.env`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/careerly
   JWT_SECRET=your_jwt_secret
   COOKIE_SECRET=your_cookie_secret
   CLIENT_URL=http://localhost:5174
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:5174`
   - Backend: `http://localhost:5001`

## Scripts

- `npm run dev` - Runs frontend and backend concurrently
- `npm run build` - Builds frontend for production
- `npm run install:all` - Installs dependencies across root, server, and client

## License

MIT
