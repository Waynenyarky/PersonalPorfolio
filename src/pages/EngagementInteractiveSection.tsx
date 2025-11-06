import { t, type Language } from '../i18n/translations';
import { MessageSquare, Mail, Calendar, Github, Facebook, Twitter, Linkedin } from 'lucide-react';

type Method = {
  icon: any;
  title: string;
  description: string;
  buttonText: string;
  color: string;
  action: () => void;
};

type Props = {
  language: Language;
  visibleSections: Set<string>;
  textPrimary: string;
  textSecondary: string;
  bgSkillsSection: string;
  bgPage: string;
  bgCard: string;
  borderBase: string;
  scrollToSection: (id: string) => void;
  isDark: boolean;
  onOpenBooking: () => void;
};

export default function EngagementInteractiveSection({
  language,
  visibleSections,
  textPrimary,
  textSecondary,
  bgSkillsSection,
  bgPage: _bgPage,
  bgCard,
  borderBase,
  scrollToSection,
  isDark,
  onOpenBooking,
}: Props) {
  const methods: Method[] = [
    {
      icon: MessageSquare,
      title: t(language, 'contact.sendMessage'),
      description: 'Fill out the contact form below for project inquiries or questions.',
      action: () => scrollToSection('contact'),
      buttonText: t(language, 'contact.openForm'),
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Mail,
      title: t(language, 'contact.emailDirectly'),
      description: 'Reach out via email for a more detailed discussion about your project.',
      action: () => window.open('mailto:joma.enrique.up@phinmaed.com?subject=Project Inquiry', '_blank'),
      buttonText: t(language, 'contact.sendEmail'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Calendar,
      title: 'Client Booking',
      description: 'Book a session to discuss your project timeline, scope, and goals.',
      action: onOpenBooking,
      buttonText: 'Book Now',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Github,
      title: 'GitHub',
      description: 'Browse my repositories, projects, and code samples.',
      action: () => window.open('https://github.com/Waynenyarky', '_blank'),
      buttonText: 'View Profile',
      color: 'from-gray-800 to-gray-900',
    },
  ];

  return (
    <section className={`pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 ${bgSkillsSection} ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-8 sm:mb-10 lg:mb-12 ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-block mb-4">
            <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'contact.getInTouch')}</span>
            <div className="h-0.5 w-10 bg-orange-500 mt-2 mx-auto"></div>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>
            {t(language, 'contact.letsConnect')}
          </h2>
          <p className={`${textSecondary} text-sm sm:text-base max-w-2xl mx-auto px-4 sm:px-0`}>
            {t(language, 'contact.chooseBest')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {methods.map((method, index) => (
            <div
              key={index}
              className={`${bgCard} border ${borderBase} rounded-xl p-5 sm:p-6 transition-all duration-300 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1 ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'} h-full flex flex-col`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 shrink-0 bg-linear-to-br ${method.color} rounded-lg flex items-center justify-center`}>
                  <method.icon className="text-white" size={22} />
                </div>
                <div>
                  <h3 className={`text-base sm:text-lg font-bold ${textPrimary}`}>{method.title}</h3>
                  <p className={`${textSecondary} text-xs sm:text-sm mt-1 leading-relaxed`}>{method.description}</p>
                </div>
              </div>
              <div className="mt-auto pt-3">
                <button onClick={method.action} className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 text-sm">
                  {method.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={`${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6 ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center ${textPrimary}`}>{t(language, 'contact.connectOnSocial')}</h3>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="https://web.facebook.com/jowne.enrique.11" target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}>
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Facebook className="text-blue-500" size={24} />
              </div>
              <span className="text-xs font-medium">Facebook</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}>
              <div className="w-14 h-14 bg-sky-500/10 rounded-full flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                <Twitter className="text-sky-500" size={24} />
              </div>
              <span className="text-xs font-medium">Twitter</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}>
              <div className="w-14 h-14 bg-blue-600/10 rounded-full flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                <Linkedin className="text-blue-600" size={24} />
              </div>
              <span className="text-xs font-medium">LinkedIn</span>
            </a>
            <a href="https://github.com/Waynenyarky" target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e5e5' }}>
                <Github size={24} color={isDark ? '#ffffff' : '#000000'} stroke={isDark ? '#ffffff' : '#000000'} />
              </div>
              <span className="text-xs font-medium">GitHub</span>
            </a>
            <a href="mailto:joma.enrique.up@phinmaed.com" className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}>
              <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <Mail className="text-orange-500" size={24} />
              </div>
              <span className="text-xs font-medium">Email</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


