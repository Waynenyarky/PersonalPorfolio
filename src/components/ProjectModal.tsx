import type { Project } from '../types/project';
import { useTheme } from '../theme/useTheme';
import { X, Github, ExternalLink, FileText, Target, Users, Code, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  const { theme } = useTheme();
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const bgSection = theme === 'dark' ? 'bg-gray-800/40' : 'bg-gray-50/80';
  const bgGradient = theme === 'dark' ? 'from-gray-800/50 to-gray-900/50' : 'from-orange-50/50 to-transparent';

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!project) return null;

  const goContact = () => {
    onClose();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      aria-describedby="project-tech"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="document"
        className={`relative max-w-5xl xl:max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] ${bgCard} border ${borderBase} rounded-xl sm:rounded-2xl shadow-xl overflow-hidden focus:outline-none ${focusRing} flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Professional Header */}
        <div className={`shrink-0 relative px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7 border-b ${borderBase} bg-gradient-to-r ${bgGradient}`}>
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1 pr-2 sm:pr-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className={`w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full`}></div>
                <span className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${textSecondary}`}>
                  {project.category}
                </span>
              </div>
              <h2 id="project-title" className={`text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight ${textPrimary} mb-2 sm:mb-3 wrap-break-word`}>
                {project.title}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Sparkles className={`${textSecondary} w-4 h-4`} size={16} />
                <p id="project-tech" className={`${textSecondary} text-xs sm:text-sm lg:text-base leading-relaxed`}>{project.tech}</p>
              </div>
            </div>
            <button
              aria-label="Close modal"
              className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg border ${borderBase} hover:border-orange-500 hover:bg-orange-500/10 flex items-center justify-center transition-all duration-200 ${textPrimary} ${focusRing} group`}
              onClick={onClose}
            >
              <X size={18} className="sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overscroll-contain min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 min-h-0">
            {/* Description Section */}
            <section className={`${bgSection} rounded-xl p-5 sm:p-6 lg:p-7 border ${borderBase} min-h-0 overflow-visible lg:max-h-80 lg:overflow-y-auto shadow-sm hover:shadow-md transition-shadow duration-300`}>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <FileText className="text-orange-500" size={20} />
                </div>
                <h3 className={`text-base sm:text-lg font-bold ${textPrimary}`}>Description</h3>
              </div>
              <div className={`${textSecondary} leading-relaxed text-sm sm:text-base lg:text-[15px] wrap-break-word`}>
                <p className="indent-4 sm:indent-6 lg:indent-8 mb-0">
                  {project.description}
                </p>
              </div>
            </section>

            {/* Mission Section */}
            <section className={`${bgSection} rounded-xl p-5 sm:p-6 lg:p-7 border ${borderBase} min-h-0 overflow-visible lg:max-h-80 lg:overflow-y-auto shadow-sm hover:shadow-md transition-shadow duration-300`}>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Target className="text-orange-500" size={20} />
                </div>
                <h3 className={`text-base sm:text-lg font-bold ${textPrimary}`}>Our Mission</h3>
              </div>
              <div className={`${textSecondary} leading-relaxed text-sm sm:text-base lg:text-[15px] wrap-break-word`}>
                <p className="indent-4 sm:indent-6 lg:indent-8 mb-0">
                  {project.mission}
                </p>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-0">
            {/* Team Members Section */}
            <section className={`${bgSection} rounded-xl p-5 sm:p-6 lg:p-7 border ${borderBase} min-h-0 overflow-visible lg:max-h-80 lg:overflow-y-auto shadow-sm hover:shadow-md transition-shadow duration-300`}>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Users className="text-orange-500" size={20} />
                </div>
                <h3 className={`text-base sm:text-lg font-bold ${textPrimary}`}>Team Members</h3>
              </div>
              <ul className="space-y-2.5 sm:space-y-3">
                {project.members?.map((m, idx) => (
                  <li key={idx} className={`flex items-start gap-2.5 ${textSecondary} text-sm sm:text-base wrap-break-word`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tech Stack Section */}
            <section className={`${bgSection} rounded-xl p-5 sm:p-6 lg:p-7 border ${borderBase} min-h-0 overflow-visible lg:max-h-80 lg:overflow-y-auto shadow-sm hover:shadow-md transition-shadow duration-300`}>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Code className="text-orange-500" size={20} />
                </div>
                <h3 className={`text-base sm:text-lg font-bold ${textPrimary}`}>Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {project.stack?.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border ${borderBase} ${textSecondary} bg-gradient-to-br ${theme === 'dark' ? 'from-gray-800/50 to-gray-900/50' : 'from-white to-gray-50'} hover:border-orange-500 hover:text-orange-500 transition-all duration-200 cursor-default shadow-sm`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Professional Footer */}
        <div className={`shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 border-t ${borderBase} bg-gradient-to-r ${bgGradient}`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg border ${borderBase} hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-200 ${textPrimary} ${focusRing} text-sm sm:text-base font-medium shadow-sm hover:shadow-md whitespace-nowrap`}
                >
                  <Github size={18} className="sm:w-5 sm:h-5 group-hover:text-orange-500 transition-colors shrink-0" />
                  <span className="hidden sm:inline">View Repository</span>
                  <span className="sm:hidden">Repo</span>
                  <ExternalLink size={14} className="opacity-60 group-hover:opacity-100 group-hover:text-orange-500 transition-all sm:w-4 sm:h-4 shrink-0" />
                </a>
              )}
            </div>
            <div className="flex items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={goContact}
                className={`flex-1 sm:flex-none px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${focusRing} whitespace-nowrap`}
              >
                Request Demo
              </button>
              <button
                onClick={onClose}
                className={`flex-1 sm:flex-none px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg border ${borderBase} hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-200 ${textPrimary} text-sm sm:text-base font-medium shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${focusRing} whitespace-nowrap`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

