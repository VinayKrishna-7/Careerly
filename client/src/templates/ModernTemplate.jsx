import React from 'react';
import { formatDate, ensureUrl, groupSkills, parseBulletPoints, formatCleanUrl } from '../utils/formatters.js';

export const ModernTemplate = ({ resume }) => {
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
    sectionOrder = [],
    sectionTitles = {},
    sectionVisibility = {},
    settings = {}
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
  const nameFontSize = settings.nameFontSize || 28;
  const roleFontSize = settings.roleFontSize || 16;
  const contactFontSize = settings.contactFontSize || 12.5;
  const linksFontSize = settings.linksFontSize || 12.5;
  const sectionTitleFontSize = settings.sectionTitleFontSize || 16;
  const bodyFontSize = settings.bodyFontSize || 13.5;

  const renderSummary = () => {
    if (!summary || sectionVisibility.summary === false) return null;
    return (
      <div key="summary" className="space-y-1.5 avoid-break">
        <h3
          className="uppercase tracking-wider pb-1 border-b-2"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.summary || 'Professional summary'}
        </h3>
        <p
          className="leading-relaxed"
          style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}
        >
          {summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experience?.length || sectionVisibility.experience === false) return null;
    return (
      <div key="experience" className="space-y-3 avoid-break">
        <h3
          className="uppercase tracking-wider pb-1 border-b-2"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.experience || 'Experience'}
        </h3>
        <div className="space-y-3">
          {experience.map((exp, i) => (
            <div key={exp.id || i} className="space-y-1 avoid-break">
              <div className="flex justify-between items-baseline" style={{ fontSize: `${bodyFontSize}px` }}>
                <h4 className="font-bold text-slate-900" style={{ fontSize: `${bodyFontSize + 0.5}px` }}>{exp.position}</h4>
                <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                  {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                </span>
              </div>
              <div className="font-semibold" style={{ color: secondaryColor, fontSize: `${bodyFontSize}px` }}>
                {exp.company}
                {exp.location ? <span className="text-slate-500 font-normal"> &bull; {exp.location}</span> : ''}
              </div>
              {exp.description && (
                <div
                  className="leading-relaxed whitespace-pre-line mt-1"
                  style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}
                >
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (!education?.length || sectionVisibility.education === false) return null;
    return (
      <div key="education" className="space-y-3 avoid-break">
        <h3
          className="uppercase tracking-wider pb-1 border-b-2"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.education || 'Education'}
        </h3>
        <div className="space-y-2.5">
          {education.map((edu, i) => (
            <div key={edu.id || i} className="space-y-0.5 avoid-break">
              <div className="flex justify-between items-baseline" style={{ fontSize: `${bodyFontSize}px` }}>
                <h4 className="font-bold text-slate-900" style={{ fontSize: `${bodyFontSize + 0.5}px` }}>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </h4>
                <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                </span>
              </div>
              <div className="text-slate-700 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                {edu.institution}
                {edu.gpa ? <span className="text-slate-500"> &bull; GPA: {edu.gpa}</span> : ''}
              </div>
              {edu.description && (
                <p
                  className="mt-0.5"
                  style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}
                >
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (!skills?.length || sectionVisibility.skills === false) return null;
    const grouped = groupSkills(skills);
    return (
      <div key="skills" className="space-y-1.5 avoid-break">
        <h3
          className="uppercase tracking-wider pb-1 border-b-2"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.skills || 'Skills'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {grouped.map(([cat, items], idx) => (
            <div key={idx} className="flex items-baseline gap-1.5 leading-relaxed">
              <span className="font-bold select-none" style={{ color: sectionTitleColor, fontSize: `${bodyFontSize + 1}px` }}>•</span>
              <span className="font-semibold text-slate-900">{cat}:</span>
              <span>{items.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!projects?.length || sectionVisibility.projects === false) return null;
    const linkStyle = settings.projectLinkStyle || 'name';

    return (
      <div key="projects" className="space-y-3 avoid-break">
        <h3
          className="uppercase tracking-wider pb-1 border-b-2"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.projects || 'Projects'}
        </h3>
        <div className="space-y-2.5">
          {projects.map((proj, i) => {
            const bullets = parseBulletPoints(proj.description);
            const liveLabel = linkStyle === 'url' ? formatCleanUrl(proj.liveUrl) : 'Live Demo ↗';
            const githubLabel = linkStyle === 'url' ? formatCleanUrl(proj.githubUrl) : 'GitHub ↗';

            return (
              <div key={proj.id || i} className="space-y-1 avoid-break">
                <div className="flex justify-between items-baseline" style={{ fontSize: `${bodyFontSize}px` }}>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900" style={{ fontSize: `${bodyFontSize + 0.5}px` }}>{proj.title}</h4>
                    {proj.role && <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>({proj.role})</span>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                      {formatDate(proj.startDate)} – {formatDate(proj.endDate)}
                    </span>
                  )}
                </div>

                {/* Active clickable project links if present */}
                {(proj.liveUrl || proj.githubUrl) && (
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5" style={{ fontSize: `${linksFontSize}px` }}>
                    {proj.liveUrl && (
                      <a
                        href={ensureUrl(proj.liveUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        style={{ color: textColor, fontWeight: linksFontWeight }}
                      >
                        {liveLabel}
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={ensureUrl(proj.githubUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        style={{ color: textColor, fontWeight: linksFontWeight }}
                      >
                        {githubLabel}
                      </a>
                    )}
                  </div>
                )}

                {/* Description & Highlights formatted in clean bullet points */}
                {bullets.length > 0 && (
                  <ul className="space-y-0.5 leading-relaxed" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
                    {bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold select-none" style={{ color: sectionTitleColor, fontSize: `${bodyFontSize + 1}px` }}>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((t, tid) => (
                      <span key={tid} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium" style={{ fontSize: `${Math.max(bodyFontSize - 1, 10.5)}px` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (!certifications?.length || sectionVisibility.certifications === false) return null;
    return (
      <div key="certifications" className="space-y-1.5 avoid-break">
        <h3
          className="uppercase tracking-wider pb-1 border-b-2"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.certifications || 'Certifications'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {certifications.map((c, i) => (
            <div key={c.id || i} className="flex justify-between items-baseline leading-relaxed">
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold select-none" style={{ color: sectionTitleColor, fontSize: `${bodyFontSize + 1}px` }}>•</span>
                <span className="font-semibold text-slate-900">{c.name}</span>
                {c.issuer && <span className="text-slate-600 font-normal"> &bull; {c.issuer}</span>}
              </div>
              {c.issueDate && <span className="text-slate-600 shrink-0 ml-2" style={{ fontSize: `${bodyFontSize}px` }}>{formatDate(c.issueDate)}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    if (!languages?.length || sectionVisibility.languages === false) return null;
    return (
      <div key="languages" className="space-y-1.5 avoid-break">
        <h3
          className="uppercase tracking-wider pb-1 border-b-2"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.languages || 'Languages'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {languages.map((l, i) => (
            <div key={l.id || i} className="flex items-baseline gap-1.5 leading-relaxed">
              <span className="font-bold select-none" style={{ color: sectionTitleColor, fontSize: `${bodyFontSize + 1}px` }}>•</span>
              <span className="font-semibold text-slate-900">{l.language}:</span>
              <span>{l.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (!achievements?.length || sectionVisibility.achievements === false) return null;
    return (
      <div key="achievements" className="space-y-1.5 avoid-break">
        <h3
          className="uppercase tracking-wider pb-1 border-b-2"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.achievements || 'Achievements & Activities'}
        </h3>
        <div className="space-y-1.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {achievements.map((a, i) => (
            <div key={a.id || i} className="space-y-0.5">
              <div className="flex justify-between items-baseline leading-relaxed">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold select-none" style={{ color: sectionTitleColor, fontSize: `${bodyFontSize + 1}px` }}>•</span>
                  <span className="font-semibold text-slate-900">{a.title}</span>
                  {a.issuer && <span className="text-slate-600 font-normal"> &bull; {a.issuer}</span>}
                </div>
                {a.date && <span className="text-slate-600 shrink-0 ml-2" style={{ fontSize: `${bodyFontSize}px` }}>{formatDate(a.date)}</span>}
              </div>
              {a.description && <p className="pl-3 leading-relaxed" style={{ fontSize: `${bodyFontSize}px` }}>{a.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInterests = () => {
    if (!interests?.length || sectionVisibility.interests === false) return null;
    return (
      <div key="interests" className="space-y-1.5 avoid-break">
        <h3
          className="uppercase tracking-wider pb-1 border-b-2"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.interests || 'Interests'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          <div className="flex items-baseline gap-1.5 leading-relaxed">
            <span className="font-bold select-none" style={{ color: sectionTitleColor, fontSize: `${bodyFontSize + 1}px` }}>•</span>
            <span>{interests.map((it) => it.name).filter(Boolean).join(', ')}</span>
          </div>
        </div>
      </div>
    );
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

  const sectionsToRender = (sectionOrder || Object.keys(sectionMap)).map(
    (name) => sectionMap[name] && sectionMap[name]()
  );

  return (
    <div className="space-y-5" style={{ color: textColor }}>
      {/* Header Section */}
      <div className="space-y-1.5 border-b pb-4" style={{ borderColor: `${primaryColor}25` }}>
        <h1
          className="font-bold tracking-tight"
          style={{ fontSize: `${nameFontSize}px`, color: primaryColor }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <h2 className="tracking-wide" style={{ fontSize: `${roleFontSize}px`, color: textColor, fontWeight: roleFontWeight }}>
            {personalInfo.jobTitle}
          </h2>
        )}

        {/* Contact Links & Info */}
        {(() => {
          const contactLinkStyle = settings.contactLinkStyle || 'name';
          const websiteLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.website) : 'Portfolio';
          const linkedinLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.linkedin) : 'LinkedIn';
          const githubLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.github) : 'GitHub';

          return (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1" style={{ fontSize: `${contactFontSize}px`, color: textColor, fontWeight: contactFontWeight }}>
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.phone && (
                <span>
                  {personalInfo.location ? '• ' : ''}
                  <a href={`tel:${personalInfo.phone}`} className="hover:underline">
                    {personalInfo.phone}
                  </a>
                </span>
              )}
              {personalInfo.email && (
                <span>
                  • <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                    {personalInfo.email}
                  </a>
                </span>
              )}
              {personalInfo.website && (
                <span>
                  • <a
                    href={ensureUrl(personalInfo.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                    style={{ fontSize: `${linksFontSize}px`, color: textColor, fontWeight: linksFontWeight }}
                  >
                    {websiteLabel}
                  </a>
                </span>
              )}
              {personalInfo.linkedin && (
                <span>
                  • <a
                    href={ensureUrl(personalInfo.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                    style={{ fontSize: `${linksFontSize}px`, color: textColor, fontWeight: linksFontWeight }}
                  >
                    {linkedinLabel}
                  </a>
                </span>
              )}
              {personalInfo.github && (
                <span>
                  • <a
                    href={ensureUrl(personalInfo.github)}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                    style={{ fontSize: `${linksFontSize}px`, color: textColor, fontWeight: linksFontWeight }}
                  >
                    {githubLabel}
                  </a>
                </span>
              )}
            </div>
          );
        })()}
      </div>

      {/* Sections Body */}
      <div className="space-y-4">{sectionsToRender}</div>
    </div>
  );
};

export default ModernTemplate;
