# Careerly 📄✨

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**Careerly** is a modern, full-stack ATS Resume & Cover Letter Builder designed to help job seekers create professional, recruiter-ready resumes in minutes.

Built with a fast, intuitive live editor, ATS compliance checker, and instant vector PDF downloads.

---

## 🚀 Key Features

- **9 ATS-Friendly Resume Templates**: Includes popular industry standards like *Jake's Resume*, *Modern Accent*, *Executive Standard*, *MTeck's*, *Anubhav*, *Minimalist*, and more.
- **Real-Time Live Preview**: Watch your resume update instantly as you type with automatic saving.
- **Custom Resume Sections**: Add your own unique sections (e.g., Publications, Volunteer Work, Open Source) and rename or reorder existing ones easily.
- **Header Alignment Options**: Choose between **Left**, **Middle (Centered)**, or **Right** header positioning to match your style.
- **Instant Vector PDF Export**: Download high-resolution, watermark-free PDFs powered by Puppeteer.
- **ATS Match & Score Analyzer**: Evaluates your resume against key job keywords, action verbs, and quantifiable metrics to maximize interview callbacks.
- **Cover Letter Suite**: Generate and customize job-specific cover letters that match your resume style.
- **Dark & Light Mode**: Seamless dark and light themes with full visual contrast.
- **Quick Safety PIN Recovery**: Reset your password easily using your email and a personal 4–6 digit Safety PIN.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Redux Toolkit, Lucide Icons
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB with Mongoose
- **PDF Engine**: Puppeteer (Headless Chromium)

---

## 🏁 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (running locally or MongoDB Atlas connection string)

### 2. Installation
Clone the repository and install all dependencies:

```bash
git clone https://github.com/VinayKrishna-7/Careerly.git
cd Careerly
npm run install:all
```

### 3. Environment Setup
Create a `.env` file in the `server/` directory:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/resumebuilder
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
COOKIE_SECRET=your_cookie_secret_key_here
CLIENT_URL=http://localhost:5174
```

### 4. Run the Project
Start both the backend server and frontend development server with a single command:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5174](http://localhost:5174)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
