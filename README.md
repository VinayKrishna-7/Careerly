# Careerly

A clean, web-based resume and cover letter builder designed for ATS-friendly formatting and PDF export.

---

## Features

- **ATS-Compliant Templates**: Standardized single-page and multi-section layouts (Jake's, MTeck's, Minimal, Executive) designed for ATS parsers.
- **Live Preview & Vector PDF Export**: Real-time rendering with high-resolution vector PDF downloads via Puppeteer.
- **Section Customization**: Reorder, add, or rename sections with configurable header alignments.
- **ATS Keyword & Score Checker**: Analyzes resumes for measurable impact, action verbs, and keyword density against job descriptions.
- **Cover Letter Suite**: Compose and export matching cover letters.
- **Dark & Light Mode**: High-contrast theme system with dynamic browser favicon synchronization.
- **Zero-Config Local Dev**: Automatic in-memory database fallback if a local MongoDB instance is not running.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express (ES Modules)
- **Database**: MongoDB, Mongoose
- **Export**: Puppeteer (Headless Chromium)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (optional; defaults to in-memory MongoDB for local evaluation)

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

3. Configure environment variables in `server/.env`:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/resumebuilder
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=7d
   COOKIE_SECRET=your_cookie_secret_here
   CLIENT_URL=http://localhost:5174
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```

   - Client: http://localhost:5174
   - API: http://localhost:5001

## Scripts

- `npm run dev`: Runs both client and server concurrently
- `npm run dev:client`: Runs Vite frontend only
- `npm run dev:server`: Runs Express backend only
- `npm run build`: Builds frontend production bundle
- `npm run install:all`: Installs root, client, and server dependencies

## License

MIT
