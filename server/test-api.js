import 'dotenv/config';
import app from './src/app.js';
import { connectDB, closeDB } from './src/config/db.js';
import User from './src/models/User.js';
import Resume from './src/models/Resume.js';
import CoverLetter from './src/models/CoverLetter.js';

const runTests = async () => {
  console.log('🧪 Starting End-to-End API Test Suite...');
  let server;
  const PORT = 5055;

  try {
    await connectDB();

    server = app.listen(PORT);
    const BASE_URL = `http://localhost:${PORT}/api`;

    // 1. Health check
    console.log('\n▶ Testing [GET] /api/health');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('Status:', healthRes.status, 'Response:', healthData);
    if (healthRes.status !== 200) throw new Error('Health check failed');

    // 2. Register user
    console.log('\n▶ Testing [POST] /api/auth/register');
    const testEmail = `tester_${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: testEmail,
        password: 'Password@123'
      })
    });
    const regData = await regRes.json();
    console.log('Status:', regRes.status, 'User created:', regData.data?.user?.email);
    if (regRes.status !== 201) throw new Error('Registration failed');

    const token = regData.data.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    // 3. Current User /me
    console.log('\n▶ Testing [GET] /api/auth/me');
    const meRes = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders });
    const meData = await meRes.json();
    console.log('Status:', meRes.status, 'User:', meData.data?.user?.name);
    if (meRes.status !== 200) throw new Error('Auth /me failed');

    // 4. Create Resume
    console.log('\n▶ Testing [POST] /api/resumes');
    const createRes = await fetch(`${BASE_URL}/resumes`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Jane Doe — Principal Software Architect',
        template: 'modern'
      })
    });
    const createData = await createRes.json();
    const resumeId = createData.data?.resume?._id;
    console.log('Status:', createRes.status, 'Created Resume ID:', resumeId);
    if (createRes.status !== 201 || !resumeId) throw new Error('Create resume failed');

    // 5. Get Resumes list
    console.log('\n▶ Testing [GET] /api/resumes');
    const listRes = await fetch(`${BASE_URL}/resumes`, { headers: authHeaders });
    const listData = await listRes.json();
    console.log('Status:', listRes.status, 'Total Resumes in List:', listData.data?.resumes?.length);
    if (listRes.status !== 200 || listData.data?.resumes?.length < 1) throw new Error('List resumes failed');

    // 6. Update Resume
    console.log('\n▶ Testing [PUT] /api/resumes/:id');
    const updateRes = await fetch(`${BASE_URL}/resumes/${resumeId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        summary: 'Updated summary by automated test pipeline.',
        settings: { primaryColor: '#059669', fontFamily: 'Outfit' }
      })
    });
    const updateData = await updateRes.json();
    console.log('Status:', updateRes.status, 'Updated primaryColor:', updateData.data?.resume?.settings?.primaryColor);
    if (updateRes.status !== 200) throw new Error('Update resume failed');

    // 7. Duplicate Resume
    console.log('\n▶ Testing [POST] /api/resumes/:id/duplicate');
    const dupRes = await fetch(`${BASE_URL}/resumes/${resumeId}/duplicate`, {
      method: 'POST',
      headers: authHeaders
    });
    const dupData = await dupRes.json();
    const dupId = dupData.data?.resume?._id;
    console.log('Status:', dupRes.status, 'Duplicated Resume Title:', dupData.data?.resume?.title);
    if (dupRes.status !== 201) throw new Error('Duplicate resume failed');

    // 8. ATS Scoring & Job Match
    console.log('\n▶ Testing [POST] /api/resumes/:id/score (ATS Analyzer)');
    const scoreRes = await fetch(`${BASE_URL}/resumes/${resumeId}/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        jobDescription: 'Seeking Senior Full Stack Developer proficient in React, Node.js, TypeScript, Docker, and Microservices.'
      })
    });
    const scoreData = await scoreRes.json();
    console.log('Status:', scoreRes.status, 'ATS Overall Score:', scoreData.data?.overallScore, 'Categories:', scoreData.data?.categoryScores);
    if (scoreRes.status !== 200 || typeof scoreData.data?.overallScore !== 'number') throw new Error('ATS scoring failed');

    // 9. Cover Letter Auto-Text Generation
    console.log('\n▶ Testing [POST] /api/cover-letters/generate-text (AI Auto-Crafting)');
    const genTextRes = await fetch(`${BASE_URL}/cover-letters/generate-text`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        candidateName: 'Jane Doe',
        jobTitle: 'Principal Architect',
        companyName: 'Stripe',
        jobDescription: 'Looking for a high-scale architecture leader with Node.js and distributed systems background.'
      })
    });
    const genTextData = await genTextRes.json();
    console.log('Status:', genTextRes.status, 'Generated Salutation:', genTextData.data?.salutation);
    if (genTextRes.status !== 200 || !genTextData.data?.openingParagraph) throw new Error('Cover letter text generation failed');

    // 10. Create Cover Letter
    console.log('\n▶ Testing [POST] /api/cover-letters (Create)');
    const createLetterRes = await fetch(`${BASE_URL}/cover-letters`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Stripe Principal Architect Cover Letter',
        companyName: 'Stripe',
        jobTitle: 'Principal Software Architect',
        resumeId: resumeId,
        jobDescription: 'High-scale distributed systems and cloud microservices.'
      })
    });
    const createLetterData = await createLetterRes.json();
    const letterId = createLetterData.data?._id;
    console.log('Status:', createLetterRes.status, 'Created Letter ID:', letterId);
    if (createLetterRes.status !== 201 || !letterId) throw new Error('Create cover letter failed');

    // 11. Get Cover Letters List
    console.log('\n▶ Testing [GET] /api/cover-letters (List)');
    const listLettersRes = await fetch(`${BASE_URL}/cover-letters`, { headers: authHeaders });
    const listLettersData = await listLettersRes.json();
    console.log('Status:', listLettersRes.status, 'Total Cover Letters:', listLettersData.data?.length);
    if (listLettersRes.status !== 200 || listLettersData.data?.length < 1) throw new Error('List cover letters failed');

    // 12. Cover Letter PDF Generation
    console.log('\n▶ Testing [GET] /api/cover-letters/:id/pdf (Puppeteer Rendering)');
    const letterPdfRes = await fetch(`${BASE_URL}/cover-letters/${letterId}/pdf`, { headers: authHeaders });
    const letterPdfBuffer = await letterPdfRes.arrayBuffer();
    console.log('Status:', letterPdfRes.status, 'Content-Type:', letterPdfRes.headers.get('content-type'), 'PDF Bytes:', letterPdfBuffer.byteLength);
    if (letterPdfRes.status !== 200 || letterPdfBuffer.byteLength < 1000) throw new Error('Cover letter PDF generation failed');

    // 13. Resume PDF Generation
    console.log('\n▶ Testing [GET] /api/resumes/:id/pdf (Puppeteer Rendering)');
    const pdfRes = await fetch(`${BASE_URL}/resumes/${resumeId}/pdf`, { headers: authHeaders });
    const pdfBuffer = await pdfRes.arrayBuffer();
    console.log('Status:', pdfRes.status, 'Content-Type:', pdfRes.headers.get('content-type'), 'PDF Bytes:', pdfBuffer.byteLength);
    if (pdfRes.status !== 200 || pdfBuffer.byteLength < 1000) throw new Error('PDF generation failed');

    // 14. Dashboard Stats
    console.log('\n▶ Testing [GET] /api/users/dashboard-stats');
    const statsRes = await fetch(`${BASE_URL}/users/dashboard-stats`, { headers: authHeaders });
    const statsData = await statsRes.json();
    console.log('Status:', statsRes.status, 'Stats:', statsData.data);
    if (statsRes.status !== 200) throw new Error('Dashboard stats failed');

    // 15. Delete Resume & Cover Letter
    console.log('\n▶ Testing [DELETE] /api/resumes/:id');
    const delRes = await fetch(`${BASE_URL}/resumes/${dupId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    console.log('Status:', delRes.status);
    if (delRes.status !== 200) throw new Error('Delete resume failed');

    console.log('\n▶ Testing [DELETE] /api/cover-letters/:id');
    const delLetterRes = await fetch(`${BASE_URL}/cover-letters/${letterId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    console.log('Status:', delLetterRes.status);
    if (delLetterRes.status !== 200) throw new Error('Delete cover letter failed');

    console.log('\n🎉 ALL 15 API INTEGRATION TESTS PASSED PERFECTLY!\n');
  } catch (error) {
    console.error('\n❌ Test Suite Failed:', error);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await closeDB();
    process.exit(process.exitCode || 0);
  }
};

runTests();
