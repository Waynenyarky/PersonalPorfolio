import { useEffect, useRef } from 'react';
import { AlertTriangle, X, Mail } from 'lucide-react';
import { useTheme } from '../theme/useTheme';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResendServiceUnavailableModal({ isOpen, onClose }: Props) {
  const { theme } = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

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
      aria-labelledby="resend-unavailable-title"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal Content */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="document"
        className={`relative max-w-md w-full ${bgCard} border ${borderBase} rounded-2xl shadow-2xl overflow-hidden focus:outline-none animate-fade-in-up ${focusRing}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          aria-label="Close modal"
          className={`absolute top-4 right-4 w-8 h-8 rounded-lg border ${borderBase} hover:border-orange-500 flex items-center justify-center transition-all duration-200 ${textPrimary} hover:bg-orange-500/10 ${focusRing}`}
          onClick={onClose}
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="p-8 sm:p-10 text-center">
          {/* Warning Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 animate-scale-in">
                <AlertTriangle className="text-white" size={40} strokeWidth={2.5} />
              </div>
              {/* Pulse animation rings */}
              <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Title */}
          <h2 id="resend-unavailable-title" className={`text-2xl sm:text-3xl font-bold mb-3 ${textPrimary}`}>
            Email Service Unavailable
          </h2>

          {/* Message */}
          <div className={`${textSecondary} text-base sm:text-lg mb-6 leading-relaxed space-y-3`}>
            <p>
              Your submission was <span className="font-semibold text-green-500">successfully saved</span>, but we couldn't send an email notification at this time.
            </p>
            <div className={`mt-4 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-900/30`}>
              <div className="flex items-start gap-3">
                <Mail className="text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" size={20} />
                <div className="text-left">
                  <p className={`text-sm font-semibold ${textPrimary} mb-1`}>What this means:</p>
                  <ul className={`text-xs ${textSecondary} space-y-1 list-disc list-inside`}>
                    <li>Your review/booking is safely stored</li>
                    <li>We will process it manually</li>
                    <li>You'll still receive a response</li>
                  </ul>
                </div>
              </div>
            </div>
            <p className="text-sm mt-4">
              The email service is temporarily unavailable. Please try again later if you need to contact us urgently.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

