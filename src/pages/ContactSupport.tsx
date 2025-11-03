import { MapPin, Phone, Mail, User, MessageSquare, Facebook, Twitter, Linkedin, Youtube, HelpCircle } from 'lucide-react';
import { useTheme } from '../theme/useTheme';
import { useState } from 'react';
import { sendContactMessage } from '../services/contactService';

export default function ContactSupport() {
  const { theme } = useTheme();
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgSection = theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-900/50' : 'bg-white';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusType('');
    setStatusText('');
    const result = await sendContactMessage({
      full_name: fullName,
      email,
      subject,
      message,
      phone,
    });
    setStatusType(result.type);
    setStatusText(result.message);
    setIsSubmitting(false);
    if (result.type === 'success') {
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setPhone('');
    }
  };

  return (
    <section id="contact" className={`min-h-screen py-16 sm:py-24 lg:py-32 ${bgSection}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          <div>
            <div className="inline-block mb-3 sm:mb-4">
              <span className={`text-xs sm:text-sm font-semibold tracking-wider uppercase ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Contact</span>
              <div className="h-0.5 w-10 sm:w-12 bg-orange-500 mt-2"></div>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight ${textPrimary}`}>
              Let's Work
              <br />
              <span className="text-orange-500">Together</span>
            </h2>
            <p className={`${textSecondary} mb-8 sm:mb-12 leading-relaxed text-base sm:text-lg`}>
              Have a project in mind? Let's discuss how I can help bring your ideas to life with clean, efficient code and exceptional design.
            </p>

            <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
              <div className="flex items-start space-x-4 sm:space-x-5 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className={`font-semibold mb-1 sm:mb-2 text-base sm:text-lg ${textPrimary}`}>Address</div>
                  <div className={`${textSecondary} text-sm sm:text-base leading-relaxed`}>Zone 5, Seselangen, Sual,<br />Pangasinan, Philippines</div>
                </div>
              </div>

              <div className="flex items-start space-x-4 sm:space-x-5 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone size={18} />
                </div>
                <div>
                  <div className={`font-semibold mb-1 sm:mb-2 text-base sm:text-lg ${textPrimary}`}>Phone</div>
                  <div className={`${textSecondary} text-sm sm:text-base`}>(+63) 905 228 1368</div>
                  <div className={`${textSecondary} text-sm sm:text-base`}>(+63) 915 736 6455</div>
                </div>
              </div>

              <div className="flex items-start space-x-4 sm:space-x-5 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail size={18} />
                </div>
                <div>
                  <div className={`font-semibold mb-1 sm:mb-2 text-base sm:text-lg ${textPrimary}`}>Email</div>
                  <div className={`${textSecondary} text-sm sm:text-base`}>enriquejohnwayne@gmail.com</div>
                  <div className={`${textSecondary} text-sm sm:text-base`}>joma.enrique.up@phinmaed.com</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <a href="#" className={`w-10 h-10 sm:w-12 sm:h-12 ${bgCard} border ${borderBase} rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300`}>
                <Facebook size={18} className={`${textPrimary}`} />
              </a>
              <a href="#" className={`w-10 h-10 sm:w-12 sm:h-12 ${bgCard} border ${borderBase} rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300`}>
                <Twitter size={18} className={`${textPrimary}`} />
              </a>
              <a href="#" className={`w-10 h-10 sm:w-12 sm:h-12 ${bgCard} border ${borderBase} rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300`}>
                <Linkedin size={18} className={`${textPrimary}`} />
              </a>
              <a href="#" className={`w-10 h-10 sm:w-12 sm:h-12 ${bgCard} border ${borderBase} rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300`}>
                <Youtube size={18} className={`${textPrimary}`} />
              </a>
            </div>
          </div>

          <div className={`${bgCard} rounded-2xl p-4 sm:p-6 lg:p-8 border ${borderBase}`}>
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className={`block text-sm font-semibold mb-2 sm:mb-3 ${textSecondary}`}>Full Name</label>
                <div className="relative">
                  <User className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 sm:mb-3 ${textSecondary}`}>Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 sm:mb-3 ${textSecondary}`}>Phone Number</label>
                <div className="relative">
                  <Phone className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 sm:mb-3 ${textSecondary}`}>Subject</label>
                <div className="relative">
                  <HelpCircle className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
                  <input
                    type="text"
                    placeholder="Enter your subject"
                    className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 sm:mb-3 ${textSecondary}`}>Message</label>
                <div className="relative">
                  <MessageSquare className={`absolute left-3 sm:left-4 top-4 sm:top-5 ${textSecondary}`} size={18} />
                  <textarea
                    placeholder="Enter your message..."
                    rows={5}
                    className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl pl-10 sm:pl-12 pr-4 pt-3 sm:pt-4 pb-3 sm:pb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              {statusText && (
                <div className={`${statusType === 'success' ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
                  {statusText}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base`}
              >
                {isSubmitting ? 'Sending...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}


