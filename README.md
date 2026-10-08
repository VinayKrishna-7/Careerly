# Careerly

A web application to create, customize, and export ATS-friendly resumes and cover letters to PDF.

[Live Demo](https://careerly-9q76.onrender.com/)

> Note: The demo is hosted on Render's free tier. If the service has been idle, the server automatically sleeps to conserve resources—please allow 30–50 seconds for the initial wake-up on your first visit. Once loaded, all features run normally.

## Features

- Multiple resume templates (Jake's, MTeck, Minimal, Modern, Executive)
- Live preview while editing
- Custom sections, reordering, and layout adjustments
- ATS score and keyword analysis against job descriptions
- Matching cover letter builder
- One-click PDF export

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express, Puppeteer
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (optional — uses an in-memory database fallback for local testing if MongoDB isn't running)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/VinayKrishna-7/Careerly.git
   cd Careerly
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Create a `.env` file in the `server` folder:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/resumebuilder
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   COOKIE_SECRET=your_cookie_secret
   CLIENT_URL=http://localhost:5174
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

   - Client: `http://localhost:5174`
   - Server: `http://localhost:5001`

## License

MIT
