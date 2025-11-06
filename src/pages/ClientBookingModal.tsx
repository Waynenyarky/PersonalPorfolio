import { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Calendar, DollarSign, Clock, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme/useTheme';
import { submitBooking } from '../services/bookingService';
import EmailServiceUnavailableModal from '../components/EmailServiceUnavailableModal';
import BookingServiceUnavailableModal from '../components/BookingServiceUnavailableModal';
import ProfessionalDropdown from '../components/ProfessionalDropdown';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ClientBookingModal({ isOpen, onClose }: Props) {
  const { theme } = useTheme();
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-900/50' : 'bg-white';

  const initialFormData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    projectTypeOther: '',
    projectDescription: '',
    timeline: '',
    budget: '',
    preferredContact: 'email',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [showEmailUnavailableModal, setShowEmailUnavailableModal] = useState(false);
  const [showServiceUnavailableModal, setShowServiceUnavailableModal] = useState(false);
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

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData(initialFormData);
      setStatusText('');
      setStatusType('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusType('');
    setStatusText('');

    // Validate PH mobile format: exactly 11 digits starting with 09
    // Trim whitespace and ensure it's exactly 11 digits
    const trimmedPhone = formData.phone.trim();
    if (!/^09\d{9}$/.test(trimmedPhone)) {
      setStatusType('error');
      setStatusText('Please enter a valid PH mobile number (11 digits, starts with 09).');
      setIsSubmitting(false);
      return;
    }

    // Update formData with trimmed phone
    const validatedFormData = { ...formData, phone: trimmedPhone };

    // Validate other project type when selected
    if (validatedFormData.projectType === 'other' && !validatedFormData.projectTypeOther.trim()) {
      setStatusType('error');
      setStatusText('Please enter the other project type.');
      setIsSubmitting(false);
      return;
    }

    const result = await submitBooking(validatedFormData);
    setIsSubmitting(false);

    if (result.type === 'success') {
      setStatusType(result.type);
      setStatusText(result.message);
      // Check if email was sent successfully
      if (result.emailSent === false) {
        setShowEmailUnavailableModal(true);
      }
      // Reset form after successful submission
      setTimeout(() => {
        onClose();
      }, 3000);
    } else if (result.type === 'error') {
      // If it's a server error, show the modal instead of inline error
      if (result.serverError) {
        setShowServiceUnavailableModal(true);
      } else {
        // For other errors, show inline message
        setStatusType(result.type);
        setStatusText(result.message);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Remove all non-digit characters and limit to 11 digits
      const digits = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, phone: digits }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="document"
        className={`relative max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] ${bgCard} border ${borderBase} rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden focus:outline-none ${focusRing}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 border-b ${borderBase} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 bg-inherit backdrop-blur-sm`}>
          <div className="min-w-0 flex-1">
            <h2 id="booking-title" className={`text-lg sm:text-xl lg:text-2xl font-bold ${textPrimary}`}>
              Client Booking
            </h2>
            <p className={`${textSecondary} text-xs sm:text-sm mt-0.5 sm:mt-1`}>Book a development project consultation</p>
          </div>
          <button
            aria-label="Close modal"
            className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-md border ${borderBase} hover:border-orange-500 flex items-center justify-center transition-colors ${textPrimary} ${focusRing}`}
            onClick={onClose}
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${textPrimary} flex items-center gap-2`}>
                <User size={18} className="text-orange-500 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base lg:text-lg">Personal Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${textSecondary}`}>Full Name *</label>
                  <div className="relative">
                    <User className={`absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={16} style={{ width: 'clamp(14px, 4vw, 18px)', height: 'clamp(14px, 4vw, 18px)' }} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-lg sm:rounded-xl pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Email Address *</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Phone Number *</label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <input
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      pattern="09[0-9]{9}"
                      maxLength={11}
                      placeholder="Enter your phone number (e.g., 09123456789)"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                      value={formData.phone}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
                        if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Company</label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <input
                      type="text"
                      name="company"
                      placeholder="Enter your company name"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${textPrimary} flex items-center gap-2`}>
                <Briefcase size={20} className="text-orange-500" />
                Project Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Project Type *</label>
                  <ProfessionalDropdown
                    name="projectType"
                    value={formData.projectType}
                    onChange={(val) => setFormData({ ...formData, projectType: val })}
                    options={[
                      { value: '', label: 'Select project type' },
                      { value: 'web-app', label: 'Web Application' },
                      { value: 'mobile-app', label: 'Mobile Application' },
                      { value: 'e-commerce', label: 'E-Commerce Platform' },
                      { value: 'landing-page', label: 'Landing Page' },
                      { value: 'api-development', label: 'API Development' },
                      { value: 'database-design', label: 'Database Design' },
                      { value: 'ui-ux-design', label: 'UI/UX Design' },
                      { value: 'full-stack', label: 'Full-Stack Development' },
                      { value: 'maintenance', label: 'Maintenance & Support' },
                      { value: 'consulting', label: 'Consulting' },
                      { value: 'other', label: 'Other' },
                    ]}
                    inputBg={inputBg}
                    borderBase={borderBase}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                    leftIcon={<FileText className={textSecondary} size={18} />}
                    required
                  />
                  {formData.projectType === 'other' && (
                    <input
                      type="text"
                      name="projectTypeOther"
                      placeholder="Enter other project type"
                      className={`mt-2 w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                      value={formData.projectTypeOther}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Timeline *</label>
                  <ProfessionalDropdown
                    name="timeline"
                    value={formData.timeline}
                    onChange={(val) => setFormData({ ...formData, timeline: val })}
                    options={[
                      { value: '', label: 'Select timeline' },
                      { value: 'asap', label: 'ASAP / Urgent' },
                      { value: '1-month', label: '1 Month' },
                      { value: '2-3-months', label: '2-3 Months' },
                      { value: '3-6-months', label: '3-6 Months' },
                      { value: '6-months-plus', label: '6+ Months' },
                      { value: 'flexible', label: 'Flexible' },
                    ]}
                    inputBg={inputBg}
                    borderBase={borderBase}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                    leftIcon={<Clock className={textSecondary} size={18} />}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Project Description *</label>
                  <div className="relative">
                    <MessageSquare className={`absolute left-3 top-4 ${textSecondary}`} size={18} />
                    <textarea
                      name="projectDescription"
                      placeholder="Describe your project requirements, goals, and any specific features you need..."
                      rows={4}
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 pt-3 pb-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                      value={formData.projectDescription}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Budget & Preferences */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${textPrimary} flex items-center gap-2`}>
                <DollarSign size={20} className="text-orange-500" />
                Budget & Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Budget Range</label>
                  <ProfessionalDropdown
                    name="budget"
                    value={formData.budget}
                    onChange={(val) => setFormData({ ...formData, budget: val })}
                    options={[
                      { value: '', label: 'Select budget range' },
                      { value: 'under-1k', label: 'Under $1,000' },
                      { value: '1k-5k', label: '$1,000 - $5,000' },
                      { value: '5k-10k', label: '$5,000 - $10,000' },
                      { value: '10k-25k', label: '$10,000 - $25,000' },
                      { value: '25k-50k', label: '$25,000 - $50,000' },
                      { value: '50k-plus', label: '$50,000+' },
                      { value: 'discuss', label: 'Prefer to discuss' },
                    ]}
                    inputBg={inputBg}
                    borderBase={borderBase}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                    leftIcon={<DollarSign className={textSecondary} size={18} />}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Preferred Contact Method *</label>
                  <ProfessionalDropdown
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={(val) => setFormData({ ...formData, preferredContact: val })}
                    options={[
                      { value: 'email', label: 'Email' },
                      { value: 'phone', label: 'Phone Call' },
                      { value: 'video', label: 'Video Call' },
                      { value: 'meeting', label: 'In-Person Meeting' },
                    ]}
                    inputBg={inputBg}
                    borderBase={borderBase}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                    leftIcon={<Phone className={textSecondary} size={18} />}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Preferred Date</label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <input
                      type="date"
                      name="preferredDate"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Preferred Time</label>
                  <div className="relative">
                    <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <input
                      type="time"
                      name="preferredTime"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Additional Notes</label>
                  <div className="relative">
                    <MessageSquare className={`absolute left-3 top-4 ${textSecondary}`} size={18} />
                    <textarea
                      name="additionalNotes"
                      placeholder="Any additional information, requirements, or questions..."
                      rows={3}
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 pt-3 pb-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                      value={formData.additionalNotes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            {statusText && (
              <div
                className={`${statusType === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'} border rounded-xl p-4 flex items-start gap-3`}
                role="status"
                aria-live="polite"
              >
                {statusType === 'success' ? (
                  <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <X size={20} className="flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium">{statusText}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border ${borderBase} hover:border-orange-500 ${textPrimary} font-semibold rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base ${focusRing}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base ${focusRing}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Service Unavailable Modal */}
      <EmailServiceUnavailableModal
        isOpen={showEmailUnavailableModal}
        onClose={() => setShowEmailUnavailableModal(false)}
      />

      {/* Booking Service Unavailable Modal */}
      <BookingServiceUnavailableModal
        isOpen={showServiceUnavailableModal}
        onClose={() => {
          setShowServiceUnavailableModal(false);
          // Reset form if user closes without sending email
          setFormData(initialFormData);
        }}
        bookingData={formData}
        onEmailSent={() => {
          setShowServiceUnavailableModal(false);
          setStatusType('success');
          setStatusText("Booking sent via email! We'll contact you soon.");
          // Reset form after email sent
          setFormData(initialFormData);
          // Close modal after 3 seconds
          setTimeout(() => {
            onClose();
          }, 3000);
        }}
      />
    </div>
  );
}

