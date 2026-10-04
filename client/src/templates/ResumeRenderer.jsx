import React, { useRef, useState, useLayoutEffect } from 'react';
import ModernTemplate from './ModernTemplate.jsx';
import ProfessionalTemplate from './ProfessionalTemplate.jsx';
import MinimalTemplate from './MinimalTemplate.jsx';
import CreativeTemplate from './CreativeTemplate.jsx';
import MteckTemplate from './MteckTemplate.jsx';
import KnyteTemplate from './KnyteTemplate.jsx';
import JakesTemplate from './JakesTemplate.jsx';
import AnubhavTemplate from './AnubhavTemplate.jsx';
import AustereTemplate from './AustereTemplate.jsx';
import { FONT_SIZE_CONFIG, MARGIN_CONFIG, FONT_OPTIONS } from '../utils/constants.js';

export const ResumeRenderer = ({ resume, className = '', onScaleChange }) => {
  if (!resume) return null;

  const pageRef = useRef(null);
  const contentRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const templateId = resume.template || 'modern';
  const settings = resume.settings || {};

  const currentFontId = settings.fontFamily || 'Times New Roman';
  const fontFamilyOption =
    FONT_OPTIONS.find((f) => f.id === currentFontId) ||
    FONT_OPTIONS.find((f) => f.id === 'Times New Roman') ||
    FONT_OPTIONS[0];
  const fontSizeConfig = FONT_SIZE_CONFIG[settings.fontSize] || FONT_SIZE_CONFIG.medium;
  const marginConfig = MARGIN_CONFIG[settings.pageMargin] || MARGIN_CONFIG.normal;

  const renderTemplateComponent = () => {
    switch (templateId) {
      case 'professional':
        return <ProfessionalTemplate resume={resume} />;
      case 'minimal':
        return <MinimalTemplate resume={resume} />;
      case 'creative':
        return <CreativeTemplate resume={resume} />;
      case 'mteck':
        return <MteckTemplate resume={resume} />;
      case 'knyte':
        return <KnyteTemplate resume={resume} />;
      case 'jakes':
        return <JakesTemplate resume={resume} />;
      case 'anubhav':
        return <AnubhavTemplate resume={resume} />;
      case 'austere':
        return <AustereTemplate resume={resume} />;
      case 'modern':
      default:
        return <ModernTemplate resume={resume} />;
    }
  };

  const lastScaleRef = useRef(1);

  useLayoutEffect(() => {
    let timeoutId = null;

    const calculateScale = () => {
      if (!pageRef.current || !contentRef.current) return;

      const style = window.getComputedStyle(pageRef.current);
      const paddingTop = parseFloat(style.paddingTop) || 0;
      const paddingBottom = parseFloat(style.paddingBottom) || 0;
      const availableHeight = pageRef.current.clientHeight - paddingTop - paddingBottom;
      const contentHeight = contentRef.current.scrollHeight;

      if (availableHeight > 0 && contentHeight > 0) {
        let calculatedScale = 1;
        if (contentHeight > availableHeight) {
          calculatedScale = Math.max(0.50, Math.floor(((availableHeight - 6) / contentHeight) * 1000) / 1000);
        }

        contentRef.current.style.transformOrigin = 'top left';
        if (calculatedScale !== 1) {
          contentRef.current.style.transform = `scale(${calculatedScale})`;
          contentRef.current.style.width = `${(1 / calculatedScale) * 100}%`;
        } else {
          contentRef.current.style.transform = 'none';
          contentRef.current.style.width = '100%';
        }

        if (Math.abs(calculatedScale - lastScaleRef.current) > 0.005) {
          lastScaleRef.current = calculatedScale;
          setScaleFactor(calculatedScale);
          if (onScaleChange) onScaleChange(calculatedScale);
        }
      }
    };

    const debouncedCalculate = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(calculateScale);
      }, 40);
    };

    debouncedCalculate();

    const resizeObserver = new ResizeObserver(debouncedCalculate);
    if (pageRef.current) resizeObserver.observe(pageRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [resume, settings, templateId, marginConfig, fontSizeConfig, onScaleChange]);

  return (
    <div
      ref={pageRef}
      id="resume-printable-area"
      className={`a4-page bg-white transition-all duration-150 ${marginConfig} ${fontSizeConfig.base} ${className}`}
      style={{
        fontFamily: fontFamilyOption.family,
        color: settings.textColor || '#1e293b'
      }}
    >
      <div
        ref={contentRef}
        className="a4-page-content w-full"
        style={{
          transformOrigin: 'top left'
        }}
      >
        {renderTemplateComponent()}
      </div>
    </div>
  );
};

export default ResumeRenderer;
