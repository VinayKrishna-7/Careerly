import React from 'react';
import { formatDate, ensureUrl, groupSkills, parseBulletPoints, formatCleanUrl } from '../utils/formatters.js';

export const JakesTemplate = ({ resume }) => {
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
  const secondaryColor = settings.secondaryColor || '#334155';
  const textColor = settings.textColor || '#000000';
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
          className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.summary || 'Summary'}
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

  const renderEducation = () => {
    if (!education?.length || sectionVisibility.education === false) return null;
    return (
      <div key="education" className="space-y-2 avoid-break">
        <h3
          className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.education || 'Education'}
        </h3>
        <div className="space-y-1.5">
          {education.map((edu, i) => (
            <div key={edu.id || i} className="avoid-break" style={{ fontSize: `${bodyFontSize}px` }}>
              <div className="flex justify-between items-baseline font-bold" style={{ color: textColor }}>
                <span>{edu.institution}</span>
                {edu.location && <span className="font-normal">{edu.location}</span>}
              </div>
              <div className="flex justify-between items-baseline italic" style={{ color: textColor }}>
                <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</span>
                <span className="not-italic text-slate-700">
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                </span>
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

  const renderExperience = () => {
    if (!experience?.length || sectionVisibility.experience === false) return null;
    return (
      <div key="experience" className="space-y-2.5 avoid-break">
        <h3
          className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.experience || 'Experience'}
        </h3>
        <div className="space-y-2.5">
          {experience.map((exp, i) => {
            const bullets = parseBulletPoints(exp.description);
            return (
              <div key={exp.id || i} className="space-y-0.5 avoid-break" style={{ fontSize: `${bodyFontSize}px` }}>
                <div className="flex justify-between items-baseline font-bold" style={{ color: textColor }}>
                  <span>{exp.position}</span>
                  <span className="font-normal text-slate-700">
                    {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline italic text-slate-800">
                  <span>{exp.company}</span>
                  {exp.location && <span className="not-italic text-slate-600">{exp.location}</span>}
                </div>
                {bullets.length > 0 ? (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 pt-0.5 leading-relaxed" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
                    {bullets.map((b, idx) => (
                      <li key={idx} className="pl-1">
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  exp.description && (
                    <div className="leading-relaxed whitespace-pre-line pt-0.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
                      {exp.description}
                    </div>
                  )
                )}
              </div>
            );
          })}
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
          className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.projects || 'Projects'}
        </h3>
        <div className="space-y-2">
          {projects.map((proj, i) => {
            const bullets = parseBulletPoints(proj.description);
            const liveLabel = linkStyle === 'url' ? formatCleanUrl(proj.liveUrl) : 'Live Link';
            const githubLabel = linkStyle === 'url' ? formatCleanUrl(proj.githubUrl) : 'GitHub';

            return (
              <div key={proj.id || i} className="space-y-0.5 avoid-break" style={{ fontSize: `${bodyFontSize}px` }}>
                <div className="flex justify-between items-baseline">
                  <div className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="font-bold" style={{ color: textColor }}>{proj.title}</span>
                    {proj.technologies?.length > 0 && (
                      <span className="text-slate-800 italic">
                        | {proj.technologies.join(', ')}
                      </span>
                    )}
                    {(proj.liveUrl || proj.githubUrl) && (
                      <span className="inline-flex items-center gap-1.5 pl-1" style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight }}>
                        {proj.liveUrl && (
                          <a href={ensureUrl(proj.liveUrl)} target="_blank" rel="noreferrer" className="hover:underline font-semibold" style={{ color: primaryColor }}>
                            [{liveLabel}]
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a href={ensureUrl(proj.githubUrl)} target="_blank" rel="noreferrer" className="hover:underline font-medium" style={{ color: textColor }}>
                            [{githubLabel}]
                          </a>
                        )}
                      </span>
                    )}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-slate-700 shrink-0 ml-2" style={{ fontSize: `${bodyFontSize}px` }}>
                      {formatDate(proj.startDate)} – {formatDate(proj.endDate)}
                    </span>
                  )}
                </div>

                {bullets.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 leading-relaxed" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
                    {bullets.map((bullet, idx) => (
                      <li key={idx} className="pl-1">
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

  const renderSkills = () => {
    if (!skills?.length || sectionVisibility.skills === false) return null;
    const grouped = groupSkills(skills);
    return (
      <div key="skills" className="space-y-1 avoid-break">
        <h3
          className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.skills || 'Technical Skills'}
        </h3>
        <div className="space-y-0.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {grouped.map(([cat, items], idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="font-bold" style={{ color: textColor }}>{cat}: </span>
              <span>{items.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (!certifications?.length || sectionVisibility.certifications === false) return null;
    return (
      <div key="certifications" className="space-y-1 avoid-break">
        <h3
          className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.certifications || 'Certifications'}
        </h3>
        <div className="space-y-0.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {certifications.map((c, i) => (
            <div key={c.id || i} className="flex justify-between items-baseline leading-relaxed">
              <div>
                <span className="font-bold">{c.name}</span>
                {c.issuer && <span> — {c.issuer}</span>}
              </div>
              {c.issueDate && <span className="text-slate-700 shrink-0 ml-2" style={{ fontSize: `${bodyFontSize}px` }}>{formatDate(c.issueDate)}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    if (!languages?.length || sectionVisibility.languages === false) return null;
    return (
      <div key="languages" className="space-y-1 avoid-break">
        <h3
          className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.languages || 'Languages'}
        </h3>
        <div className="space-y-0.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {languages.map((l, i) => (
            <div key={l.id || i} className="leading-relaxed">
              <span className="font-bold">{l.language}: </span>
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
      <div key="achievements" className="space-y-1 avoid-break">
        <h3
          className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.achievements || 'Honors & Achievements'}
        </h3>
        <div className="space-y-1" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          {achievements.map((a, i) => (
            <div key={a.id || i}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{a.title}</span>
                  {a.issuer && <span> — {a.issuer}</span>}
                </div>
                {a.date && <span className="text-slate-700 shrink-0 ml-2" style={{ fontSize: `${bodyFontSize}px` }}>{formatDate(a.date)}</span>}
              </div>
              {a.description && <p className="pl-3 text-slate-700 leading-relaxed" style={{ fontSize: `${bodyFontSize}px` }}>{a.description}</p>}
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
          className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
          style={{
            fontSize: `${sectionTitleFontSize}px`,
            color: sectionTitleColor,
            fontWeight: sectionTitleFontWeight,
            borderColor: sectionTitleColor
          }}
        >
          {sectionTitles?.interests || 'Interests'}
        </h3>
        <div className="space-y-0.5" style={{ fontSize: `${bodyFontSize}px`, color: textColor, fontWeight: bodyFontWeight }}>
          <span>{interests.map((it) => it.name).filter(Boolean).join(', ')}</span>
        </div>
      </div>
    );
  };

  const sectionMap = {
    summary: renderSummary,
    education: renderEducation,
    experience: renderExperience,
    projects: renderProjects,
    skills: renderSkills,
    certifications: renderCertifications,
    languages: renderLanguages,
    achievements: renderAchievements,
    interests: renderInterests
  };

  const sectionsToRender = (sectionOrder || Object.keys(sectionMap)).map(
    (name) => sectionMap[name] && sectionMap[name]()
  );

  return (
    <div className="space-y-3" style={{ color: textColor }}>
      {/* Jake's Resume Centered Header */}
      <div className="text-center pb-1">
        <h1
          className="font-bold tracking-tight uppercase"
          style={{ fontSize: `${nameFontSize}px`, color: primaryColor }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p
            className="font-medium tracking-wide mt-0.5 text-slate-800"
            style={{ fontSize: `${roleFontSize}px`, fontWeight: roleFontWeight }}
          >
            {personalInfo.jobTitle}
          </p>
        )}

        {(() => {
          const contactLinkStyle = settings.contactLinkStyle || 'name';
          const websiteLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.website) : 'portfolio';
          const linkedinLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.linkedin) : 'linkedin';
          const githubLabel = contactLinkStyle === 'url' ? formatCleanUrl(personalInfo.github) : 'github';

          const items = [];
          if (personalInfo.phone) {
            items.push(
              <a key="phone" href={`tel:${personalInfo.phone}`} className="hover:underline" style={{ color: textColor }}>
                {personalInfo.phone}
              </a>
            );
          }
          if (personalInfo.email) {
            items.push(
              <a key="email" href={`mailto:${personalInfo.email}`} className="hover:underline" style={{ color: textColor }}>
                {personalInfo.email}
              </a>
            );
          }
          if (personalInfo.location) items.push(<span key="loc">{personalInfo.location}</span>);
          if (personalInfo.linkedin) {
            items.push(
              <a
                key="in"
                href={ensureUrl(personalInfo.linkedin)}
                target="_blank"
                rel="noreferrer"
                className="hover:underline underline decoration-1 underline-offset-2"
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
                className="hover:underline underline decoration-1 underline-offset-2"
                style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: primaryColor }}
              >
                {githubLabel}
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
                className="hover:underline underline decoration-1 underline-offset-2"
                style={{ fontSize: `${linksFontSize}px`, fontWeight: linksFontWeight, color: primaryColor }}
              >
                {websiteLabel}
              </a>
            );
          }

          return (
            <div
              className="flex flex-wrap items-center justify-center gap-x-2 pt-1"
              style={{ fontSize: `${contactFontSize}px`, fontWeight: contactFontWeight, color: textColor }}
            >
              {items.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-500 font-normal select-none">|</span>}
                  {item}
                </React.Fragment>
              ))}
            </div>
          );
        })()}
      </div>

      <div className="space-y-3">{sectionsToRender}</div>
    </div>
  );
};

export default JakesTemplate;
