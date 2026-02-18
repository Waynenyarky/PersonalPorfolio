import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X, Server, Mail, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme/useTheme';

type ReviewData = {
  name: string;
  role: string;
  company: string;
  email: string;
  rating: number;
  review: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reviewData?: ReviewData;
  onEmailSent?: () => void;
};

export default function ReviewServiceUnavailableModal({ isOpen, onClose, reviewData, onEmailSent }: Props) {
  const { theme } = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  useEffect(() => {
    if (!isOpen) {
      setEmailSent(false);
      setEmailError(false);
      setIsSendingEmail(false);
      return;
    }
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollBarWidth ? `${scrollBarWidth}px` : '';
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

  const handleSendEmail = async () => {
    if (!reviewData) return;
    
    setIsSendingEmail(true);
    setEmailError(false);
    
    try {
      const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      console.log('Web3Forms Key check:', web3formsKey ? 'Key found (length: ' + web3formsKey.length + ')' : 'Key NOT FOUND');
      
      if (!web3formsKey) {
        console.error('VITE_WEB3FORMS_ACCESS_KEY is not set in .env file');
        setEmailError(true);
        setIsSendingEmail(false);
        return;
      }

      const emailSubject = `New Client Review - Rating: ${reviewData.rating}/5`;
      const emailHtml = `
      New Review Submitted (Server Down)
      Name: ${reviewData.name}
      Role: ${reviewData.role}
      Company: ${reviewData.company}
      Email: ${reviewData.email || 'N/A'}
      Rating: ${reviewData.rating} / 5
      Review:
      ${reviewData.review.replace(/\n/g, '<br>')}
      Note: Server is down. This was sent via email fallback and should be added to the database when online.
      `;
      
      const formData = new FormData();
      formData.append('access_key', web3formsKey);
      formData.append('subject', emailSubject);
      formData.append('from_name', 'Portfolio Reviews');
      formData.append('email', reviewData.email || 'noreply@portfolio.com');
      formData.append('message', emailHtml);
      // Sending as plain text to avoid Web3Forms showing "Html: true" in notification
      
      console.log('Sending email to Web3Forms...');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      console.log('Web3Forms response status:', response.status);
      const responseData = await response.json().catch(async () => {
        const text = await response.text().catch(() => '');
        console.error('Failed to parse response:', text);
        return { error: 'Failed to parse response', text };
      });
      
      console.log('Web3Forms response data:', responseData);
      
      // Web3Forms returns { success: true } on success or { success: false, message: "..." } on error
      if (response.ok && responseData.success === true) {
        console.log('Email sent successfully!');
        setEmailSent(true);
        setIsSendingEmail(false);
        if (onEmailSent) {
          setTimeout(() => {
            onEmailSent();
          }, 2000);
        }
      } else {
        // Check if it's a rate limit or specific error
        const errorMessage = responseData.message || responseData.error || 'Email sending failed';
        console.error('Web3Forms error:', errorMessage, responseData);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Email sending error:', error);
      console.error('Error details:', {
        message: error?.message,
        name: error?.name,
        stack: error?.stack
      });
      setEmailError(true);
      setIsSendingEmail(false);
    }
  };

  if (!isOpen) return null;

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-unavailable-title"
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
          className={`absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-lg border ${borderBase} hover:border-orange-500 flex items-center justify-center transition-all duration-200 ${textPrimary} hover:bg-orange-500/10 ${focusRing}`}
          onClick={onClose}
        >
          <X size={16} className="sm:w-4 sm:h-4" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8 lg:p-10 text-center">
          {/* Warning Icon */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-red-500 via-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-scale-in">
                <Server className="text-white w-[clamp(28px,8vw,40px)] h-[clamp(28px,8vw,40px)]" size={32} strokeWidth={2.5} />
              </div>
              {/* Pulse animation rings */}
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping [animation-delay:0.5s]" />
            </div>
          </div>

          {/* Title */}
          <h2 id="review-unavailable-title" className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 ${textPrimary}`}>
            {emailSent ? 'Review Sent Successfully!' : 'Service Not Available'}
          </h2>

          {/* Message */}
          {emailSent ? (
            <div className={`${textSecondary} text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed space-y-2 sm:space-y-3`}>
              <p>
                Your review has been <span className="font-semibold text-green-500">sent to the owner via email</span>, but it won't display on the site until the server is back online.
              </p>
              <div className={`mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900/30`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5 shrink-0 w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)]" size={18} />
                  <div className="text-left">
                    <p className={`text-xs sm:text-sm font-semibold ${textPrimary} mb-1`}>What this means:</p>
                    <ul className={`text-xs sm:text-sm ${textSecondary} space-y-1 list-disc list-inside`}>
                      <li>Your review was emailed to the owner</li>
                      <li>It won't display on the site yet</li>
                      <li>The server needs to be running to display it</li>
                      <li>Your feedback is safe and will appear once the server is online</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${textSecondary} text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed space-y-2 sm:space-y-3`}>
              <p>
                We're sorry, but the review service is <span className="font-semibold text-red-500">currently unavailable</span>.
              </p>
              <div className={`mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/30`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="text-red-600 dark:text-red-400 mt-0.5 shrink-0 w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)]" size={18} />
                  <div className="text-left">
                    <p className={`text-xs sm:text-sm font-semibold ${textPrimary} mb-1`}>What happened:</p>
                    <ul className={`text-xs sm:text-sm ${textSecondary} space-y-1 list-disc list-inside`}>
                      <li>The server is not responding</li>
                      <li>Your review could not be saved</li>
                      {reviewData && (
                        <li>We can send it via email instead</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              {emailError && (
                <div className={`mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/30`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertTriangle className="text-red-600 dark:text-red-400 mt-0.5 shrink-0 w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)]" size={18} />
                    <div className="text-left">
                      <p className={`text-xs sm:text-sm font-semibold ${textPrimary} mb-1`}>Email Failed</p>
                      <p className={`text-xs sm:text-sm ${textSecondary}`}>
                        {!import.meta.env.VITE_WEB3FORMS_ACCESS_KEY 
                          ? 'Web3Forms access key is not configured. Please contact us directly at joma.enrique.up@phinmaed.com'
                          : 'Email sending failed. Please try again later or contact us directly at joma.enrique.up@phinmaed.com'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {emailSent ? (
              <button
                onClick={onClose}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <CheckCircle size={18} />
                Understood
              </button>
            ) : (
              <>
                {reviewData && (
                  <button
                    onClick={handleSendEmail}
                    disabled={isSendingEmail}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingEmail ? (
                      <>
                        <Server className="animate-spin" size={18} />
                        Sending Email...
                      </>
                    ) : (
                      <>
                        <Mail size={18} />
                        Send Review via Email Instead
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

