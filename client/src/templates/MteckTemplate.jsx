import React from 'react';
import { formatDate, ensureUrl, groupSkills, parseBulletPoints, formatCleanUrl } from '../utils/formatters.js';

export const MteckTemplate = ({ resume }) => {
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

  const primaryColor = settings.primaryColor || '#1e3a8a';
  const secondaryColor = settings.secondaryColor || '#334155';
  const textColor = settings.textColor || '#0f172a';
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
          className="uppercase tracking-wider pb-0.5 border-b-2 font-bold"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.summary || 'Professional Summary'}
        </h3>
        <p
          className="leading-relaxed text-justify"
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
          className="uppercase tracking-wider pb-0.5 border-b-2 font-bold"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.experience || 'Experience'}
        </h3>
        <div className="space-y-3">
          {experience.map((exp, i) => (
            <div key={exp.id || i} className="space-y-1 avoid-break">
              <div className="flex justify-between items-baseline" style={{ fontSize: `${bodyFontSize}px` }}>
                <span className="font-bold tracking-tight" style={{ color: textColor }}>
                  {exp.position}
                </span>
                <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                  {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                </span>
              </div>
              <div className="flex justify-between items-baseline font-semibold" style={{ color: secondaryColor, fontSize: `${bodyFontSize}px` }}>
                <span>{exp.company}</span>
                {exp.location && <span className="text-slate-600 font-normal italic">{exp.location}</span>}
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
      <div key="education" className="space-y-2.5 avoid-break">
        <h3
          className="uppercase tracking-wider pb-0.5 border-b-2 font-bold"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.education || 'Education'}
        </h3>
        <div className="space-y-2.5">
          {education.map((edu, i) => (
            <div key={edu.id || i} className="space-y-0.5 avoid-break" style={{ fontSize: `${bodyFontSize}px` }}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold" style={{ color: textColor }}>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </span>
                <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-slate-700 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                <span>{edu.institution}</span>
                {edu.gpa && <span className="text-slate-600 font-normal">GPA: {edu.gpa}</span>}
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
          className="uppercase tracking-wider pb-0.5 border-b-2 font-bold"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.skills || 'Technical Skills'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {grouped.map(([cat, items], idx) => (
            <div key={idx} className="flex items-baseline gap-2 leading-relaxed">
              <span className="font-bold shrink-0 min-w-[140px]" style={{ color: textColor }}>{cat}:</span>
              <span className="text-slate-800">{items.join(', ')}</span>
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
          className="uppercase tracking-wider pb-0.5 border-b-2 font-bold"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.projects || 'Projects'}
        </h3>
        <div className="space-y-2.5">
          {projects.map((proj, i) => {
            const bullets = parseBulletPoints(proj.description);
            const liveLabel = linkStyle === 'url' ? formatCleanUrl(proj.liveUrl) : 'Live Demo ↗';
            const githubLabel = linkStyle === 'url' ? formatCleanUrl(proj.githubUrl) : 'Code Repository ↗';

            return (
              <div key={proj.id || i} className="space-y-1 avoid-break" style={{ fontSize: `${bodyFontSize}px` }}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold" style={{ color: textColor }}>{proj.title}</span>
                    {proj.role && <span className="text-slate-600 font-medium italic">| {proj.role}</span>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                      {formatDate(proj.startDate)} – {formatDate(proj.endDate)}
                    </span>
                  )}
                </div>

                {/* Project Links */}
                {(proj.liveUrl || proj.githubUrl) && (
                  <div className="flex flex-wrap gap-x-3" style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight }}>
                    {proj.liveUrl && (
                      <a
                        href={ensureUrl(proj.liveUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline font-semibold"
                        style={{ color: primaryColor }}
                      >
                        {liveLabel}
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={ensureUrl(proj.githubUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline font-medium"
                        style={{ color: textColor }}
                      >
                        {githubLabel}
                      </a>
                    )}
                  </div>
                )}

                {/* Description Bullets */}
                {bullets.length > 0 && (
                  <ul className="space-y-0.5 leading-relaxed pt-0.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
                    {bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-sm leading-none select-none shrink-0 mt-0.5" style={{ color: primaryColor }}>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {proj.technologies?.length > 0 && (
                  <div className="text-slate-700 font-medium pt-0.5" style={{ fontSize: `${bodyFontSize}px` }}>
                    <span className="font-semibold text-slate-900">Technologies Used: </span>
                    <span>{proj.technologies.join(', ')}</span>
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
          className="uppercase tracking-wider pb-0.5 border-b-2 font-bold"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.certifications || 'Certifications'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {certifications.map((c, i) => (
            <div key={c.id || i} className="flex justify-between items-baseline leading-relaxed">
              <div className="flex items-baseline gap-2">
                <span className="font-bold" style={{ color: textColor }}>{c.name}</span>
                {c.issuer && <span className="text-slate-600"> — {c.issuer}</span>}
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
          className="uppercase tracking-wider pb-0.5 border-b-2 font-bold"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.languages || 'Languages'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {languages.map((l, i) => (
            <div key={l.id || i} className="flex items-baseline gap-2 leading-relaxed">
              <span className="font-bold shrink-0 min-w-[140px]" style={{ color: textColor }}>{l.language}:</span>
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
          className="uppercase tracking-wider pb-0.5 border-b-2 font-bold"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.achievements || 'Achievements & Honors'}
        </h3>
        <div className="space-y-1.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {achievements.map((a, i) => (
            <div key={a.id || i} className="space-y-0.5">
              <div className="flex justify-between items-baseline leading-relaxed">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold" style={{ color: textColor }}>{a.title}</span>
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
          className="uppercase tracking-wider pb-0.5 border-b-2 font-bold"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.interests || 'Interests'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          <div className="leading-relaxed">
            <span>{interests.map((it) => it.name).filter(Boolean).join(' • ')}</span>
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
    <div className="space-y-4" style={{ color: textColor }}>
      {/* MTeck Header */}
      <div className="text-center pb-2.5 border-b-2" style={{ borderColor: primaryColor }}>
        <h1
          className="font-extrabold tracking-tight uppercase"
          style={{ fontSize: `${nameFontSize}px`, color: primaryColor }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p
            className="tracking-wider uppercase font-semibold mt-0.5"
            style={{ fontSize: `${roleFontSize}px`, fontWeight: roleFontWeight, color: secondaryColor }}
          >
            {personalInfo.jobTitle}
          </p>
        )}

        {(() => {
          const contactLinkStyle = settings.contactLinkStyle || 'name';
          const websiteLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.website) : 'Portfolio';
          const linkedinLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.linkedin) : 'LinkedIn';
          const githubLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.github) : 'GitHub';

          const items = [];
          if (personalInfo.location) items.push(<span key="loc">{personalInfo.location}</span>);
          if (personalInfo.phone) {
            items.push(
              <a key="phone" href={`tel:${personalInfo.phone}`} className="hover:underline" style={{ color: textColor }}>
                {personalInfo.phone}
              </a>
            );
          }
          if (personalInfo.email) {
            items.push(
              <a key="email" href={`mailto:${personalInfo.email}`} className="hover:underline font-medium" style={{ color: textColor }}>
                {personalInfo.email}
              </a>
            );
          }
          if (personalInfo.website) {
            items.push(
              <a
                key="web"
                href={ensureUrl(personalInfo.website)}
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-semibold"
                style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: primaryColor }}
              >
                {websiteLabel}
              </a>
            );
          }
          if (personalInfo.linkedin) {
            items.push(
              <a
                key="in"
                href={ensureUrl(personalInfo.linkedin)}
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-semibold"
                style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: primaryColor }}
              >
                {linkedinLabel}
              </a>
            );
          }
          if (personalInfo.github) {
            items.push(
              <a
                key="git"
                href={ensureUrl(personalInfo.github)}
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-semibold"
                style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: primaryColor }}
              >
                {githubLabel}
              </a>
            );
          }

          return (
            <div
              className="flex flex-wrap items-center justify-center gap-x-2 pt-1.5"
              style={{ fontSize: `${contactFontSize}px`, fontWeight: contactFontWeight, color: textColor }}
            >
              {items.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-400 select-none">•</span>}
                  {item}
                </React.Fragment>
              ))}
            </div>
          );
        })()}
      </div>

      <div className="space-y-3.5">{sectionsToRender}</div>
    </div>
  );
};

export default MteckTemplate;
