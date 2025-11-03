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
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      aria-describedby="project-tech"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="document"
        className={`relative max-w-5xl w-full max-h-[90vh] ${bgCard} border ${borderBase} rounded-2xl shadow-xl overflow-hidden focus:outline-none`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header */}
        <div className={`px-6 sm:px-8 py-6 border-b ${borderBase} flex items-start justify-between`}>
          <div className="min-w-0 pr-4">
            <div className={`text-xs font-semibold uppercase tracking-wider ${textSecondary} mb-2`}>
              {project.category}
            </div>
            <h2 id="project-title" className={`text-2xl sm:text-3xl font-bold leading-tight ${textPrimary} truncate`}>
              {project.title}
            </h2>
            <p id="project-tech" className={`${textSecondary} text-sm sm:text-base mt-2 leading-relaxed`}>{project.tech}</p>
          </div>
          <button
            aria-label="Close modal"
            className={`w-9 h-9 rounded-md border ${borderBase} hover:border-orange-500 flex items-center justify-center transition-colors ${textPrimary} ${focusRing}`}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <section className={`${bgSection} rounded-lg p-5 border ${borderBase}`}>
              <h3 className={`text-sm font-semibold mb-2 ${textPrimary}`}>Description</h3>
              <p className={`${textSecondary} leading-relaxed text-sm sm:text-base`}>{project.description}</p>
            </section>
            <section className={`${bgSection} rounded-lg p-5 border ${borderBase}`}>
              <h3 className={`text-sm font-semibold mb-2 ${textPrimary}`}>Our Mission</h3>
              <p className={`${textSecondary} leading-relaxed text-sm sm:text-base`}>{project.mission}</p>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className={`${bgSection} rounded-lg p-5 border ${borderBase}`}>
              <h3 className={`text-sm font-semibold mb-3 ${textPrimary}`}>Team Members</h3>
              <ul className="space-y-2">
                {project.members?.map((m, idx) => (
                  <li key={idx} className={`${textSecondary} text-sm sm:text-base`}>{m}</li>
                ))}
              </ul>
            </section>
            <section className={`${bgSection} rounded-lg p-5 border ${borderBase}`}>
              <h3 className={`text-sm font-semibold mb-3 ${textPrimary}`}>Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.stack?.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-md text-xs border ${borderBase} ${textSecondary}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 sm:px-8 py-5 border-t ${borderBase} flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <div className="flex flex-wrap items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-md border ${borderBase} hover:border-orange-500 transition-colors ${textPrimary} ${focusRing}`}
              >
                <Github size={18} />
                <span>View Repository</span>
                <ExternalLink size={16} className="opacity-60" />
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={goContact}
              className={`px-5 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors ${focusRing}`}
            >
              Request Demo
            </button>
            <button
              onClick={onClose}
              className={`px-5 py-2 rounded-md border ${borderBase} hover:border-orange-500 transition-colors ${textPrimary} ${focusRing}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

