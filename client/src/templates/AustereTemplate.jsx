import React from 'react';
import { formatDate, ensureUrl, groupSkills, parseBulletPoints, formatCleanUrl } from '../utils/formatters.js';

export const AustereTemplate = ({ resume }) => {
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

  const primaryColor = settings.primaryColor || '#334155';
  const secondaryColor = settings.secondaryColor || '#64748b';
  const textColor = settings.textColor || '#1e293b';
  const sectionTitleColor = settings.sectionTitleColor || primaryColor;
  const sectionTitleFontWeight = settings.sectionTitleFontWeight || '700';
  const bodyFontWeight = settings.bodyFontWeight || '400';
  const roleFontWeight = settings.roleFontWeight || '600';
  const contactFontWeight = settings.contactFontWeight || '400';
  const linksFontWeight = settings.linksFontWeight || '600';
  const nameFontSize = settings.nameFontSize || 26;
  const roleFontSize = settings.roleFontSize || 15;
  const contactFontSize = settings.contactFontSize || 12;
  const linksFontSize = settings.linksFontSize || 12;
  const sectionTitleFontSize = settings.sectionTitleFontSize || 15;
  const bodyFontSize = settings.bodyFontSize || 13;

  const renderSummary = () => {
    if (!summary || sectionVisibility.summary === false) return null;
    return (
      <div key="summary" className="space-y-1 avoid-break">
        <h3
          className="uppercase tracking-widest text-xs font-bold border-b border-slate-200 pb-1"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight
          }}
        >
          {sectionTitles?.summary || 'Profile'}
        </h3>
        <p
          className="leading-relaxed text-slate-700"
          style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}
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
          className="uppercase tracking-widest text-xs font-bold border-b border-slate-200 pb-1"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight
          }}
        >
          {sectionTitles?.experience || 'Experience'}
        </h3>
        <div className="space-y-3">
          {experience.map((exp, i) => (
            <div key={exp.id || i} className="space-y-0.5 avoid-break">
              <div className="flex justify-between items-baseline" style={{ fontSize: `${bodyFontSize}px` }}>
                <span className="font-semibold text-slate-900">{exp.position}</span>
                <span className="text-slate-500 text-xs">
                  {formatDate(exp.startDate)} — {formatDate(exp.endDate, exp.current)}
                </span>
              </div>
              <div className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                {exp.company} {exp.location && `• ${exp.location}`}
              </div>
              {exp.description && (
                <div
                  className="leading-relaxed whitespace-pre-line text-slate-700 pt-0.5"
                  style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}
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
          className="uppercase tracking-widest text-xs font-bold border-b border-slate-200 pb-1"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight
          }}
        >
          {sectionTitles?.education || 'Education'}
        </h3>
        <div className="space-y-2">
          {education.map((edu, i) => (
            <div key={edu.id || i} className="space-y-0.5 avoid-break" style={{ fontSize: `${bodyFontSize}px` }}>
              <div className="flex justify-between items-baseline font-semibold text-slate-900">
                <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                <span className="font-normal text-slate-500 text-xs">
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate, edu.current)}
                </span>
              </div>
              <div className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                {edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}
              </div>
              {edu.description && (
                <p className="mt-0.5 text-slate-700" style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}>
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
          className="uppercase tracking-widest text-xs font-bold border-b border-slate-200 pb-1"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight
          }}
        >
          {sectionTitles?.skills || 'Skills'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}>
          {grouped.map(([cat, items], idx) => (
            <div key={idx} className="flex items-baseline gap-2 leading-relaxed">
              <span className="font-semibold text-slate-900 shrink-0 min-w-[130px]">{cat}</span>
              <span className="text-slate-700">{items.join(', ')}</span>
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
          className="uppercase tracking-widest text-xs font-bold border-b border-slate-200 pb-1"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight
          }}
        >
          {sectionTitles?.projects || 'Projects'}
        </h3>
        <div className="space-y-2.5">
          {projects.map((proj, i) => {
            const bullets = parseBulletPoints(proj.description);
            const liveLabel = linkStyle === 'url' ? formatCleanUrl(proj.liveUrl) : 'Live';
            const githubLabel = linkStyle === 'url' ? formatCleanUrl(proj.githubUrl) : 'Source';

            return (
              <div key={proj.id || i} className="space-y-0.5 avoid-break" style={{ fontSize: `${bodyFontSize}px` }}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-slate-900">{proj.title}</span>
                    {proj.role && <span className="text-slate-500 italic">— {proj.role}</span>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-slate-500 text-xs shrink-0 ml-2">
                      {formatDate(proj.startDate)} — {formatDate(proj.endDate)}
                    </span>
                  )}
                </div>

                {/* Project links */}
                {(proj.liveUrl || proj.githubUrl) && (
                  <div className="flex flex-wrap gap-x-3 text-xs" style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight }}>
                    {proj.liveUrl && (
                      <a href={ensureUrl(proj.liveUrl)} target="_blank" rel="noreferrer" className="hover:underline text-slate-800 font-semibold">
                        {liveLabel} ↗
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={ensureUrl(proj.githubUrl)} target="_blank" rel="noreferrer" className="hover:underline text-slate-600 font-medium">
                        {githubLabel} ↗
                      </a>
                    )}
                  </div>
                )}

                {/* Description Bullets */}
                {bullets.length > 0 && (
                  <ul className="space-y-0.5 leading-relaxed pt-0.5 text-slate-700" style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}>
                    {bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 select-none shrink-0">—</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {proj.technologies?.length > 0 && (
                  <div className="text-slate-500 text-xs pt-0.5" style={{ fontSize: `${bodyFontSize - 1}px` }}>
                    {proj.technologies.join(' • ')}
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
          className="uppercase tracking-widest text-xs font-bold border-b border-slate-200 pb-1"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight
          }}
        >
          {sectionTitles?.certifications || 'Certifications'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}>
          {certifications.map((c, i) => (
            <div key={c.id || i} className="flex justify-between items-baseline leading-relaxed">
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-slate-900">{c.name}</span>
                {c.issuer && <span className="text-slate-500">({c.issuer})</span>}
              </div>
              {c.issueDate && <span className="text-slate-500 text-xs shrink-0 ml-2">{formatDate(c.issueDate)}</span>}
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
          className="uppercase tracking-widest text-xs font-bold border-b border-slate-200 pb-1"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight
          }}
        >
          {sectionTitles?.languages || 'Languages'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}>
          {languages.map((l, i) => (
            <div key={l.id || i} className="flex items-baseline gap-2 leading-relaxed">
              <span className="font-semibold text-slate-900 shrink-0 min-w-[130px]">{l.language}</span>
              <span className="text-slate-600">{l.proficiency}</span>
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
          className="uppercase tracking-widest text-xs font-bold border-b border-slate-200 pb-1"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight
          }}
        >
          {sectionTitles?.achievements || 'Achievements'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}>
          {achievements.map((a, i) => (
            <div key={a.id || i} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold text-slate-900">{a.title}</span>
                  {a.issuer && <span className="text-slate-500"> — {a.issuer}</span>}
                </div>
                {a.date && <span className="text-slate-500 text-xs shrink-0 ml-2">{formatDate(a.date)}</span>}
              </div>
              {a.description && <p className="pl-3 text-slate-600 leading-relaxed" style={{ fontSize: `${bodyFontSize}px` }}>{a.description}</p>}
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
          className="uppercase tracking-widest text-xs font-bold border-b border-slate-200 pb-1"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight
          }}
        >
          {sectionTitles?.interests || 'Interests'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}>
          <span className="text-slate-700">{interests.map((it) => it.name).filter(Boolean).join(' • ')}</span>
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
      {/* AustereCV Clean Header */}
      <div className="pb-3 border-b border-slate-300">
        <h1
          className="font-semibold tracking-wider uppercase text-slate-900"
          style={{ fontSize: `${nameFontSize}px` }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p
            className="tracking-widest uppercase text-xs text-slate-500 font-medium mt-0.5"
            style={{ fontSize: `${roleFontSize}px`, fontWeight: roleFontWeight }}
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
              className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-slate-600 text-xs"
              style={{ fontSize: `${contactFontSize}px`, fontWeight: contactFontWeight }}
            >
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.email && (
                <span>
                  {personalInfo.location ? '— ' : ''}
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline text-slate-800">
                    {personalInfo.email}
                  </a>
                </span>
              )}
              {personalInfo.phone && (
                <span>
                  — <a href={`tel:${personalInfo.phone}`} className="hover:underline text-slate-800">
                    {personalInfo.phone}
                  </a>
                </span>
              )}
              {personalInfo.website && (
                <span>
                  — <a
                    href={ensureUrl(personalInfo.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium text-slate-900"
                    style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight }}
                  >
                    {websiteLabel}
                  </a>
                </span>
              )}
              {personalInfo.linkedin && (
                <span>
                  — <a
                    href={ensureUrl(personalInfo.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium text-slate-900"
                    style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight }}
                  >
                    {linkedinLabel}
                  </a>
                </span>
              )}
              {personalInfo.github && (
                <span>
                  — <a
                    href={ensureUrl(personalInfo.github)}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium text-slate-900"
                    style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight }}
                  >
                    {githubLabel}
                  </a>
                </span>
              )}
            </div>
          );
        })()}
      </div>

      <div className="space-y-3.5">{sectionsToRender}</div>
    </div>
  );
};

export default AustereTemplate;
