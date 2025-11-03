export type Language = 'en' | 'fil';

type LocaleMap = Record<string, { en: string; fil: string }>; 

const translations: LocaleMap = {
  // Languages
  'lang.english': { en: 'English', fil: 'Ingles' },
  'lang.filipino': { en: 'Filipino', fil: 'Filipino' },
  'lang.select': { en: 'Language', fil: 'Wika' },

  // Navigation
  'nav.home': { en: 'Home', fil: 'Home' },
  'nav.about': { en: 'About', fil: 'Tungkol' },
  'nav.skills': { en: 'Skills', fil: 'Kasanayan' },
  'nav.projects': { en: 'Projects', fil: 'Mga Proyekto' },
  'nav.services': { en: 'Services', fil: 'Serbisyo' },
  'nav.reviews': { en: 'Client Reviews', fil: 'Mga Review ng Kliyente' },
  'nav.contact': { en: 'Contact', fil: 'Kontak' },

  // Hero
  'hero.role': { en: 'Full Stack Developer', fil: 'Full Stack Developer' },
  'hero.title.line1': { en: 'I Design & Build', fil: 'Nagdidisenyo at Gumagawa Ako' },
  'hero.title.line2': { en: 'Creative Digital Solutions', fil: 'Malikhain na Digital na Solusyon' },
  'cta.getInTouch': { en: 'Get In Touch', fil: 'Makipag-ugnayan' },
  'cta.viewResume': { en: 'View Resume', fil: 'Tingnan ang Resume' },

  // About
  'about.section': { en: 'About Me', fil: 'Tungkol sa Akin' },
  'about.heading.line1': { en: 'Crafting Digital', fil: 'Paglikha ng Digital' },
  'about.heading.line2': { en: 'Experiences', fil: 'na Karanasan' },
  'about.p1': {
    en: "I'm John Wayne Enrique, a passionate full-stack developer specializing in building exceptional digital experiences. With expertise in modern web technologies, I transform complex problems into elegant, user-friendly solutions.",
    fil: 'Ako si John Wayne Enrique, isang masigasig na full-stack developer na dalubhasa sa pagbuo ng natatanging digital na karanasan. Sa kaalaman sa makabagong web technologies, ginagawang simple at maganda ang mga komplikadong problema.'
  },
  'about.p2': {
    en: 'My approach combines clean code architecture with intuitive design principles. I thrive in collaborative environments and have experience working with agile teams, utilizing modern development workflows including CI/CD, version control, and project management methodologies.',
    fil: 'Pinagsasama ng aking pamamaraan ang malinis na arkitektura ng code at intuitibong disenyo. Umiigting ako sa kolaboratibong mga kapaligiran at may karanasan sa agile na mga koponan, gamit ang CI/CD, version control, at project management.'
  },
  'about.hireMe': { en: 'Hire Me', fil: 'Kunin Ako' },
  'about.downloadCV': { en: 'Download CV', fil: 'I-download ang CV' },

  // Skills
  'skills.section': { en: 'My Skills', fil: 'Aking mga Kasanayan' },
  'skills.heading1': { en: 'Technical', fil: 'Teknikal' },
  'skills.heading2': { en: 'Expertise', fil: 'Kahusayan' },
  'skills.tab.skills': { en: 'Skills', fil: 'Kasanayan' },
  'skills.tab.tools': { en: 'Tools', fil: 'Mga Kasangkapan' },

  // Portfolio
  'portfolio.section': { en: 'My Works', fil: 'Aking mga Gawa' },
  'portfolio.heading1': { en: 'Featured', fil: 'Tampok' },
  'portfolio.heading2': { en: 'Projects', fil: 'Mga Proyekto' },
  'portfolio.subtitle': { en: 'Delivering high-quality, scalable solutions with clean architecture and exceptional user experiences.', fil: 'Nagbibigay ng de-kalidad at nasusukat na solusyon na may malinis na arkitektura at mahusay na karanasan ng gumagamit.' },

  // Services
  'services.section': { en: 'What I Offer', fil: 'Ano ang Aking Inaalok' },
  'services.heading1': { en: 'Professional', fil: 'Propesyonal' },
  'services.heading2': { en: 'Services', fil: 'na Serbisyo' },
  'services.subtitle': { en: 'Comprehensive solutions tailored to your business needs with cutting-edge technology and best practices.', fil: 'Komprehensibong mga solusyon na angkop sa pangangailangan ng negosyo gamit ang makabagong teknolohiya at pinakamahusay na kasanayan.' },

  // Reviews
  'reviews.section': { en: 'Client Reviews', fil: 'Mga Review ng Kliyente' },
  'reviews.heading1': { en: 'What Clients', fil: 'Sinasabi ng mga Kliyente' },
  'reviews.heading2': { en: 'Say', fil: 'Tungkol sa Akin' },
  'reviews.subtitle': { en: 'Trusted by clients who value quality, professionalism, and results.', fil: 'Pinagkakatiwalaan ng mga kliyente na pinahahalagahan ang kalidad, propesyonalismo, at mga resulta.' },
  'reviews.howItWorks': { en: 'How Client Reviews Work', fil: 'Paano Gumagana ang Mga Review ng Kliyente' },
  'reviews.point1': { en: 'Reviews are requested at major milestones (MVP, launch, and post-launch).', fil: 'Humihingi ng review sa mga pangunahing yugto (MVP, paglulunsad, at pagkatapos ng paglulunsad).' },
  'reviews.point2': { en: 'Clients rate delivery, communication, and quality; quotes are published with permission.', fil: 'Sinusuri ng mga kliyente ang paghahatid, komunikasyon, at kalidad; inilalathala ang mga pahayag sa pahintulot.' },
  'reviews.point3': { en: 'We anonymize or attribute reviews based on client preference.', fil: 'Ina-anonymize o iniaakda ang mga review ayon sa kagustuhan ng kliyente.' },

  // Review form
  'reviewForm.title': { en: 'Share Your Experience', fil: 'Ibahagi ang Iyong Karanasan' },
  'reviewForm.leave': { en: 'Leave a Review', fil: 'Mag-iwan ng Review' },
  'reviewForm.cancel': { en: 'Cancel', fil: 'Kanselahin' },
  'reviewForm.name': { en: 'Your Name', fil: 'Iyong Pangalan' },
  'reviewForm.role': { en: 'Your Role', fil: 'Iyong Tungkulin' },
  'reviewForm.company': { en: 'Company', fil: 'Kumpanya' },
  'reviewForm.email': { en: 'Your Email (optional, for verification)', fil: 'Iyong Email (opsyonal, para sa beripikasyon)' },
  'reviewForm.rating': { en: 'Rating', fil: 'Rating' },
  'reviewForm.placeholder': { en: 'Write your review here...', fil: 'Isulat ang iyong review dito...' },
  'reviewForm.submit': { en: 'Submit Review', fil: 'Ipasa ang Review' },

  // CTA
  'cta.big.title': { en: 'Ready to Build Something Amazing?', fil: 'Handa ka na bang Lumikha ng Kamangha-mangha?' },
  'cta.big.subtitle': { en: "Let's discuss your project and turn your ideas into reality with innovative solutions.", fil: 'Talakayin natin ang iyong proyekto at gawing realidad ang iyong mga ideya gamit ang makabagong solusyon.' },
  'cta.getStarted': { en: 'Get Started', fil: 'Magsimula' },
  'cta.downloadResume': { en: 'Download Resume', fil: 'I-download ang Resume' },

  // Engagement
  'engagement.process': { en: 'Process', fil: 'Proseso' },
  'engagement.howWeWork': { en: 'How We Work', fil: 'Paano Kami Nagtatrabaho' },
  'engagement.step1': { en: '1. Discovery Call — Understand goals, scope, and timeline (15–30 mins).', fil: '1. Discovery Call — Unawain ang layunin, saklaw, at iskedyul (15–30 minuto).' },
  'engagement.step2': { en: '2. Proposal — Solution outline, milestones, and pricing.', fil: '2. Proposal — Balangkas ng solusyon, milestones, at pagpepresyo.' },
  'engagement.step3': { en: '3. Kickoff — Set up project plan, comms, and delivery cadence.', fil: '3. Kickoff — I-setup ang project plan, komunikasyon, at daloy ng paghahatid.' },
  'engagement.step4': { en: '4. Delivery & Support — Iterative releases, QA, handoff, and optional maintenance.', fil: '4. Delivery at Suporta — Sunod-sunod na releases, QA, handoff, at opsyonal na maintenance.' },
  'engagement.bookCall': { en: 'Book Discovery Call', fil: 'Mag-book ng Discovery Call' },
  'engagement.emailMe': { en: 'Email Me', fil: 'I-email Ako' },
  'engagement.title': { en: 'Ways to Work Together', fil: 'Paraan ng Pagtutulungan' },
  'engagement.fixed': { en: 'Fixed-Price', fil: 'Fixed-Price' },
  'engagement.hourly': { en: 'Hourly', fil: 'Hourly' },
  'engagement.retainer': { en: 'Retainer', fil: 'Retainer' },
  'engagement.consulting': { en: 'Consulting', fil: 'Consulting' },

  // Interactive Engagement
  'contact.getInTouch': { en: 'Get In Touch', fil: 'Makipag-ugnayan' },
  'contact.letsConnect': { en: "Let's Connect", fil: 'Magkonekta Tayo' },
  'contact.chooseBest': { en: "Choose the best way to reach out. I'm here to help bring your ideas to life.", fil: 'Pumili ng pinakamahusay na paraan upang makipag-ugnayan. Narito ako upang tulungan kang buhayin ang iyong mga ideya.' },
  'contact.sendMessage': { en: 'Send Message', fil: 'Magpadala ng Mensahe' },
  'contact.openForm': { en: 'Open Form', fil: 'Buksan ang Form' },
  'contact.emailDirectly': { en: 'Email Directly', fil: 'Direktang Email' },
  'contact.sendEmail': { en: 'Send Email', fil: 'Magpadala ng Email' },
  'contact.scheduleCall': { en: 'Schedule a Call', fil: 'Mag-iskedyul ng Tawag' },
  'contact.bookNow': { en: 'Book Now', fil: 'Mag-book Ngayon' },
  'contact.quickConsult': { en: 'Quick Consultation', fil: 'Mabilis na Konsultasyon' },
  'contact.request': { en: 'Request', fil: 'Humiling' },
  'contact.connectOnSocial': { en: 'Connect on Social Media', fil: 'Kumonekta sa Social Media' },

  // Footer
  'footer.quickLinks': { en: 'Quick Links', fil: 'Mabilis na Mga Link' },
  'footer.portfolio': { en: 'Portfolio', fil: 'Portfolio' },
  'footer.services': { en: 'Services & Reviews', fil: 'Serbisyo at Review' },
  'footer.connect': { en: 'Connect', fil: 'Kumonekta' },
  'footer.rights': { en: 'All rights reserved', fil: 'Lahat ng karapatan ay nakalaan' },
};

export function t(language: Language, key: string): string {
  const entry = translations[key];
  if (!entry) return key;
  return language === 'fil' ? entry.fil : entry.en;
}


