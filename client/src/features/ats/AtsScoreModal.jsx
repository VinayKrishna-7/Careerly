import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { resumeApi } from '../../services/resumeApi.js';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  RotateCcw,
  Zap
} from 'lucide-react';

export const AtsScoreModal = ({ isOpen, onClose, resumeId, resumeTitle, resume: propResume }) => {
  const reduxActiveResume = useSelector((state) => state.resume.activeResume);
  const activeResume = propResume || reduxActiveResume;

  const [jobDescription, setJobDescription] = useState('');
  const [scoreData, setScoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScore = async (jdText = jobDescription) => {
    const targetId = resumeId || activeResume?._id;
    if (!targetId && !activeResume) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await resumeApi.getAtsScore(targetId, jdText, activeResume);
      setScoreData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate ATS score');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScore(jobDescription);
    }
  }, [isOpen, activeResume]);

  const handleAnalyzeJobDescription = (e) => {
    e.preventDefault();
    fetchScore(jobDescription);
  };

  const handleResetJobDescription = () => {
    setJobDescription('');
    fetchScore('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    if (score >= 60) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  };

  const hasJd = jobDescription && jobDescription.trim().length > 20;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ATS Resume Score & Job Matcher"
      description={`Multi-factor ATS parsability & keyword analysis for "${resumeTitle || activeResume?.title || 'Resume'}"`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Job Description Matching Form */}
        <form onSubmit={handleAnalyzeJobDescription} className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Target className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span>Target Job Description Match (Optional)</span>
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Paste job requirements</span>
          </div>

          <Textarea
            placeholder="Paste target job description, requirements, or desired qualifications here to evaluate your exact keyword match percentage against the role..."
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <div className="flex justify-between items-center gap-2">
            <div>
              {hasJd && (
                <button
                  type="button"
                  onClick={handleResetJobDescription}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Clear & View General ATS Score</span>
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                isLoading={isLoading}
                leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              >
                {hasJd ? 'Match Against Job Description' : 'Recalculate Score'}
              </Button>
            </div>
          </div>
        </form>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-12">
            <Spinner size="md" message="Analyzing resume against ATS parsability & keyword criteria..." />
          </div>
        )}

        {/* Error Notification */}
        {error && !isLoading && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Score Results Dashboard */}
        {scoreData && !isLoading && (
          <div className="space-y-5 animate-in fade-in">
            {/* Top Score Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
              {/* Circular Meter */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                <div className="relative flex items-center justify-center">
                  <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={getScoreColor(scoreData.overallScore)}
                      strokeDasharray={`${scoreData.overallScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                      {scoreData.overallScore}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">out of 100</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getScoreBg(scoreData.overallScore)}`}>
                    {scoreData.overallScore >= 80 ? 'Interview Ready' : scoreData.overallScore >= 60 ? 'Competitive' : 'Needs Optimization'}
                  </span>
                </div>
              </div>

              {/* Category Breakdown Bars */}
              <div className="sm:col-span-8 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {hasJd ? 'Job Match Breakdown' : 'ATS Category Breakdown'}
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      <span>{hasJd ? 'Job Description Keyword Match' : 'Skills & Vocabulary Richness'}</span>
                      <span>{scoreData.categoryScores?.keywords}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full transition-all duration-500"
                        style={{ width: `${scoreData.categoryScores?.keywords}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      <span>Measurable Impact & Metrics ({scoreData.metricsFound} data points)</span>
                      <span>{scoreData.categoryScores?.impact}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full transition-all duration-500"
                        style={{ width: `${scoreData.categoryScores?.impact}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      <span>Structure & Contact Completeness</span>
                      <span>{scoreData.categoryScores?.structure}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${scoreData.categoryScores?.structure}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      <span>Brevity & Word Density ({scoreData.wordCount} words)</span>
                      <span>{scoreData.categoryScores?.brevity}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-700 dark:bg-slate-400 rounded-full transition-all duration-500"
                        style={{ width: `${scoreData.categoryScores?.brevity}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Matches vs Missing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{hasJd ? `Matched Requirements (${scoreData.matchedKeywords?.length || 0})` : `Detected Skills & Tools (${scoreData.matchedKeywords?.length || 0})`}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {scoreData.matchedKeywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                  {(!scoreData.matchedKeywords || scoreData.matchedKeywords.length === 0) && (
                    <span className="text-xs text-slate-400">No matching keywords found</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 space-y-2">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{hasJd ? `Missing Requirements (${scoreData.missingKeywords?.length || 0})` : 'Recommended Additions'}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {scoreData.missingKeywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      + {kw}
                    </span>
                  ))}
                  {(!scoreData.missingKeywords || scoreData.missingKeywords.length === 0) && (
                    <span className="text-xs text-slate-400">Great coverage! No missing target terms.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Strengths & Actionable Recommendations */}
            <div className="space-y-3">
              {scoreData.strengths?.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Key Resume Strengths</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {scoreData.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {scoreData.improvements?.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                    <span>Actionable Recommendations for Higher Score</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {scoreData.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-600 dark:text-brand-400 font-bold">→</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AtsScoreModal;
