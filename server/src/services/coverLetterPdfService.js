import puppeteer from 'puppeteer';
import fs from 'fs';

const getChromeExecutablePath = () => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
};

const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const generateCoverLetterHtml = (letter) => {
  const {
    senderInfo = {},
    recipientName = 'Hiring Manager',
    recipientTitle = '',
    companyName = '',
    companyAddress = '',
    letterDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    salutation = 'Dear Hiring Manager,',
    openingParagraph = '',
    bodyParagraphs = [],
    closingParagraph = '',
    signoff = 'Sincerely,',
    template = 'modern',
    settings = {}
  } = letter;

  const primaryColor = settings.primaryColor || '#2563eb';
  const secondaryColor = settings.secondaryColor || '#475569';
  const textColor = settings.textColor || '#1e293b';
  const fontFamily = settings.fontFamily || 'Inter';

  const fontStackMap = {
    'Inter': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    'Roboto': "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    'Calibri': "Calibri, 'Segoe UI', Candara, -apple-system, sans-serif",
    'Arial': "Arial, 'Helvetica Neue', Helvetica, sans-serif",
    'Helvetica': "'Helvetica Neue', Helvetica, Arial, sans-serif",
    'Cambria': "Cambria, Georgia, 'Times New Roman', serif",
    'Times New Roman': "'Times New Roman', Times, Georgia, serif",
    'Merriweather': "'Merriweather', Georgia, serif",
    'Poppins': "'Poppins', sans-serif",
    'Outfit': "'Outfit', sans-serif",
    'Playfair Display': "'Playfair Display', Georgia, serif"
  };
  const cssFontFamily = fontStackMap[fontFamily] || `'${fontFamily}', 'Times New Roman', serif`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(letter.title || 'Cover Letter')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Outfit:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    @page {
      size: A4;
      margin: 0;
    }
    body,
    .a4-page,
    .a4-page *,
    .a4-page h1,
    .a4-page h2,
    .a4-page h3,
    .a4-page h4,
    .a4-page h5,
    .a4-page h6,
    .a4-page p,
    .a4-page span,
    .a4-page div,
    .a4-page a {
      font-family: ${cssFontFamily} !important;
    }
    body {
      color: ${textColor};
      background: #ffffff;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .a4-page {
      width: 210mm;
      min-height: 297mm;
      padding: 24mm 22mm;
      margin: 0 auto;
      background: #ffffff;
    }
    .header {
      margin-bottom: 24px;
      ${template === 'modern' ? `border-left: 4px solid ${primaryColor}; padding-left: 16px;` : ''}
      ${template === 'professional' ? `border-bottom: 2px solid ${primaryColor}; padding-bottom: 16px;` : ''}
    }
    .sender-name {
      font-size: 24px;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 4px;
    }
    .sender-title {
      font-size: 14px;
      font-weight: 500;
      color: ${secondaryColor};
      margin-bottom: 8px;
    }
    .sender-contact {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 11.5px;
      color: #64748b;
    }
    .letter-meta {
      margin-bottom: 20px;
      font-size: 12.5px;
      color: #334155;
    }
    .date-row {
      margin-bottom: 14px;
      font-weight: 500;
    }
    .recipient-block {
      line-height: 1.45;
    }
    .recipient-name {
      font-weight: 600;
      color: #0f172a;
    }
    .salutation {
      font-size: 13.5px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #0f172a;
    }
    .content-body p {
      font-size: 13px;
      color: #334155;
      margin-bottom: 14px;
      text-align: justify;
      line-height: 1.65;
    }
    .signoff-section {
      margin-top: 24px;
    }
    .signoff-text {
      font-size: 13px;
      margin-bottom: 28px;
      color: #334155;
    }
    .signature-name {
      font-size: 14px;
      font-weight: 700;
      color: ${primaryColor};
    }
  </style>
</head>
<body>
  <div class="a4-page">
    <div class="header">
      <h1 class="sender-name">${escapeHtml(senderInfo.fullName || 'Candidate')}</h1>
      ${senderInfo.location ? `<div class="sender-title">${escapeHtml(senderInfo.location)}</div>` : ''}
      <div class="sender-contact">
        ${senderInfo.email ? `<span>✉ ${escapeHtml(senderInfo.email)}</span>` : ''}
        ${senderInfo.phone ? `<span>☎ ${escapeHtml(senderInfo.phone)}</span>` : ''}
        ${senderInfo.linkedin ? `<span>🔗 ${escapeHtml(senderInfo.linkedin)}</span>` : ''}
        ${senderInfo.website ? `<span>🌐 ${escapeHtml(senderInfo.website)}</span>` : ''}
      </div>
    </div>

    <div class="letter-meta">
      <div class="date-row">${escapeHtml(letterDate)}</div>
      <div class="recipient-block">
        ${recipientName ? `<div class="recipient-name">${escapeHtml(recipientName)}</div>` : ''}
        ${recipientTitle ? `<div>${escapeHtml(recipientTitle)}</div>` : ''}
        ${companyName ? `<div>${escapeHtml(companyName)}</div>` : ''}
        ${companyAddress ? `<div>${escapeHtml(companyAddress)}</div>` : ''}
      </div>
    </div>

    <div class="salutation">${escapeHtml(salutation)}</div>

    <div class="content-body">
      ${openingParagraph ? `<p>${escapeHtml(openingParagraph)}</p>` : ''}
      ${(bodyParagraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      ${closingParagraph ? `<p>${escapeHtml(closingParagraph)}</p>` : ''}
    </div>

    <div class="signoff-section">
      <div class="signoff-text">${escapeHtml(signoff)}</div>
      <div class="signature-name">${escapeHtml(senderInfo.fullName || 'Candidate')}</div>
    </div>
  </div>
</body>
</html>
  `;
};

let browserInstance = null;

const getBrowser = async () => {
  if (!browserInstance || !browserInstance.isConnected()) {
    const executablePath = getChromeExecutablePath();
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--font-render-hinting=none'
      ]
    };
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }
    browserInstance = await puppeteer.launch(launchOptions);
  }
  return browserInstance;
};

export const generateCoverLetterPdf = async (coverLetter) => {
  const html = generateCoverLetterHtml(coverLetter);
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, {
      waitUntil: ['domcontentloaded', 'networkidle0'],
      timeout: 30000
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: true
    });

    return pdfBuffer;
  } finally {
    await page.close();
  }
};
