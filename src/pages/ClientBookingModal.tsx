import { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Calendar, DollarSign, Clock, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme/useTheme';
import { submitBooking } from '../services/bookingService';
import ResendServiceUnavailableModal from '../components/ResendServiceUnavailableModal';

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    projectDescription: '',
    timeline: '',
    budget: '',
    preferredContact: 'email',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [showEmailUnavailableModal, setShowEmailUnavailableModal] = useState(false);
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
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        projectDescription: '',
        timeline: '',
        budget: '',
        preferredContact: 'email',
        preferredDate: '',
        preferredTime: '',
        additionalNotes: ''
      });
      setStatusText('');
      setStatusType('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusType('');
    setStatusText('');

    const result = await submitBooking(formData);
    setStatusType(result.type);
    setStatusText(result.message);
    setIsSubmitting(false);

    if (result.type === 'success') {
      // Check if email was sent successfully
      if (result.emailSent === false) {
        setShowEmailUnavailableModal(true);
      }
      // Reset form after successful submission
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
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
        className={`relative max-w-4xl w-full max-h-[90vh] ${bgCard} border ${borderBase} rounded-2xl shadow-2xl overflow-hidden focus:outline-none ${focusRing}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 sm:px-8 py-4 sm:py-6 border-b ${borderBase} flex items-center justify-between bg-inherit backdrop-blur-sm`}>
          <div>
            <h2 id="booking-title" className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
              Client Booking
            </h2>
            <p className={`${textSecondary} text-sm mt-1`}>Book a development project consultation</p>
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
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${textPrimary} flex items-center gap-2`}>
                <User size={20} className="text-orange-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Full Name *</label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
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
                      placeholder="Enter your phone number"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                      value={formData.phone}
                      onChange={handleChange}
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
                  <div className="relative">
                    <FileText className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <select
                      name="projectType"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none`}
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select project type</option>
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile Application</option>
                      <option value="e-commerce">E-Commerce Platform</option>
                      <option value="landing-page">Landing Page</option>
                      <option value="api-development">API Development</option>
                      <option value="database-design">Database Design</option>
                      <option value="ui-ux-design">UI/UX Design</option>
                      <option value="full-stack">Full-Stack Development</option>
                      <option value="maintenance">Maintenance & Support</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Timeline *</label>
                  <div className="relative">
                    <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <select
                      name="timeline"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none`}
                      value={formData.timeline}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP / Urgent</option>
                      <option value="1-month">1 Month</option>
                      <option value="2-3-months">2-3 Months</option>
                      <option value="3-6-months">3-6 Months</option>
                      <option value="6-months-plus">6+ Months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
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
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <select
                      name="budget"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none`}
                      value={formData.budget}
                      onChange={handleChange}
                    >
                      <option value="">Select budget range</option>
                      <option value="under-1k">Under $1,000</option>
                      <option value="1k-5k">$1,000 - $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-plus">$50,000+</option>
                      <option value="discuss">Prefer to discuss</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textSecondary}`}>Preferred Contact Method *</label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                    <select
                      name="preferredContact"
                      className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none`}
                      value={formData.preferredContact}
                      onChange={handleChange}
                      required
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                      <option value="video">Video Call</option>
                      <option value="meeting">In-Person Meeting</option>
                    </select>
                  </div>
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
              <div className={`${statusType === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'} border rounded-xl p-4 flex items-start gap-3`}>
                {statusType === 'success' ? (
                  <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <X size={20} className="flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium">{statusText}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3 border ${borderBase} hover:border-orange-500 ${textPrimary} font-semibold rounded-xl transition-colors ${focusRing}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50 disabled:opacity-60 disabled:cursor-not-allowed ${focusRing}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Service Unavailable Modal */}
      <ResendServiceUnavailableModal
        isOpen={showEmailUnavailableModal}
        onClose={() => setShowEmailUnavailableModal(false)}
      />
    </div>
  );
}

