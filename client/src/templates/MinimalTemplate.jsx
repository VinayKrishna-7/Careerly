import React from 'react';
import { formatDate, ensureUrl, groupSkills, parseBulletPoints, formatCleanUrl } from '../utils/formatters.js';

export const MinimalTemplate = ({ resume }) => {
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

  const primaryColor = settings.primaryColor || '#000000';
  const textColor = settings.textColor || '#171717';
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
      <div key="summary" className="space-y-1 avoid-break">
        <h3
          className="uppercase tracking-wider border-b pb-0.5"
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
          className="uppercase tracking-wider border-b pb-0.5"
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
            <div key={exp.id || i} className="space-y-0.5 avoid-break">
              <div className="flex justify-between items-baseline" style={{ fontSize: `${bodyFontSize}px` }}>
                <span className="font-bold" style={{ color: textColor }}>{exp.position}</span>
                <span className="text-slate-600" style={{ fontSize: `${bodyFontSize}px` }}>
                  {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                </span>
              </div>
              <div className="font-medium" style={{ fontSize: `${bodyFontSize}px`, color: textColor }}>
                {exp.company} {exp.location && `• ${exp.location}`}
              </div>
              {exp.description && (
                <div
                  className="whitespace-pre-line mt-1 leading-relaxed"
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
      <div key="education" className="space-y-2.5 avoid-break">
        <h3
          className="uppercase tracking-wider border-b pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.education || 'Education'}
        </h3>
        <div className="space-y-2">
          {education.map((edu, i) => (
            <div key={edu.id || i} className="avoid-break" style={{ fontSize: `${bodyFontSize}px` }}>
              <div className="flex justify-between font-bold" style={{ color: textColor }}>
                <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                <span className="font-normal text-slate-600" style={{ fontSize: `${bodyFontSize}px` }}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                </span>
              </div>
              <div className="text-slate-700" style={{ fontSize: `${bodyFontSize}px` }}>
                {edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}
              </div>
              {edu.description && (
                <p className="mt-0.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
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
          className="uppercase tracking-wider border-b pb-0.5"
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
              <span className="font-bold text-sm leading-none select-none" style={{ color: primaryColor }}>•</span>
              <span className="font-semibold" style={{ color: textColor }}>{cat}:</span>
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
      <div key="projects" className="space-y-2.5 avoid-break">
        <h3
          className="uppercase tracking-wider border-b pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: `${sectionTitleColor}45`
          }}
        >
          {sectionTitles?.projects || 'Projects'}
        </h3>
        <div className="space-y-2">
          {projects.map((proj, i) => {
            const bullets = parseBulletPoints(proj.description);
            const liveLabel = linkStyle === 'url' ? formatCleanUrl(proj.liveUrl) : 'Live Demo ↗';
            const githubLabel = linkStyle === 'url' ? formatCleanUrl(proj.githubUrl) : 'GitHub ↗';

            return (
              <div key={proj.id || i} className="space-y-0.5 avoid-break" style={{ fontSize: `${bodyFontSize}px` }}>
                <div className="flex justify-between font-bold" style={{ color: textColor }}>
                  <span>{proj.title} {proj.role && `— ${proj.role}`}</span>
                  <span className="font-normal text-slate-600" style={{ fontSize: `${bodyFontSize}px` }}>
                    {formatDate(proj.startDate)} – {formatDate(proj.endDate)}
                  </span>
                </div>

                {/* Active clickable project links */}
                {(proj.liveUrl || proj.githubUrl) && (
                  <div className="flex flex-wrap gap-x-3" style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight }}>
                    {proj.liveUrl && (
                      <a
                        href={ensureUrl(proj.liveUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        style={{ color: textColor }}
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
                        style={{ color: textColor }}
                      >
                        {githubLabel}
                      </a>
                    )}
                  </div>
                )}

                {/* Description bullet points */}
                {bullets.length > 0 && (
                  <ul className="space-y-0.5 leading-relaxed pt-0.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
                    {bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold text-sm leading-none select-none" style={{ color: primaryColor }}>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
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
          className="uppercase tracking-wider border-b pb-0.5"
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
                <span className="font-bold text-sm leading-none select-none" style={{ color: primaryColor }}>•</span>
                <span className="font-semibold" style={{ color: textColor }}>{c.name}</span>
                {c.issuer && <span className="text-slate-600"> ({c.issuer})</span>}
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
          className="uppercase tracking-wider border-b pb-0.5"
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
              <span className="font-bold text-sm leading-none select-none" style={{ color: primaryColor }}>•</span>
              <span className="font-semibold" style={{ color: textColor }}>{l.language}:</span>
              <span className="text-slate-700">{l.proficiency}</span>
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
          className="uppercase tracking-wider border-b pb-0.5"
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
                  <span className="font-bold text-sm leading-none select-none" style={{ color: primaryColor }}>•</span>
                  <span className="font-semibold" style={{ color: textColor }}>{a.title}</span>
                  {a.issuer && <span className="text-slate-600"> — {a.issuer}</span>}
                </div>
                {a.date && <span className="text-slate-600 shrink-0 ml-2" style={{ fontSize: `${bodyFontSize}px` }}>{formatDate(a.date)}</span>}
              </div>
              {a.description && <p className="pl-3 leading-relaxed text-slate-700" style={{ fontSize: `${bodyFontSize}px` }}>{a.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInterests = () => {
    if (!interests?.length || sectionVisibility.interests === false) return null;
    return (
      <div key="interests" className="space-y-1 avoid-break">
        <h3
          className="uppercase tracking-wider border-b pb-0.5"
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
            <span className="font-bold text-sm leading-none select-none" style={{ color: primaryColor }}>•</span>
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
      {/* Minimal Header */}
      <div className="space-y-1 pb-3 border-b border-slate-200">
        <h1
          className="font-bold tracking-tight"
          style={{ fontSize: `${nameFontSize}px`, color: primaryColor }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p
            className="tracking-wide"
            style={{ fontSize: `${roleFontSize}px`, fontWeight: roleFontWeight, color: textColor }}
          >
            {personalInfo.jobTitle}
          </p>
        )}
        {(() => {
          const contactLinkStyle = settings.contactLinkStyle || 'name';
          const websiteLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.website) : 'Portfolio';
          const linkedinLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.linkedin) : 'LinkedIn';
          const githubLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.github) : 'GitHub';

          return (
            <div
              className="flex flex-wrap items-center gap-x-3 pt-1"
              style={{ fontSize: `${contactFontSize}px`, fontWeight: contactFontWeight, color: textColor }}
            >
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="hover:underline" style={{ color: textColor }}>
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <span>
                  • <a href={`tel:${personalInfo.phone}`} className="hover:underline" style={{ color: textColor }}>{personalInfo.phone}</a>
                </span>
              )}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
              {personalInfo.website && (
                <span>
                  • <a href={ensureUrl(personalInfo.website)} target="_blank" rel="noreferrer" className="hover:underline" style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: textColor }}>{websiteLabel}</a>
                </span>
              )}
              {personalInfo.linkedin && (
                <span>
                  • <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="hover:underline" style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: textColor }}>{linkedinLabel}</a>
                </span>
              )}
              {personalInfo.github && (
                <span>
                  • <a href={ensureUrl(personalInfo.github)} target="_blank" rel="noreferrer" className="hover:underline" style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: textColor }}>{githubLabel}</a>
                </span>
              )}
            </div>
          );
        })()}
      </div>

      <div className="space-y-4">{sectionsToRender}</div>
    </div>
  );
};

export default MinimalTemplate;
