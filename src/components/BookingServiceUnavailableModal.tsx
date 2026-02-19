import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X, Server, Mail, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme/useTheme';
import { CONTACT_EMAIL } from '../constants/contact';

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  projectDescription: string;
  timeline: string;
  budget?: string;
  preferredContact: string;
  preferredDate?: string;
  preferredTime?: string;
  additionalNotes?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  bookingData?: BookingFormData;
  onEmailSent?: () => void;
};

export default function BookingServiceUnavailableModal({ isOpen, onClose, bookingData, onEmailSent }: Props) {
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
    if (!bookingData) return;
    
    setIsSendingEmail(true);
    setEmailError(false);
    
    try {
      const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (import.meta.env.DEV) {
        console.log('Web3Forms Key check:', web3formsKey ? 'Key found (length: ' + web3formsKey.length + ')' : 'Key NOT FOUND');
      }
      if (!web3formsKey) {
        if (import.meta.env.DEV) console.error('VITE_WEB3FORMS_ACCESS_KEY is not set in .env file');
        setEmailError(true);
        setIsSendingEmail(false);
        return;
      }

      const projectTypeMap: Record<string, string> = {
        'web-app': 'Web Application',
        'mobile-app': 'Mobile Application',
        'e-commerce': 'E-Commerce Platform',
        'landing-page': 'Landing Page',
        'api-development': 'API Development',
        'database-design': 'Database Design',
        'ui-ux-design': 'UI/UX Design',
        'full-stack': 'Full-Stack Development',
        'maintenance': 'Maintenance & Support',
        'consulting': 'Consulting',
        'other': 'Other'
      };

      const emailSubject = `New Client Booking: ${projectTypeMap[bookingData.projectType] || bookingData.projectType}`;
      let preferredDateStr = 'Not specified';
      if (bookingData.preferredDate) {
        try {
          preferredDateStr = new Date(bookingData.preferredDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        } catch {
          preferredDateStr = bookingData.preferredDate;
        }
      }
      let preferredTimeStr = 'Not specified';
      if (bookingData.preferredTime) {
        try {
          const timeStr = bookingData.preferredTime.includes('T') 
            ? bookingData.preferredTime.split('T')[1] 
            : bookingData.preferredTime;
          preferredTimeStr = new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } catch {
          preferredTimeStr = bookingData.preferredTime;
        }
      }
      const emailHtml = `
      New Booking Request (Server Down)
      Name: ${bookingData.name}
      Email: ${bookingData.email}
      Phone: ${bookingData.phone}
      Company: ${bookingData.company || 'Not specified'}
      Project Type: ${projectTypeMap[bookingData.projectType] || bookingData.projectType}
      Timeline: ${bookingData.timeline}
      Budget: ${bookingData.budget || 'Not specified'}
      Preferred Contact: ${bookingData.preferredContact}
      Preferred Date: ${preferredDateStr}
      Preferred Time: ${preferredTimeStr}
      Project Description: ${bookingData.projectDescription.replace(/\n/g, '<br>')}
      ${bookingData.additionalNotes ? `Additional Notes: ${bookingData.additionalNotes.replace(/\n/g, '<br>')}` : ''}
      Note: Server is down. This was sent via email fallback and should be added to the database when online.
      `;
      
      const formData = new FormData();
      formData.append('access_key', web3formsKey);
      formData.append('subject', emailSubject);
      formData.append('from_name', 'Portfolio Bookings');
      formData.append('email', bookingData.email || 'noreply@portfolio.com');
      formData.append('message', emailHtml);
      if (import.meta.env.DEV) console.log('Sending booking email to Web3Forms...');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      if (import.meta.env.DEV) console.log('Web3Forms response status:', response.status);
      const responseData = await response.json().catch(async () => {
        const text = await response.text().catch(() => '');
        if (import.meta.env.DEV) console.error('Failed to parse response:', text);
        return { error: 'Failed to parse response', text };
      });

      if (import.meta.env.DEV) console.log('Web3Forms response data:', responseData);

      if (response.ok && responseData.success === true) {
        if (import.meta.env.DEV) console.log('Booking email sent successfully!');
        setEmailSent(true);
        setIsSendingEmail(false);
        if (onEmailSent) {
          setTimeout(() => {
            onEmailSent();
          }, 3100);
        }
      } else {
        const errorMessage = responseData.message || responseData.error || 'Email sending failed';
        if (import.meta.env.DEV) console.error('Web3Forms error:', errorMessage, responseData);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Email sending error:', error);
        console.error('Error details:', { message: error?.message, name: error?.name, stack: error?.stack });
      }
      setEmailError(true);
      setIsSendingEmail(false);
    }
  };

  if (!isOpen) return null;

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-unavailable-title"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal Content */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="document"
        className={`relative max-w-md w-full ${bgCard} border ${borderBase} rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden focus:outline-none animate-fade-in-up ${focusRing}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          aria-label="Close modal"
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-lg border ${borderBase} hover:border-orange-500 flex items-center justify-center transition-all duration-200 ${textPrimary} hover:bg-orange-500/10 ${focusRing}`}
          onClick={onClose}
        >
          <X size={14} className="sm:w-4 sm:h-4" />
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
          <h2 id="booking-unavailable-title" className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 ${textPrimary}`}>
            {emailSent ? 'Booking Sent Successfully!' : 'Book via Email'}
          </h2>

          {/* Message */}
          {emailSent ? (
            <div className={`${textSecondary} text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed space-y-2 sm:space-y-3`}>
              <p>
                Your booking request has been <span className="font-semibold text-green-500">sent to the owner via email</span>, but it won't be saved in the system until the server is back online.
              </p>
              <div className={`mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900/30`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5 shrink-0 w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)]" size={18} />
                  <div className="text-left">
                    <p className={`text-xs sm:text-sm font-semibold ${textPrimary} mb-1`}>What this means:</p>
                    <ul className={`text-xs sm:text-sm ${textSecondary} space-y-1 list-disc list-inside`}>
                      <li>Your booking was emailed to the owner</li>
                      <li>It won't be saved in the system yet</li>
                      <li>The server needs to be running to save it</li>
                      <li>Your request is safe and will be processed once the server is online</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${textSecondary} text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed space-y-2 sm:space-y-3`}>
              <p>
                Online booking is <span className="font-semibold text-red-500">not connected on this site</span>. Booking is available on request.
              </p>
              <div className={`mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/30`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="text-red-600 dark:text-red-400 mt-0.5 shrink-0 w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)]" size={18} />
                  <div className="text-left">
                    <p className={`text-xs sm:text-sm font-semibold ${textPrimary} mb-1`}>What you can do:</p>
                    <ul className={`text-xs sm:text-sm ${textSecondary} space-y-1 list-disc list-inside`}>
                      <li>Send your project details via email using the button below</li>
                      {bookingData && (
                        <li>Your form is ready — I&apos;ll receive it by email and get back to you</li>
                      )}
                      <li>Or contact me directly at the email in the footer</li>
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
                          ? (CONTACT_EMAIL ? `Web3Forms access key is not configured. Please contact us directly at ${CONTACT_EMAIL}` : 'Web3Forms access key is not configured. Please use the contact section in the footer.')
                          : (CONTACT_EMAIL ? `Email sending failed. Please try again later or contact us directly at ${CONTACT_EMAIL}` : 'Email sending failed. Please try again later or use the contact section in the footer.')}
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
                {bookingData && (
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
                        Send Booking via Email Instead
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

