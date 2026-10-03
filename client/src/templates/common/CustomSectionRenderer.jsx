import React from 'react';
import { parseBulletPoints, ensureUrl } from '../../utils/formatters.js';

export const CustomSectionRenderer = ({
  section,
  sectionTitles = {},
  sectionVisibility = {},
  template = 'modern',
  styling = {}
}) => {
  if (!section || sectionVisibility[section.id] === false) return null;
  const items = section.items || [];
  if (!items.length) return null;

  const title = sectionTitles[section.id] || section.title || 'Custom Section';

  const {
    primaryColor = '#2563eb',
    sectionTitleColor = '#2563eb',
    textColor = '#1e293b',
    sectionTitleFontSize = 15,
    sectionTitleFontWeight = '800',
    bodyFontSize = 12,
    bodyFontWeight = '400'
  } = styling;

  const renderSectionHeading = () => {
    switch (template) {
      case 'knyte':
        return (
          <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: `${primaryColor}30` }}>
            <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: primaryColor }} />
            <h3
              className="uppercase tracking-wider font-bold"
              style={{
                fontSize: `${sectionTitleFontSize}px`,
                color: sectionTitleColor,
                fontWeight: sectionTitleFontWeight
              }}
            >
              {title}
            </h3>
          </div>
        );

      case 'jakes':
        return (
          <h3
            className="uppercase tracking-wide font-bold border-b border-black pb-0.5"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight,
              borderColor: sectionTitleColor
            }}
          >
            {title}
          </h3>
        );

      case 'mteck':
        return (
          <h3
            className="uppercase tracking-wider font-bold border-b border-slate-900 pb-0.5"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight,
              borderColor: `${primaryColor}40`
            }}
          >
            {title}
          </h3>
        );

      case 'anubhav':
        return (
          <h3
            className="uppercase tracking-wider font-bold border-b-2 pb-0.5"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight,
              borderColor: primaryColor
            }}
          >
            {title}
          </h3>
        );

      case 'professional':
        return (
          <h3
            className="uppercase tracking-wider font-bold border-b pb-1 font-serif"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight,
              borderColor: `${primaryColor}40`
            }}
          >
            {title}
          </h3>
        );

      case 'austere':
        return (
          <h3
            className="uppercase tracking-widest font-semibold border-b border-slate-200 pb-1"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {title}
          </h3>
        );

      case 'minimal':
        return (
          <h3
            className="uppercase tracking-widest font-bold border-b border-slate-300 pb-0.5"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight
            }}
          >
            {title}
          </h3>
        );

      case 'creative':
      case 'modern':
      default:
        return (
          <h3
            className="uppercase tracking-wider pb-1 border-b-2"
            style={{
              fontSize: `${sectionTitleFontSize}px`,
              color: sectionTitleColor,
              fontWeight: sectionTitleFontWeight,
              borderColor: `${sectionTitleColor}45`
            }}
          >
            {title}
          </h3>
        );
    }
  };

  return (
    <div key={section.id} className="space-y-2 avoid-break">
      {renderSectionHeading()}

      <div className="space-y-3">
        {items.map((it, idx) => {
          const bullets = parseBulletPoints(it.description);

          return (
            <div key={it.id || idx} className="space-y-1">
              {/* Item Heading Row */}
              <div className="flex justify-between items-baseline flex-wrap gap-x-2">
                <div className="font-semibold text-slate-900" style={{ fontSize: `${bodyFontSize}px` }}>
                  <span>{it.title || 'Untitled Entry'}</span>
                  {it.subtitle && (
                    <span className="text-slate-600 font-normal"> &bull; {it.subtitle}</span>
                  )}
                </div>

                <div
                  className="text-slate-600 shrink-0 text-right font-normal"
                  style={{ fontSize: `${bodyFontSize}px` }}
                >
                  {it.date && <span>{it.date}</span>}
                  {it.location && <span>{it.date ? ' | ' : ''}{it.location}</span>}
                </div>
              </div>

              {/* Link */}
              {it.link && (
                <div className="text-xs">
                  <a
                    href={ensureUrl(it.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-brand-600 font-medium"
                    style={{ fontSize: `${Math.max(bodyFontSize - 1.5, 10.5)}px` }}
                  >
                    {it.link}
                  </a>
                </div>
              )}

              {/* Bullet Points */}
              {bullets.length > 0 && (
                <ul
                  className="space-y-0.5 leading-relaxed"
                  style={{
                    fontSize: `${bodyFontSize}px`,
                    color: textColor,
                    fontWeight: bodyFontWeight
                  }}
                >
                  {bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-1.5">
                      <span
                        className="font-bold select-none shrink-0"
                        style={{
                          color: sectionTitleColor,
                          fontSize: `${bodyFontSize + 1}px`
                        }}
                      >
                        •
                      </span>
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

export default CustomSectionRenderer;
