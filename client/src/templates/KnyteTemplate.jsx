import React from 'react';
import { formatDate, ensureUrl, groupSkills, parseBulletPoints, formatCleanUrl } from '../utils/formatters.js';

export const KnyteTemplate = ({ resume }) => {
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

  const primaryColor = settings.primaryColor || '#047857';
  const secondaryColor = settings.secondaryColor || '#065f46';
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
        <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: `${sectionTitleColor}30` }}>
          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: sectionTitleColor }} />
          <h3
            className="uppercase tracking-wider font-bold"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {sectionTitles?.summary || 'Executive Summary'}
          </h3>
        </div>
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
        <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: `${sectionTitleColor}30` }}>
          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: sectionTitleColor }} />
          <h3
            className="uppercase tracking-wider font-bold"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {sectionTitles?.experience || 'Experience & Leadership'}
          </h3>
        </div>
        <div className="space-y-3">
          {experience.map((exp, i) => (
            <div key={exp.id || i} className="space-y-1 avoid-break pl-2 border-l-2" style={{ borderColor: `${primaryColor}25` }}>
              <div className="flex justify-between items-baseline" style={{ fontSize: `${bodyFontSize}px` }}>
                <span className="font-bold text-slate-900" style={{ fontSize: `${bodyFontSize + 0.5}px` }}>
                  {exp.position}
                </span>
                <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                  {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                </span>
              </div>
              <div className="font-semibold" style={{ color: primaryColor, fontSize: `${bodyFontSize}px` }}>
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
      <div key="education" className="space-y-2.5 avoid-break">
        <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: `${sectionTitleColor}30` }}>
          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: sectionTitleColor }} />
          <h3
            className="uppercase tracking-wider font-bold"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {sectionTitles?.education || 'Education'}
          </h3>
        </div>
        <div className="space-y-2.5">
          {education.map((edu, i) => (
            <div key={edu.id || i} className="space-y-0.5 avoid-break pl-2 border-l-2" style={{ borderColor: `${primaryColor}25`, fontSize: `${bodyFontSize}px` }}>
              <div className="flex justify-between items-baseline font-bold" style={{ color: textColor }}>
                <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                </span>
              </div>
              <div className="text-slate-700 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                {edu.institution} {edu.gpa ? <span className="text-slate-500 font-normal">&bull; GPA: {edu.gpa}</span> : ''}
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
        <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: `${sectionTitleColor}30` }}>
          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: sectionTitleColor }} />
          <h3
            className="uppercase tracking-wider font-bold"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {sectionTitles?.skills || 'Skills & Expertise'}
          </h3>
        </div>
        <div className="space-y-1.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {grouped.map(([cat, items], idx) => (
            <div key={idx} className="flex items-baseline gap-2 leading-relaxed">
              <span className="font-bold shrink-0 min-w-[140px]" style={{ color: primaryColor }}>{cat}:</span>
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
        <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: `${sectionTitleColor}30` }}>
          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: sectionTitleColor }} />
          <h3
            className="uppercase tracking-wider font-bold"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {sectionTitles?.projects || 'Key Projects'}
          </h3>
        </div>
        <div className="space-y-2.5">
          {projects.map((proj, i) => {
            const bullets = parseBulletPoints(proj.description);
            const liveLabel = linkStyle === 'url' ? formatCleanUrl(proj.liveUrl) : 'Live Demo ↗';
            const githubLabel = linkStyle === 'url' ? formatCleanUrl(proj.githubUrl) : 'GitHub ↗';

            return (
              <div key={proj.id || i} className="space-y-1 avoid-break pl-2 border-l-2" style={{ borderColor: `${primaryColor}25`, fontSize: `${bodyFontSize}px` }}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: textColor }}>{proj.title}</span>
                    {proj.role && <span className="text-slate-600 font-medium">({proj.role})</span>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-slate-600 font-medium" style={{ fontSize: `${bodyFontSize}px` }}>
                      {formatDate(proj.startDate)} – {formatDate(proj.endDate)}
                    </span>
                  )}
                </div>

                {/* Active clickable project links */}
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

                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((t, tid) => (
                      <span
                        key={tid}
                        className="px-1.5 py-0.5 rounded font-medium border"
                        style={{
                          fontSize: `${bodyFontSize}px`,
                          backgroundColor: `${primaryColor}10`,
                          color: primaryColor,
                          borderColor: `${primaryColor}30`
                        }}
                      >
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
        <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: `${sectionTitleColor}30` }}>
          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: sectionTitleColor }} />
          <h3
            className="uppercase tracking-wider font-bold"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {sectionTitles?.certifications || 'Certifications'}
          </h3>
        </div>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {certifications.map((c, i) => (
            <div key={c.id || i} className="flex justify-between items-baseline leading-relaxed">
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-sm leading-none select-none" style={{ color: primaryColor }}>•</span>
                <span className="font-semibold" style={{ color: textColor }}>{c.name}</span>
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
        <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: `${sectionTitleColor}30` }}>
          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: sectionTitleColor }} />
          <h3
            className="uppercase tracking-wider font-bold"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {sectionTitles?.languages || 'Languages'}
          </h3>
        </div>
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
        <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: `${sectionTitleColor}30` }}>
          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: sectionTitleColor }} />
          <h3
            className="uppercase tracking-wider font-bold"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {sectionTitles?.achievements || 'Achievements & Honors'}
          </h3>
        </div>
        <div className="space-y-1.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {achievements.map((a, i) => (
            <div key={a.id || i} className="space-y-0.5">
              <div className="flex justify-between items-baseline leading-relaxed">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-sm leading-none select-none" style={{ color: primaryColor }}>•</span>
                  <span className="font-semibold" style={{ color: textColor }}>{a.title}</span>
                  {a.issuer && <span className="text-slate-600 font-normal"> &bull; {a.issuer}</span>}
                </div>
                {a.date && <span className="text-slate-600 shrink-0 ml-2" style={{ fontSize: `${bodyFontSize}px` }}>{formatDate(a.date)}</span>}
              </div>
              {a.description && (
                <div className="pl-4 text-slate-700 leading-relaxed" style={{ fontSize: `${bodyFontSize}px`, fontWeight: bodyFontWeight }}>
                  {a.description}
                </div>
              )}
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
        <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: `${sectionTitleColor}30` }}>
          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: sectionTitleColor }} />
          <h3
            className="uppercase tracking-wider font-bold"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {sectionTitles?.interests || 'Interests'}
          </h3>
        </div>
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
    <div className="space-y-4" style={{ color: textColor }}>
      {/* Resume Knyte Header */}
      <div className="pb-3 border-b-2" style={{ borderColor: primaryColor }}>
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h1
              className="font-extrabold tracking-tight"
              style={{ fontSize: `${nameFontSize}px`, color: textColor }}
            >
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p
                className="font-semibold tracking-wide mt-0.5"
                style={{ fontSize: `${roleFontSize}px`, fontWeight: roleFontWeight, color: primaryColor }}
              >
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
        </div>

        {/* Contact Links & Info */}
        {(() => {
          const contactLinkStyle = settings.contactLinkStyle || 'name';
          const websiteLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.website) : 'Portfolio';
          const linkedinLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.linkedin) : 'LinkedIn';
          const githubLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.github) : 'GitHub';

          return (
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2"
              style={{ fontSize: `${contactFontSize}px`, fontWeight: contactFontWeight, color: textColor }}
            >
              {personalInfo.location && <span className="font-medium">{personalInfo.location}</span>}
              {personalInfo.phone && (
                <span>
                  {personalInfo.location ? '• ' : ''}
                  <a href={`tel:${personalInfo.phone}`} className="hover:underline" style={{ color: textColor }}>
                    {personalInfo.phone}
                  </a>
                </span>
              )}
              {personalInfo.email && (
                <span>
                  • <a href={`mailto:${personalInfo.email}`} className="hover:underline" style={{ color: textColor }}>
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
                    className="hover:underline font-semibold"
                    style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: primaryColor }}
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
                    className="hover:underline font-semibold"
                    style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: primaryColor }}
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
                    className="hover:underline font-semibold"
                    style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: primaryColor }}
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

export default KnyteTemplate;
