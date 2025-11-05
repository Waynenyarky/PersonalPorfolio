import type { Project } from '../types/project';
import { useTheme } from '../theme/useTheme';
import { X, Github, ExternalLink } from 'lucide-react';
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
  const bgSection = theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50';

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
        className={`relative max-w-5xl xl:max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] ${bgCard} border ${borderBase} rounded-xl sm:rounded-2xl shadow-xl overflow-hidden focus:outline-none ${focusRing}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header */}
        <div className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b ${borderBase} flex items-start justify-between gap-3 sm:gap-4`}>
          <div className="min-w-0 flex-1 pr-2 sm:pr-4">
            <div className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${textSecondary} mb-1 sm:mb-2`}>
              {project.category}
            </div>
            <h2 id="project-title" className={`text-xl sm:text-2xl lg:text-3xl font-bold leading-tight ${textPrimary} wrap-break-word`}>
              {project.title}
            </h2>
            <p id="project-tech" className={`${textSecondary} text-xs sm:text-sm lg:text-base mt-1 sm:mt-2 leading-relaxed`}>{project.tech}</p>
          </div>
          <button
            aria-label="Close modal"
            className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-md border ${borderBase} hover:border-orange-500 flex items-center justify-center transition-colors ${textPrimary} ${focusRing}`}
            onClick={onClose}
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto overscroll-contain max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-160px)] lg:max-h-[calc(90vh-140px)] min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 min-h-0">
            <section className={`${bgSection} rounded-lg p-4 sm:p-5 border ${borderBase} min-h-0 max-h-60 sm:max-h-72 lg:max-h-none overflow-y-auto`}>
              <h3 className={`text-sm sm:text-base font-semibold mb-2 ${textPrimary}`}>Description</h3>
              <p className={`${textSecondary} leading-relaxed text-xs sm:text-sm lg:text-base wrap-break-word hyphens-auto`}>{project.description}</p>
            </section>
            <section className={`${bgSection} rounded-lg p-4 sm:p-5 border ${borderBase} min-h-0 max-h-60 sm:max-h-72 lg:max-h-none overflow-y-auto`}>
              <h3 className={`text-sm sm:text-base font-semibold mb-2 ${textPrimary}`}>Our Mission</h3>
              <p className={`${textSecondary} leading-relaxed text-xs sm:text-sm lg:text-base wrap-break-word hyphens-auto`}>{project.mission}</p>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-0">
            <section className={`${bgSection} rounded-lg p-4 sm:p-5 border ${borderBase} min-h-0 max-h-60 sm:max-h-72 lg:max-h-none overflow-y-auto`}>
              <h3 className={`text-sm sm:text-base font-semibold mb-2 sm:mb-3 ${textPrimary}`}>Team Members</h3>
              <ul className="space-y-1 sm:space-y-2">
                {project.members?.map((m, idx) => (
                  <li key={idx} className={`${textSecondary} text-xs sm:text-sm lg:text-base wrap-break-word hyphens-auto`}>{m}</li>
                ))}
              </ul>
            </section>
            <section className={`${bgSection} rounded-lg p-4 sm:p-5 border ${borderBase} min-h-0 max-h-60 sm:max-h-72 lg:max-h-none overflow-y-auto`}>
              <h3 className={`text-sm sm:text-base font-semibold mb-2 sm:mb-3 ${textPrimary}`}>Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.stack?.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs border ${borderBase} ${textSecondary} wrap-break-word`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t ${borderBase} flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3`}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border ${borderBase} hover:border-orange-500 transition-colors ${textPrimary} ${focusRing} text-sm sm:text-base`}
              >
                <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden xs:inline">View Repository</span>
                <span className="xs:hidden">Repo</span>
                <ExternalLink size={14} className="opacity-60 sm:w-4 sm:h-4" />
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={goContact}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors text-sm sm:text-base ${focusRing}`}
            >
              Request Demo
            </button>
            <button
              onClick={onClose}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-md border ${borderBase} hover:border-orange-500 transition-colors ${textPrimary} text-sm sm:text-base ${focusRing}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

