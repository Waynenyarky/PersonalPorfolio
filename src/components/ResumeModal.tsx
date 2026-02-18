import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../theme/useTheme';
import { X, Download } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** Resume PDF URL (passed from parent to avoid importing asset in lazy-loaded chunk) */
  resumeUrl: string;
};

export default function ResumeModal({ isOpen, onClose, resumeUrl }: Props) {
  const { theme } = useTheme();
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollBarWidth ? `${scrollBarWidth}px` : '';
    overlayRef.current?.scrollTo(0, 0);
    const id = requestAnimationFrame(() => {
      dialogRef.current?.focus({ preventScroll: true });
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

  const modal = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 overflow-y-auto overflow-x-hidden"
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
        className={'relative max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden focus:outline-none ' + bgCard + ' ' + borderBase + ' ' + focusRing}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={'sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 bg-inherit backdrop-blur-sm ' + borderBase}>
          <div className="min-w-0 flex-1">
            <h2 id="resume-title" className={'text-lg sm:text-xl lg:text-2xl font-bold ' + textPrimary}>
              Resume
            </h2>
            <p className={textSecondary + ' text-xs sm:text-sm mt-0.5 sm:mt-1'}>John Wayne Enrique</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <a
              href={resumeUrl}
              download="MyCV.pdf"
              className={'flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border hover:border-orange-500 transition-all duration-200 font-medium hover:bg-orange-500/10 flex items-center justify-center gap-2 text-sm sm:text-base ' + borderBase + ' ' + textPrimary + ' ' + focusRing}
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">Download CV</span>
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={'flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border hover:border-orange-500 transition-all duration-200 font-medium hover:bg-orange-500/10 flex items-center justify-center gap-2 text-sm sm:text-base ' + borderBase + ' ' + textPrimary + ' ' + focusRing}
              onClick={(e) => e.stopPropagation()}
            >
              <span>Open in new tab</span>
            </a>
            <button
              aria-label="Close modal"
              className={'shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-md border hover:border-orange-500 flex items-center justify-center transition-colors ' + borderBase + ' ' + textPrimary + ' ' + focusRing}
              onClick={onClose}
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          <div className={'w-full border rounded-lg overflow-hidden h-[calc(95vh-120px)] ' + borderBase}>
            <iframe
              src={resumeUrl + '#toolbar=1&navpanes=0&scrollbar=1'}
              loading="lazy"
              className="w-full h-full min-h-[400px]"
              title="Resume PDF"
            />
          </div>
          <div className="mt-3 sm:hidden">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={'inline-block px-4 py-2 rounded-lg border ' + borderBase + ' ' + textPrimary + ' hover:border-orange-500 transition-colors'}
            >
              Open in new tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}

