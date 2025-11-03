import { useTheme } from '../theme/useTheme';
import { X, Download } from 'lucide-react';
import { useEffect, useRef } from 'react';
import myCv from '../assets/MyCV.pdf';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResumeModal({ isOpen, onClose }: Props) {
  const { theme } = useTheme();
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="document"
        className={`relative max-w-5xl w-full max-h-[90vh] ${bgCard} border ${borderBase} rounded-xl shadow-2xl overflow-hidden focus:outline-none ${focusRing}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 sm:px-8 py-4 sm:py-6 border-b ${borderBase} flex items-center justify-between bg-inherit`}>
          <div>
            <h2 id="resume-title" className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
              Resume
            </h2>
            <p className={`${textSecondary} text-sm mt-1`}>John Wayne Enrique</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={myCv}
              download="MyCV.pdf"
              className={`px-4 py-2 rounded-lg border ${borderBase} hover:border-orange-500 transition-all duration-200 font-medium ${textPrimary} hover:bg-orange-500/10 flex items-center gap-2 ${focusRing}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              aria-label="Close modal"
              className={`w-9 h-9 rounded-md border ${borderBase} hover:border-orange-500 flex items-center justify-center transition-colors ${textPrimary} ${focusRing}`}
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="p-4 sm:p-6">
          <div className={`w-full h-[calc(90vh-140px)] border ${borderBase} rounded-lg overflow-hidden`}>
            <iframe
              src={`${myCv}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full"
              title="Resume PDF"
              style={{ minHeight: '600px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

