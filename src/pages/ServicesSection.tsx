import { t, type Language } from '../i18n/translations';
import { Code, Smartphone, Database, Layout, Zap, Shield, CheckCircle } from 'lucide-react';

type Props = {
  language: Language;
  visibleSections: Set<string>;
  textPrimary: string;
  textSecondary: string;
  bgSkillsSection: string;
  bgCard: string;
  borderBase: string;
};

export default function ServicesSection({
  language,
  visibleSections,
  textPrimary,
  textSecondary,
  bgSkillsSection,
  bgCard,
  borderBase,
}: Props) {
  const services = [ 
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom web applications built with modern frameworks, ensuring scalability, performance, and exceptional user experience.',
      features: ['Responsive Design', 'API Integration', 'Performance Optimization']
    },
    {
      icon: Smartphone,
      title: 'Mobile Solutions',
      description: 'Cross-platform mobile applications developed with React Native and Flutter for iOS and Android.',
      features: ['Cross-platform', 'Native Performance', 'App Store Deployment']
    },
    {
      icon: Database,
      title: 'Backend Development',
      description: 'Robust server-side solutions with RESTful APIs, database design, and cloud infrastructure setup.',
      features: ['API Development', 'Database Design', 'Cloud Integration']
    },
    {
      icon: Layout,
      title: 'UI/UX Design',
      description: 'User-centered design that combines aesthetics with functionality to create intuitive interfaces.',
      features: ['User Research', 'Wireframing', 'Prototyping']
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Speed and efficiency improvements to enhance user experience and reduce operational costs.',
      features: ['Code Optimization', 'Load Time Reduction', 'SEO Enhancement']
    },
    {
      icon: Shield,
      title: 'Security & Maintenance',
      description: 'Comprehensive security audits, bug fixes, and ongoing maintenance to keep your applications secure.',
      features: ['Security Audits', 'Bug Fixes', 'Regular Updates']
    }
  ];

  return (
    <section id="services" className={`pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 ${bgSkillsSection} ${visibleSections.has('services') ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-10 sm:mb-12 lg:mb-16 ${visibleSections.has('services') ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-block mb-4">
            <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'services.section')}</span>
            <div className="h-0.5 w-10 bg-orange-500 mt-2 mx-auto"></div>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>
            {t(language, 'services.heading1')} <span className="text-orange-500">{t(language, 'services.heading2')}</span>
          </h2>
          <p className={`${textSecondary} text-sm sm:text-base max-w-2xl mx-auto px-4 sm:px-0`}>
            {t(language, 'services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${bgCard} rounded-lg p-6 border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1 ${visibleSections.has('services') ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                <service.icon className="text-orange-500" size={24} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{service.title}</h3>
              <p className={`${textSecondary} text-sm mb-4 leading-relaxed`}>{service.description}</p>
              <ul className="space-y-1">
                {service.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-2 ${textSecondary} text-sm`}>
                    <CheckCircle className="text-orange-500" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


