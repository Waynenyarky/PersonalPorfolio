import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../theme/useTheme';
import { X, Download, FileText } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** Resume PDF URL (passed from parent to avoid importing asset in lazy-loaded chunk) */
  resumeUrl: string;
};

/** True when we should avoid opening external app (e.g. in-app browser on mobile). */
function preferInModal(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const inApp = /messenger|fbav|fban|instagram|line|twitter|tiktok|snapchat|whatsapp|wechat/i.test(ua);
  const narrow = window.innerWidth < 768;
  return inApp || narrow;
}

export default function ResumeModal({ isOpen, onClose, resumeUrl }: Props) {
  const { theme } = useTheme();
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const viewerBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/80';
  const showDownload = !preferInModal();

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const blobUrlRef = useRef<string | null>(null);

  // Load PDF as blob and set blob URL so the iframe stays in-app (no "leaving our app" on mobile)
  useEffect(() => {
    if (!isOpen || !resumeUrl) return;
    setPdfLoaded(false);
    setBlobUrl(null);
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    let cancelled = false;
    fetch(resumeUrl)
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setBlobUrl(url);
      })
      .catch(() => {
        if (cancelled) return;
        setBlobUrl(resumeUrl);
      });
    return () => {
      cancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [isOpen, resumeUrl]);

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

  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      fetch(resumeUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'John-Wayne-Enrique-Resume.pdf';
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch(() => {
          const a = document.createElement('a');
          a.href = resumeUrl;
          a.download = 'John-Wayne-Enrique-Resume.pdf';
          a.click();
        });
    },
    [resumeUrl]
  );

  if (!isOpen) return null;

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

  const modal = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 overflow-y-auto overflow-x-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      aria-describedby="resume-modal-desc"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="document"
        className={`relative flex flex-col max-w-4xl w-full max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] lg:max-h-[88vh] border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden focus:outline-none ${bgCard} ${borderBase} ${focusRing}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className={`shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b ${borderBase} ${bgCard}`}>
          <div className="min-w-0 flex-1 flex items-center gap-3">
            <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
              <FileText size={20} aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 id="resume-modal-title" className={`text-lg sm:text-xl font-bold truncate ${textPrimary}`}>
                CV
              </h2>
              <p id="resume-modal-desc" className={`text-xs sm:text-sm truncate ${textSecondary}`}>
                John Wayne Enrique · Full Stack Developer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {showDownload && (
              <button
                type="button"
                onClick={handleDownload}
                className={`inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm hover:shadow-md ${focusRing}`}
              >
                <Download size={18} aria-hidden />
                <span>Download PDF</span>
              </button>
            )}
            {!showDownload && (
              <p className={`text-xs ${textSecondary} hidden sm:block`}>View CV below</p>
            )}
            <button
              type="button"
              aria-label="Close CV viewer"
              className={`shrink-0 w-9 h-9 rounded-lg border ${borderBase} ${textPrimary} hover:border-orange-500 hover:bg-orange-500/10 flex items-center justify-center transition-colors ${focusRing}`}
              onClick={onClose}
            >
              <X size={18} aria-hidden />
            </button>
          </div>
        </header>

        {/* PDF viewer — responsive height across all screen sizes */}
        <div className={`flex-1 min-h-0 flex flex-col p-3 sm:p-4 lg:p-5 ${viewerBg}`}>
          <div className={`relative flex-1 min-h-[50vh] sm:min-h-[58vh] md:min-h-[65vh] lg:min-h-[72vh] xl:min-h-[78vh] rounded-lg border ${borderBase} overflow-hidden bg-white dark:bg-gray-900 shadow-inner`}>
            {!pdfLoaded && (
              <div className={`absolute inset-0 z-10 flex items-center justify-center ${viewerBg} rounded-lg`}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" aria-hidden />
                  <p className={`text-sm font-medium ${textSecondary}`}>Loading CV…</p>
                </div>
              </div>
            )}
            <iframe
              key={blobUrl ?? resumeUrl}
              src={isOpen && (blobUrl || resumeUrl) ? `${blobUrl || resumeUrl}#toolbar=0&navpanes=0&scrollbar=1` : undefined}
              loading="eager"
              className="w-full h-full min-h-[50vh] sm:min-h-[58vh] md:min-h-[65vh] lg:min-h-[72vh] xl:min-h-[78vh] block"
              title="CV — John Wayne Enrique"
              onLoad={() => setPdfLoaded(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}
