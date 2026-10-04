import puppeteer from 'puppeteer';
import fs from 'fs';

// Helper to escape HTML to prevent XSS
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Helper to ensure URL protocol
const ensureUrl = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

// Helper to format clean display URL
const formatCleanUrl = (url) => {
  if (!url) return '';
  return String(url)
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '');
};

export const generateResumeHtml = (resume) => {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    achievements = [],
    interests = [],
    customSections = [],
    sectionOrder = [],
    sectionTitles = {},
    sectionVisibility = {},
    settings = {},
    template = 'modern'
  } = resume;

  const primaryColor = settings.primaryColor || '#2563eb';
  const secondaryColor = settings.secondaryColor || '#475569';
  const textColor = settings.textColor || '#1e293b';
  const sectionTitleColor = settings.sectionTitleColor || primaryColor;
  const sectionTitleFontWeight = settings.sectionTitleFontWeight || '800';
  const bodyFontWeight = settings.bodyFontWeight || '400';
  const roleFontWeight = settings.roleFontWeight || '700';
  const contactFontWeight = settings.contactFontWeight || '400';
  const linksFontWeight = settings.linksFontWeight || '600';
  const fontFamily = settings.fontFamily || 'Inter';
  const nameFontSize = settings.nameFontSize || 28;
  const roleFontSize = settings.roleFontSize || 16;
  const contactFontSize = settings.contactFontSize || 12.5;
  const linksFontSize = settings.linksFontSize || 12.5;
  const sectionTitleFontSize = settings.sectionTitleFontSize || 16;
  const bodyFontSize = settings.bodyFontSize || 13.5;
  const fontSize = `${bodyFontSize}px`;
  const lineSpacing = settings.lineSpacing === 'compact' ? '1.3' : settings.lineSpacing === 'relaxed' ? '1.7' : '1.5';
  const marginSize = settings.pageMargin === 'compact' ? '12mm' : settings.pageMargin === 'wide' ? '18mm' : '15mm';

  // Format date helper
  const formatDate = (dateStr, current = false) => {
    if (current) return 'Present';
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 2) {
        const date = new Date(parts[0], parts[1] - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Section renderers
  const renderSummary = () => {
    if (!summary || sectionVisibility.summary === false) return '';
    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(sectionTitles?.summary || 'Professional summary')}</h2>
        <div class="section-content summary-text">${escapeHtml(summary)}</div>
      </section>
    `;
  };

  const renderExperience = () => {
    if (!experience?.length || sectionVisibility.experience === false) return '';
    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(sectionTitles?.experience || 'Experience')}</h2>
        <div class="section-content">
          ${experience
            .map(
              (exp) => `
            <div class="entry-block">
              <div class="entry-header">
                <span class="entry-title">${escapeHtml(exp.position)}</span>
                <span class="entry-date">${formatDate(exp.startDate)} – ${formatDate(exp.endDate, exp.current)}</span>
              </div>
              <div class="entry-company">${escapeHtml(exp.company)}${exp.location ? ` &bull; ${escapeHtml(exp.location)}` : ''}</div>
              ${exp.description ? `<div class="entry-description">${escapeHtml(exp.description)}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </section>
    `;
  };

  const renderEducation = () => {
    if (!education?.length || sectionVisibility.education === false) return '';
    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(sectionTitles?.education || 'Education')}</h2>
        <div class="section-content">
          ${education
            .map(
              (edu) => `
            <div class="entry-block">
              <div class="entry-header">
                <span class="entry-title">${escapeHtml(edu.degree)}${edu.fieldOfStudy ? ` in ${escapeHtml(edu.fieldOfStudy)}` : ''}</span>
                <span class="entry-date">${formatDate(edu.startDate)} – ${formatDate(edu.endDate, edu.current)}</span>
              </div>
              <div class="entry-company">${escapeHtml(edu.institution)}${edu.gpa ? ` &bull; GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
              ${edu.description ? `<div class="entry-description">${escapeHtml(edu.description)}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </section>
    `;
  };

  const renderSkills = () => {
    if (!skills?.length || sectionVisibility.skills === false) return '';

    // Group skills by category for clean vertical aligned display
    const categoryMap = {};
    skills.forEach((s) => {
      const cat = s.category || 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(s.name);
    });
    const categories = Object.entries(categoryMap);

    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(sectionTitles?.skills || 'Skills')}</h2>
        <div class="section-content">
          ${categories
            .map(
              ([cat, items]) => `
            <div class="vertical-bullet-row">
              <div class="vertical-bullet-content">
                <span class="bullet-dot" style="color: ${primaryColor}">•</span>
                <strong class="bullet-title">${escapeHtml(cat)}:</strong>
                <span class="bullet-desc">${escapeHtml(items.join(', '))}</span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </section>
    `;
  };

  const renderProjects = () => {
    if (!projects?.length || sectionVisibility.projects === false) return '';
    const linkStyle = settings.projectLinkStyle || 'name';

    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(sectionTitles?.projects || 'Projects')}</h2>
        <div class="section-content">
          ${projects
            .map((proj) => {
              const bullets = (proj.description || '')
                .split('\n')
                .map((l) => l.replace(/^[-*•]\s*/, '').trim())
                .filter(Boolean);

              const liveLabel = linkStyle === 'url' ? formatCleanUrl(proj.liveUrl) : 'Live Demo ↗';
              const githubLabel = linkStyle === 'url' ? formatCleanUrl(proj.githubUrl) : 'GitHub ↗';

              return `
            <div class="entry-block">
              <div class="entry-header">
                <span class="entry-title">${escapeHtml(proj.title)}${proj.role ? ` — ${escapeHtml(proj.role)}` : ''}</span>
                ${proj.startDate || proj.endDate ? `<span class="entry-date">${formatDate(proj.startDate)} – ${formatDate(proj.endDate)}</span>` : ''}
              </div>
              ${
                proj.liveUrl || proj.githubUrl
                  ? `
                <div class="entry-links">
                  ${proj.liveUrl ? `<a href="${ensureUrl(proj.liveUrl)}" class="entry-link" target="_blank">${escapeHtml(liveLabel)}</a>` : ''}
                  ${proj.githubUrl ? `<a href="${ensureUrl(proj.githubUrl)}" class="entry-link" target="_blank">${escapeHtml(githubLabel)}</a>` : ''}
                </div>
              `
                  : ''
              }
              ${
                bullets.length > 0
                  ? `
                <ul class="bullet-list">
                  ${bullets
                    .map(
                      (b) => `
                    <li class="bullet-item">
                      <span class="bullet-dot" style="color: ${primaryColor}">•</span>
                      <span>${escapeHtml(b)}</span>
                    </li>
                  `
                    )
                    .join('')}
                </ul>
              `
                  : ''
              }
              ${
                proj.technologies?.length > 0
                  ? `
                <div class="tech-stack-row">
                  Technologies: ${proj.technologies.map((t) => escapeHtml(t)).join(', ')}
                </div>
              `
                  : ''
              }
            </div>
          `;
            })
            .join('')}
        </div>
      </section>
    `;
  };

  const renderCertifications = () => {
    if (!certifications?.length || sectionVisibility.certifications === false) return '';
    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(sectionTitles?.certifications || 'Certifications')}</h2>
        <div class="section-content">
          ${certifications
            .map(
              (c) => `
            <div class="vertical-bullet-row">
              <div class="vertical-bullet-content">
                <span class="bullet-dot" style="color: ${primaryColor}">•</span>
                <strong class="bullet-title">${escapeHtml(c.name)}</strong>
                ${c.issuer ? `<span class="bullet-company"> &bull; ${escapeHtml(c.issuer)}</span>` : ''}
              </div>
              ${c.issueDate ? `<span class="bullet-date">${formatDate(c.issueDate)}</span>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </section>
    `;
  };

  const renderLanguages = () => {
    if (!languages?.length || sectionVisibility.languages === false) return '';
    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(sectionTitles?.languages || 'Languages')}</h2>
        <div class="section-content">
          ${languages
            .map(
              (l) => `
            <div class="vertical-bullet-row">
              <div class="vertical-bullet-content">
                <span class="bullet-dot" style="color: ${primaryColor}">•</span>
                <strong class="bullet-title">${escapeHtml(l.language)}:</strong>
                <span class="bullet-desc">${escapeHtml(l.proficiency || '')}</span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </section>
    `;
  };

  const renderAchievements = () => {
    if (!achievements?.length || sectionVisibility.achievements === false) return '';
    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(sectionTitles?.achievements || 'Achievements & Activities')}</h2>
        <div class="section-content">
          ${achievements
            .map(
              (a) => `
            <div class="achievement-bullet-block">
              <div class="vertical-bullet-row">
                <div class="vertical-bullet-content">
                  <span class="bullet-dot" style="color: ${primaryColor}">•</span>
                  <strong class="bullet-title">${escapeHtml(a.title)}</strong>
                  ${a.issuer ? `<span class="bullet-company"> &bull; ${escapeHtml(a.issuer)}</span>` : ''}
                </div>
                ${a.date ? `<span class="bullet-date">${formatDate(a.date)}</span>` : ''}
              </div>
              ${a.description ? `<div class="achievement-desc">${escapeHtml(a.description)}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </section>
    `;
  };

  const renderInterests = () => {
    if (!interests?.length || sectionVisibility.interests === false) return '';
    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(sectionTitles?.interests || 'Interests')}</h2>
        <div class="section-content">
          <div class="vertical-bullet-row">
            <div class="vertical-bullet-content">
              <span class="bullet-dot" style="color: ${primaryColor}">•</span>
              <span class="bullet-desc">${interests.map((item) => escapeHtml(item.name)).filter(Boolean).join(', ')}</span>
            </div>
          </div>
        </div>
      </section>
    `;
  };

  const renderCustomSection = (sec) => {
    if (!sec || sectionVisibility[sec.id] === false) return '';
    const items = sec.items || [];
    if (!items.length) return '';
    const title = sectionTitles[sec.id] || sec.title || 'Custom Section';

    return `
      <section class="section">
        <h2 class="section-title">${escapeHtml(title)}</h2>
        <div class="section-content">
          ${items
            .map((it) => {
              const bullets = (it.description || '')
                .split('\n')
                .map((l) => l.replace(/^[-*•]\s*/, '').trim())
                .filter(Boolean);

              return `
            <div class="entry-block">
              <div class="entry-header">
                <span class="entry-title">${escapeHtml(it.title || '')}${it.subtitle ? ` — ${escapeHtml(it.subtitle)}` : ''}</span>
                ${it.date || it.location ? `<span class="entry-date">${escapeHtml(it.date || '')}${it.date && it.location ? ' | ' : ''}${escapeHtml(it.location || '')}</span>` : ''}
              </div>
              ${
                it.link
                  ? `
                <div class="entry-links">
                  <a href="${ensureUrl(it.link)}" class="entry-link" target="_blank">${escapeHtml(formatCleanUrl(it.link))}</a>
                </div>
              `
                  : ''
              }
              ${
                bullets.length > 0
                  ? `
                <ul class="bullet-list">
                  ${bullets
                    .map(
                      (b) => `
                    <li class="bullet-item">
                      <span class="bullet-dot" style="color: ${primaryColor}">•</span>
                      <span>${escapeHtml(b)}</span>
                    </li>
                  `
                    )
                    .join('')}
                </ul>
              `
                  : ''
              }
            </div>
          `;
            })
            .join('')}
        </div>
      </section>
    `;
  };

  const sectionMap = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
    certifications: renderCertifications,
    languages: renderLanguages,
    achievements: renderAchievements,
    interests: renderInterests
  };

  customSections.forEach((sec) => {
    sectionMap[sec.id] = () => renderCustomSection(sec);
  });

  const allOrderedKeys = [...(sectionOrder || Object.keys(sectionMap))];
  customSections.forEach((sec) => {
    if (!allOrderedKeys.includes(sec.id)) {
      allOrderedKeys.push(sec.id);
    }
  });

  const renderedSections = allOrderedKeys
    .map((secName) => (sectionMap[secName] ? sectionMap[secName]() : ''))
    .join('');

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
    'Playfair Display': "'Playfair Display', Georgia, serif",
    'Fira Code': "'Fira Code', monospace"
  };
  const cssFontFamily = fontStackMap[fontFamily] || `'${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(resume.title || 'Resume')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:wght@500;700&family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@400;500;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body,
    .page-container,
    .page-container *,
    .page-container h1,
    .page-container h2,
    .page-container h3,
    .page-container h4,
    .page-container h5,
    .page-container h6,
    .page-container p,
    .page-container span,
    .page-container div,
    .page-container a,
    .page-container li,
    .page-container ul,
    .page-container ol,
    .page-container b,
    .page-container strong,
    .page-container em,
    .page-container i {
      font-family: ${cssFontFamily} !important;
    }
    body {
      font-size: ${fontSize};
      line-height: ${lineSpacing};
      color: ${textColor};
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: ${marginSize};
      margin: 0 auto;
      background: #ffffff;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    }
    .page-content-wrapper {
      width: 100%;
    }
    .header {
      margin-bottom: 12px;
      ${template === 'professional' ? 'border-bottom: 2px solid ' + primaryColor + '; padding-bottom: 8px;' : ''}
      ${template === 'mteck' ? 'border-bottom: 2px solid ' + primaryColor + '; padding-bottom: 8px;' : ''}
      ${template === 'jakes' ? 'padding-bottom: 6px;' : ''}
      ${template === 'anubhav' ? 'border-bottom: 2px solid ' + primaryColor + '; padding-bottom: 8px;' : ''}
      ${template === 'knyte' ? 'border-bottom: 2px solid ' + primaryColor + '; padding-bottom: 8px;' : ''}
      ${template === 'austere' ? 'border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;' : ''}
      ${template === 'creative' ? 'background: linear-gradient(135deg, ' + primaryColor + ', ' + secondaryColor + '); padding: 16px; border-radius: 12px; color: #ffffff; margin-bottom: 14px;' : ''}
    }
    .header-name {
      font-size: ${nameFontSize}px;
      font-weight: 800;
      color: ${template === 'creative' ? '#ffffff' : (template === 'knyte' || template === 'austere' ? textColor : primaryColor)};
      margin-bottom: 2px;
      letter-spacing: ${template === 'austere' ? '0.05em' : '-0.02em'};
      text-transform: ${template === 'mteck' || template === 'jakes' || template === 'austere' ? 'uppercase' : 'none'};
    }
    .header-title {
      font-size: ${roleFontSize}px;
      font-weight: ${roleFontWeight};
      color: ${template === 'creative' ? '#ffffff' : (template === 'knyte' ? primaryColor : (template === 'mteck' ? secondaryColor : textColor))};
      margin-bottom: 5px;
      letter-spacing: ${template === 'austere' ? '0.08em' : 'normal'};
      text-transform: ${template === 'austere' ? 'uppercase' : 'none'};
    }
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: ${template === 'jakes' || template === 'mteck' ? 'center' : 'flex-start'};
      gap: ${template === 'jakes' ? '8px' : '10px'};
      font-size: ${contactFontSize}px;
      font-weight: ${contactFontWeight};
      color: ${template === 'creative' ? '#f8fafc' : textColor};
    }
    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .contact-item a {
      color: ${template === 'creative' ? '#ffffff' : (template === 'jakes' ? primaryColor : textColor)};
      font-weight: ${linksFontWeight};
      text-decoration: ${template === 'jakes' ? 'underline' : 'none'};
      font-size: ${linksFontSize}px;
    }
    .header.center-aligned {
      text-align: center !important;
    }
    .header.center-aligned .header-name {
      text-align: center !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .header.center-aligned .header-title {
      text-align: center !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .header.center-aligned .contact-info {
      justify-content: center !important;
      text-align: center !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .header.right-aligned {
      text-align: right !important;
    }
    .header.right-aligned .header-name {
      text-align: right !important;
      margin-left: auto !important;
      margin-right: 0 !important;
    }
    .header.right-aligned .header-title {
      text-align: right !important;
      margin-left: auto !important;
      margin-right: 0 !important;
    }
    .header.right-aligned .contact-info {
      justify-content: flex-end !important;
      text-align: right !important;
      margin-left: auto !important;
      margin-right: 0 !important;
    }
    .header.left-aligned {
      text-align: left !important;
    }
    .header.left-aligned .header-name {
      text-align: left !important;
      margin-left: 0 !important;
      margin-right: auto !important;
    }
    .header.left-aligned .header-title {
      text-align: left !important;
      margin-left: 0 !important;
      margin-right: auto !important;
    }
    .header.left-aligned .contact-info {
      justify-content: flex-start !important;
      text-align: left !important;
      margin-left: 0 !important;
      margin-right: auto !important;
    }
    .section {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: ${sectionTitleFontSize}px;
      font-weight: ${sectionTitleFontWeight};
      text-transform: uppercase;
      letter-spacing: ${template === 'austere' ? '0.1em' : '0.04em'};
      color: ${sectionTitleColor};
      margin-bottom: 5px;
      padding-bottom: 2px;
      border-bottom: ${template === 'jakes' ? '1px solid ' + sectionTitleColor : (template === 'mteck' ? '2px solid ' + sectionTitleColor : (template === 'austere' ? '1px solid #e2e8f0' : '2px solid ' + sectionTitleColor + '45'))};
      ${template === 'knyte' ? 'border-left: 4px solid ' + sectionTitleColor + '; padding-left: 6px;' : ''}
    }
    .entry-block {
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .entry-block:last-child {
      margin-bottom: 0;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 3px;
    }
    .entry-title {
      font-weight: 700;
      color: ${textColor};
      font-size: ${bodyFontSize + 0.5}px;
    }
    .entry-company {
      font-weight: 500;
      color: ${secondaryColor};
      font-size: ${bodyFontSize}px;
    }
    .entry-date {
      font-size: ${bodyFontSize}px;
      color: #475569;
      white-space: nowrap;
      margin-left: 12px;
    }
    .entry-description {
      font-size: ${bodyFontSize}px;
      font-weight: ${bodyFontWeight};
      color: ${textColor};
      margin-top: 4px;
      line-height: 1.45;
    }
    .bullet-list {
      list-style: none;
      margin-top: 4px;
      padding-left: 0;
    }
    .bullet-item {
      font-size: ${bodyFontSize}px;
      font-weight: ${bodyFontWeight};
      color: ${textColor};
      line-height: 1.45;
      margin-bottom: 2px;
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .entry-links {
      display: flex;
      gap: 12px;
      margin-top: 2px;
      margin-bottom: 4px;
    }
    .entry-link {
      font-size: ${linksFontSize}px;
      font-weight: ${linksFontWeight};
      color: ${textColor};
      text-decoration: none;
    }
    .tech-stack-row {
      font-size: ${bodyFontSize}px;
      color: #475569;
      margin-top: 3px;
    }
    .vertical-bullet-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: ${bodyFontSize}px;
      margin-bottom: 3.5px;
      line-height: 1.45;
    }
    .vertical-bullet-content {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .bullet-dot {
      font-size: 14px;
      font-weight: 700;
      line-height: 1;
      user-select: none;
    }
    .bullet-title {
      font-weight: 600;
      color: ${textColor};
    }
    .bullet-company {
      color: #475569;
      font-weight: normal;
    }
    .bullet-date {
      font-size: ${bodyFontSize}px;
      color: #475569;
      margin-left: 8px;
      white-space: nowrap;
    }
    .bullet-desc {
      color: ${textColor};
      font-weight: ${bodyFontWeight};
    }
    .achievement-bullet-block {
      margin-bottom: 5px;
    }
    .achievement-desc {
      padding-left: 14px;
      font-size: ${bodyFontSize}px;
      font-weight: ${bodyFontWeight};
      color: ${textColor};
      line-height: 1.4;
      margin-top: 1px;
    }
    .skill-category-name {
      font-weight: 600;
      color: ${textColor};
      margin-right: 6px;
    }
    .skill-category-items {
      color: ${textColor};
      font-weight: ${bodyFontWeight};
    }
    .language-list {
      display: flex;
      flex-direction: column;
      gap: 3.5px;
      font-size: ${bodyFontSize}px;
    }
    .interest-item {
      font-size: ${bodyFontSize}px;
      margin-bottom: 4px;
      color: ${textColor};
    }
    .summary-text {
      font-size: ${bodyFontSize}px;
      font-weight: ${bodyFontWeight};
      color: ${textColor};
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="page-content-wrapper">
      ${(() => {
        const defaultLayout = template === 'jakes' || template === 'mteck' || template === 'professional' ? 'center' : 'left';
        const effectiveLayout = settings.headerLayout === 'middle' ? 'center' : settings.headerLayout || defaultLayout;
        const alignClass = effectiveLayout === 'right' ? 'right-aligned' : effectiveLayout === 'center' ? 'center-aligned' : 'left-aligned';

        return `<header class="header ${alignClass}">`;
      })()}
        <h1 class="header-name">${escapeHtml(personalInfo.fullName || 'Your Name')}</h1>
        ${personalInfo.jobTitle ? `<div class="header-title">${escapeHtml(personalInfo.jobTitle)}</div>` : ''}
        ${(() => {
          const contactLinkStyle = settings.contactLinkStyle || 'name';
          const websiteLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.website) : 'Portfolio';
          const linkedinLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.linkedin) : 'LinkedIn';
          const githubLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.github) : 'GitHub';

          const items = [];
          if (personalInfo.phone) {
            items.push(`<a href="tel:${escapeHtml(personalInfo.phone)}">${escapeHtml(personalInfo.phone)}</a>`);
          }
          if (personalInfo.email) {
            items.push(`<a href="mailto:${escapeHtml(personalInfo.email)}">${escapeHtml(personalInfo.email)}</a>`);
          }
          if (personalInfo.location) {
            items.push(`<span>${escapeHtml(personalInfo.location)}</span>`);
          }
          if (personalInfo.linkedin) {
            items.push(`<a href="${escapeHtml(ensureUrl(personalInfo.linkedin))}" target="_blank">${escapeHtml(linkedinLabel)}</a>`);
          }
          if (personalInfo.github) {
            items.push(`<a href="${escapeHtml(ensureUrl(personalInfo.github))}" target="_blank">${escapeHtml(githubLabel)}</a>`);
          }
          if (personalInfo.website) {
            items.push(`<a href="${escapeHtml(ensureUrl(personalInfo.website))}" target="_blank">${escapeHtml(websiteLabel)}</a>`);
          }

          if (items.length === 0) return '';
          const sep = template === 'jakes'
            ? '<span class="contact-sep" style="color: #64748b; margin: 0 4px; font-weight: normal;">|</span>'
            : '<span class="contact-sep" style="color: #64748b; margin: 0 4px; font-weight: normal;">&bull;</span>';

          return `
            <div class="contact-info">
              ${items.map((item, idx) => `<span class="contact-item">${idx > 0 ? sep : ''}${item}</span>`).join('')}
            </div>
          `;
        })()}
      </header>

      <main>
        ${renderedSections}
      </main>
    </div>
  </div>
</body>
</html>
  `;
};

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

export const generateResumePdf = async (resume) => {
  const html = generateResumeHtml(resume);
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Fast-path: wait for document fonts to load without network idling delay
    await page.evaluateHandle('document.fonts.ready');

    // Auto-fit dynamic content scaling to strictly fit within 1 A4 page
    await page.evaluate(() => {
      const pageContainer = document.querySelector('.page-container');
      const contentWrapper = document.querySelector('.page-content-wrapper');
      if (!pageContainer || !contentWrapper) return;

      const style = window.getComputedStyle(pageContainer);
      const paddingTop = parseFloat(style.paddingTop) || 0;
      const paddingBottom = parseFloat(style.paddingBottom) || 0;
      const availableHeight = pageContainer.clientHeight - paddingTop - paddingBottom;
      const contentHeight = contentWrapper.scrollHeight;

      if (availableHeight > 0 && contentHeight > 0) {
        let scale = 1;
        if (contentHeight > availableHeight) {
          // Proportionally scale content down with safety margin so zero content is ever cut off at the bottom
          scale = Math.max(0.50, Math.floor(((availableHeight - 12) / contentHeight) * 1000) / 1000);
        }

        if (scale !== 1) {
          contentWrapper.style.transformOrigin = 'top left';
          contentWrapper.style.transform = `scale(${scale})`;
          contentWrapper.style.width = `${(1 / scale) * 100}%`;
        }
      }
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      pageRanges: '1', // Strict single page only
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      },
      preferCSSPageSize: true
    });

    return pdfBuffer;
  } finally {
    await page.close();
  }
};
