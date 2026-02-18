import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import './portfolio.css';
import { Facebook, Twitter, Linkedin, Github, MessageSquare, ChevronDown, Award, CheckCircle, Users, Code, GitBranch, ArrowUp, Terminal, Package, FileCode, Figma, Paintbrush, Palette, Database, Server, Smartphone, Layout, Box, Menu, X } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
const ProjectModal = lazy(() => import('../components/ProjectModal'));
const ResumeModal = lazy(() => import('../components/ResumeModal'));
import { useTheme } from '../theme/useTheme';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import CTAButtons from '../components/CTAButtons';
const ClientReviews = lazy(() => import('./ClientReviews'));
import { t, type Language } from '../i18n/translations';
import ContactSupport from './ContactSupport';
import SiteFooter from './SiteFooter';
import EngagementInteractiveSection from './EngagementInteractiveSection';
import CTASection from './CTASection';
import ClientBookingModal from './ClientBookingModal';
import EngagementSection from './EngagementSection';
import ProfessionalDropdown from '../components/ProfessionalDropdown';
import IntroOverlay from '../components/IntroOverlay';
import ServicesSection from './ServicesSection';
import formalImg from '../assets/formal.png';
import myCv from '../assets/MyCV.pdf';
import PortfolioSection from './PortfolioSection';
import type { Project } from '../types/project';

const Portfolio = () => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'skills' | 'tools'>('skills');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['home']));
  const [activeSection, setActiveSection] = useState<string>('home');
  const [animatingSection, setAnimatingSection] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [happyClientsExtra, setHappyClientsExtra] = useState<number>(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterTech, setFilterTech] = useState<string>('');

  const [showIntro, setShowIntro] = useState(true);
  const [mainRevealed, setMainRevealed] = useState(false);

  const handleRevealMain = () => setMainRevealed(true);
  const handleIntroClose = () => setShowIntro(false);
  
  // Ref to track programmatic scrolling to prevent conflicts
  const isScrollingRef = useRef(false);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cookie helpers for persisting Happy Clients extra count
  const setCookie = (name: string, value: string, days: number) => {
    try {
      const d = new Date();
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = `expires=${d.toUTCString()}`;
      document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
    } catch {}
  };
  const getCookie = (name: string): string | null => {
    try {
      const cname = `${name}=`;
      const parts = document.cookie.split(';');
      for (let c of parts) {
        c = c.trim();
        if (c.indexOf(cname) === 0) return decodeURIComponent(c.substring(cname.length));
      }
    } catch {}
    return null;
  };

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      const nearBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 60;
      setAtBottom(nearBottom);

      // Don't update activeSection during programmatic scroll
      if (isScrollingRef.current) return;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Update active section based on scroll position - no delay
          const sections = ['home', 'about', 'skills', 'portfolio', 'services', 'reviews', 'contact'];
          const current = sections.find(section => {
            const el = document.getElementById(section);
            if (el) {
              const rect = el.getBoundingClientRect();
              // Check if section is in viewport with proper offset for header
              return rect.top <= 120 && rect.bottom >= 120;
            }
            return false;
          });
          if (current && !isScrollingRef.current) {
            setActiveSection(current);
            setAnimatingSection(null);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check on mount
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Cleanup any pending highlight animations
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  // Listen for client-side review submissions (rating >= 3) to bump Happy Clients (no storage/server)
  useEffect(() => {
    // Initialize from cookie on mount
    try {
      const stored = getCookie('happyClientsExtra');
      if (stored) {
        const n = parseInt(stored, 10);
        if (!Number.isNaN(n) && n >= 0) setHappyClientsExtra(n);
      }
    } catch {}

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('reviews');
      bc.onmessage = (evt: MessageEvent) => {
        const msg = evt.data as { type?: string; rating?: number };
        if (msg?.type === 'submitted' && typeof msg.rating === 'number' && msg.rating >= 3) {
          setHappyClientsExtra((prev) => {
            const next = prev + 1;
            setCookie('happyClientsExtra', String(next), 90);
            return next;
          });
        }
      };
    } catch {}
    return () => { try { bc?.close(); } catch {} };
  }, []);

  

  

  // Sync filters with URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') || '';
    const tech = params.get('tech') || '';
    setFilterCategory(cat);
    setFilterTech(tech);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (filterCategory) params.set('category', filterCategory); else params.delete('category');
    if (filterTech) params.set('tech', filterTech); else params.delete('tech');
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', next);
  }, [filterCategory, filterTech]);


  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set([...prev, entry.target.id]));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['about', 'skills', 'portfolio', 'services', 'engagement', 'reviews', 'contact', 'cta'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

   const tools = [
     { name: 'Git', icon: GitBranch, color: 'from-orange-500 to-orange-600' },
     { name: 'npm', icon: Package, color: 'from-red-500 to-red-600' },
     { name: 'Command Line', icon: Terminal, color: 'from-slate-600 to-slate-700' },
     { name: 'VS Code', icon: FileCode, color: 'from-blue-500 to-blue-600' },
     { name: 'Slack', icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
     { name: 'Photoshop', icon: Paintbrush, color: 'from-indigo-500 to-indigo-600' },
     { name: 'Figma', icon: Figma, color: 'from-pink-500 to-pink-600' },
   ];

   const skills = [
     { name: 'HTML5', icon: Code, color: 'from-orange-500 to-orange-600' },
     { name: 'CSS3', icon: Palette, color: 'from-blue-500 to-blue-600' },
     { name: 'JavaScript', icon: Code, color: 'from-yellow-400 to-yellow-500' },
     { name: 'TypeScript', icon: Code, color: 'from-blue-600 to-blue-700' },
     { name: 'React', icon: Box, color: 'from-cyan-400 to-cyan-600' },
     { name: 'Python', icon: Code, color: 'from-yellow-500 to-yellow-600' },
     { name: 'Flutter', icon: Smartphone, color: 'from-cyan-500 to-cyan-600' },
     { name: 'Kotlin', icon: Code, color: 'from-purple-600 to-purple-700' },
     { name: 'Node.js', icon: Server, color: 'from-green-600 to-green-700' },
     { name: 'Database', icon: Database, color: 'from-purple-500 to-purple-600' },
     { name: 'Responsive', icon: Smartphone, color: 'from-pink-500 to-pink-600' },
     { name: 'UI/UX', icon: Layout, color: 'from-indigo-500 to-indigo-600' },
   ];
  

  const baseHappyClients = 2;
  const currentHappyClients = baseHappyClients + happyClientsExtra;

  const stats = [
    { icon: Award, value: '3+', label: 'Years of Experience', color: 'text-orange-500' },
    { icon: CheckCircle, value: '6+', label: 'Completed Projects', color: 'text-green-500' },
    { icon: Users, value: `${currentHappyClients}+`, label: 'Happy Clients', color: 'text-blue-500' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      
      // Clear any pending highlight animations
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
        highlightTimeoutRef.current = null;
      }
      
      // Mark that we're programmatically scrolling
      isScrollingRef.current = true;
      
      // Sequential highlight animation from current to target
      const navOrder = ['home', 'about', 'skills', 'portfolio', 'services', 'reviews', 'contact'];
      const currentIndex = navOrder.indexOf(activeSection);
      const targetIndex = navOrder.indexOf(sectionId);

      if (currentIndex !== -1 && targetIndex !== -1 && currentIndex !== targetIndex) {
        const direction = targetIndex > currentIndex ? 1 : -1;
        let index = currentIndex;
        const stepDuration = 150; // 150ms per item

        const step = () => {
          index += direction;
          const inBounds = index >= 0 && index < navOrder.length;
          const reached = direction > 0 ? index >= targetIndex : index <= targetIndex;
          if (inBounds && !reached) {
            setAnimatingSection(navOrder[index]);
            highlightTimeoutRef.current = setTimeout(() => {
              requestAnimationFrame(step);
            }, stepDuration);
          } else {
            setActiveSection(sectionId);
            setAnimatingSection(null);
            highlightTimeoutRef.current = null;
          }
        };

        // Start on next frame for smoothness
        requestAnimationFrame(() => requestAnimationFrame(step));
      } else {
        setActiveSection(sectionId);
        setAnimatingSection(null);
      }

      // Smooth scroll using native behavior
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Cleanup after scroll completes (fallback timeout)
      setTimeout(() => { isScrollingRef.current = false; }, 1000);
    }
  };

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const navText = theme === 'dark' ? 'text-white' : 'text-black';
  const bgPage = theme === 'dark' ? 'bg-gray-950' : 'bg-white';
  const bgSection = theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
  const bgSkillsSection = theme === 'dark' ? 'bg-gray-950' : 'bg-white';
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const navBg = !scrolled ? 'bg-transparent' : atBottom
    ? (theme === 'dark' ? 'bg-gray-900' : 'bg-white')
    : (theme === 'dark' ? 'bg-gray-900/98' : 'bg-white/95');
  const inputBg = theme === 'dark' ? 'bg-gray-900/50' : 'bg-white';
  

  const navItems: { labelKey: string; id: string }[] = [
    { labelKey: 'nav.home', id: 'home' },
    { labelKey: 'nav.about', id: 'about' },
    { labelKey: 'nav.skills', id: 'skills' },
    { labelKey: 'nav.projects', id: 'portfolio' },
    { labelKey: 'nav.services', id: 'services' },
    { labelKey: 'nav.reviews', id: 'reviews' },
    { labelKey: 'nav.contact', id: 'contact' },
  ];

  return (
    <>
      {showIntro && (
        <IntroOverlay
          language={language}
          onRevealMain={handleRevealMain}
          onClose={handleIntroClose}
        />
      )}
      {/* Top bar: outside main-reveal so it’s clearly visible after intro */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 nav-bar-reveal ${
          mainRevealed ? 'nav-bar-reveal--visible' : 'nav-bar-reveal--hidden'
        } ${navBg} ${scrolled ? 'backdrop-blur-xl shadow-md border-b ' + borderBase : 'backdrop-blur-sm'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              className={`group ${navText} text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 hover:scale-105`}
              aria-label="Go to Home"
              onClick={() => scrollToSection('home')}
            >
              <span className="relative">
                Wayne<span className="text-orange-500 transition-all duration-300 group-hover:scale-110 inline-block">.</span>
              </span>
            </button>
            
            <div className="hidden md:flex space-x-6 lg:space-x-8">
              {navItems.map(({ labelKey, id }) => {
                const isActive = activeSection === id;
                const isAnimating = animatingSection === id;
                const showHighlight = isActive || isAnimating;
                return (
                  <a
                    key={labelKey}
                    href={`#${id}`}
                    className={`group relative text-sm font-semibold transition-all duration-300 ease-in-out ${
                      showHighlight ? 'text-orange-500' : navText + ' hover:text-orange-500'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                      setMobileOpen(false);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Go to ${t(language, labelKey)}`}
                  >
                    {t(language, labelKey)}
                    <span className={`absolute -bottom-1.5 left-0 h-0.5 bg-orange-500 transition-all duration-300 ease-in-out ${
                      showHighlight ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}></span>
                    {showHighlight && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-orange-500/30 blur-sm transition-opacity duration-300 ease-in-out"></span>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Desktop utilities */}
            <div className="hidden md:flex items-center space-x-3">
              <ProfessionalDropdown
                value={language}
                onChange={(val) => setLanguage(val as Language)}
                options={[
                  { value: 'en', label: t(language, 'lang.english') },
                  { value: 'fil', label: t(language, 'lang.filipino') },
                ]}
                className="min-w-[120px]"
                inputBg={inputBg}
                borderBase={borderBase}
                textPrimary={textPrimary}
                textSecondary={textSecondary}
                aria-label={t(language, 'lang.select')}
              />
              <ThemeToggle className="w-9 h-9 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110" size={18} />
            </div>

            {/* Mobile menu button */}
            <button
              className={`md:hidden group w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className={theme === 'dark' ? 'text-white' : 'text-black'} size={22} />
              ) : (
                <Menu className={theme === 'dark' ? 'text-white' : 'text-black'} size={22} />
              )}
            </button>
          </div>
        </div>
        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className={`md:hidden ${bgCard} border-t ${borderBase} animate-fade-in-up`}>
            <div className="px-6 pb-6 space-y-4">
              <div className="pt-2 grid grid-cols-1 gap-2">
                {navItems.map(({ labelKey, id }) => {
                  const isActive = activeSection === id;
                  const isAnimating = animatingSection === id;
                  const showHighlight = isActive || isAnimating;
                  return (
                    <a
                      key={labelKey}
                      href={`#${id}`}
                      className={`relative block py-2.5 px-3 text-sm font-semibold tracking-wide transition-all duration-300 ease-in-out rounded-lg ${
                        showHighlight ? 'text-orange-500 bg-orange-500/10' : navText + ' hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-500'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(id);
                        setMobileOpen(false);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={`Go to ${t(language, labelKey)}`}
                    >
                      {t(language, labelKey)}
                      {showHighlight && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r transition-all duration-300 ease-in-out"></span>
                      )}
                    </a>
                  );
                })}
              </div>
              <div className={`flex items-center justify-between pt-4 border-t ${borderBase}`}>
                <ProfessionalDropdown
                  value={language}
                  onChange={(val) => setLanguage(val as Language)}
                  options={[
                    { value: 'en', label: t(language, 'lang.english') },
                    { value: 'fil', label: t(language, 'lang.filipino') },
                  ]}
                  className="flex-1"
                  inputBg={inputBg}
                  borderBase={borderBase}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  aria-label={t(language, 'lang.select')}
                />
                <ThemeToggle size={20} />
              </div>
            </div>
          </div>
        )}
      </nav>
      <div
        className={`min-h-screen ${bgPage} main-reveal-wrapper ${
          mainRevealed ? 'main-reveal-wrapper--visible main-reveal' : 'main-reveal-wrapper--hidden'
        }`}
      >
      {/* Hero Section */}
      <section id="home" className={`min-h-screen flex items-center justify-center relative pt-10 sm:pt-12 overflow-hidden ${bgSection}`}>
        {/* Subtle Background Effects with Animation */}
        <div className="absolute inset-0 bg-linear-to-b from-orange-500/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow hero-blob-delay-1s"></div>
        
        {/* Professional Social Media Links with Staggered Animations - Left Rail (Hero only with smooth fade) */}
        <div
          className={`fixed left-2 sm:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-2 sm:space-y-3 z-20 pointer-events-none transition-all duration-700 ease-out ${activeSection === 'home' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}
        >
          <a 
            href="https://web.facebook.com/jowne.enrique.11" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Facebook" 
            className={`pointer-events-auto group ${bgCard} border ${borderBase} rounded-lg p-2 sm:p-2.5 transition-all duration-300 hover:border-orange-500 hover:shadow-md will-change-transform opacity-0 animate-fade-in-left`}
            >
            <Facebook size={18} className={`${textSecondary} group-hover:text-orange-500 transition-colors duration-300 animate-wave-float`} />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Twitter" 
            className={`pointer-events-auto group ${bgCard} border ${borderBase} rounded-lg p-2 sm:p-2.5 transition-all duration-300 hover:border-orange-500 hover:shadow-md will-change-transform opacity-0 animate-fade-in-left`}
            >
            <Twitter size={18} className={`${textSecondary} group-hover:text-orange-500 transition-colors duration-300 animate-wave-float`} />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="LinkedIn" 
            className={`pointer-events-auto group ${bgCard} border ${borderBase} rounded-lg p-2 sm:p-2.5 transition-all duration-300 hover:border-orange-500 hover:shadow-md will-change-transform opacity-0 animate-fade-in-left`}
            >
            <Linkedin size={18} className={`${textSecondary} group-hover:text-orange-500 transition-colors duration-300 animate-wave-float`} />
          </a>
          <a 
            href="https://github.com/Waynenyarky" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="GitHub" 
            className={`pointer-events-auto group ${bgCard} border ${borderBase} rounded-lg p-2 sm:p-2.5 transition-all duration-300 hover:border-orange-500 hover:shadow-md will-change-transform opacity-0 animate-fade-in-left`}
            >
            <Github size={18} className={`${textSecondary} group-hover:text-orange-500 transition-colors duration-300 animate-wave-float`} />
          </a>
          <div className="w-px h-12 sm:h-16 bg-gray-300 dark:bg-gray-700 opacity-0 animate-fade-in-left"></div>
        </div>

        {/* Hero Content — staggered reveal when main is visible (intro done or direct load) */}
        <div className="text-center px-4 sm:px-6 z-10 max-w-4xl mx-auto">
          <div className="hero-reveal-item hero-reveal-delay-1 mb-4 sm:mb-5 inline-block">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${borderBase} bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md`}>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className={`${textSecondary} text-xs sm:text-sm font-semibold tracking-wider uppercase`}>{t(language, 'hero.role')}</span>
            </div>
          </div>
          
          <h1 className={`hero-reveal-item hero-reveal-delay-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-5 tracking-tight leading-tight ${textPrimary}`}>
            <span className="inline-block transition-all duration-300 hover:scale-105">John Wayne</span>
            <br />
            <span className="text-orange-500 inline-block relative transition-all duration-300 hover:scale-105">
              Enrique
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-transparent via-orange-500/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </span>
          </h1>
          
          <h2 className={`hero-reveal-item hero-reveal-delay-3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mb-2 sm:mb-3 ${textSecondary}`}>
            {t(language, 'hero.title.line1')}
          </h2>
          <h2 className={`hero-reveal-item hero-reveal-delay-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mb-8 sm:mb-10 ${textSecondary}`}>
            {t(language, 'hero.title.line2')}
          </h2>
          
          <div className="hero-reveal-item hero-reveal-delay-5">
            <CTAButtons
              onPrimary={() => scrollToSection('contact')}
              onSecondary={() => setShowResumeModal(true)}
              primaryText={t(language, 'cta.getInTouch')}
              secondaryText={t(language, 'cta.viewResume')}
              borderBaseClass={borderBase}
              textPrimaryClass={textPrimary}
            />
          </div>
        </div>

        {/* Scroll Indicator with Animation - Right Rail (Hero only with smooth fade) */}
        <div
          className={`fixed right-2 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-all duration-700 ease-out ${activeSection === 'home' ? 'opacity-100 translate-x-0 animate-fade-in-right' : 'opacity-0 translate-x-3'}`}
        >
          <div className={`writing-vertical text-xs tracking-wider ${textSecondary} font-medium mb-3 sm:mb-4`}>
            SCROLL
          </div>
          <div className="relative w-px h-24 bg-gray-300 dark:bg-gray-700 overflow-hidden">
            <span className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 animate-wave-dot"></span>
          </div>
          <ChevronDown className="text-orange-500 mt-2 sm:mt-3 animate-wave-float" size={20} />
        </div>
      </section>

      {/* About Section */}
      <AboutSection
        language={language}
        visibleSections={visibleSections}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        bgSection={bgSection}
        bgCard={bgCard}
        borderBase={borderBase}
        stats={stats}
        formalImg={formalImg}
        myCv={myCv}
        scrollToSection={scrollToSection}
      />

      {/* Skills Section */}
      <SkillsSection
        language={language}
        visibleSections={visibleSections}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        bgSkillsSection={bgSkillsSection}
        bgCard={bgCard}
        borderBase={borderBase}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        skills={skills}
        tools={tools}
      />

      {/* Portfolio Section */}
      <PortfolioSection
        language={language}
        visibleSections={visibleSections}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        bgSection={bgSection}
        bgCard={bgCard}
        borderBase={borderBase}
        inputBg={inputBg}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterTech={filterTech}
        setFilterTech={setFilterTech}
        onSelectProject={setSelectedProject}
      />

      {/* Services Section */}
      <ServicesSection
        language={language}
        visibleSections={visibleSections}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        bgSkillsSection={bgSkillsSection}
        bgCard={bgCard}
        borderBase={borderBase}
      />

      <Suspense fallback={<div className={`py-12 sm:py-16 lg:py-20 ${bgSection}`}><div className="max-w-7xl mx-auto px-4 sm:px-6 text-center"><p className={textSecondary}>Loading reviews...</p></div></div>}>
        <ClientReviews language={language} visibleSections={visibleSections} />
      </Suspense>

      {/* CTA Section */}
      <CTASection
        language={language}
        visibleSections={visibleSections}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        bgSection={bgSection}
        scrollToSection={scrollToSection}
      />

      {/* Engagement Section */}
      <EngagementSection
        language={language}
        visibleSections={visibleSections}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        bgSkillsSection={bgSkillsSection}
        bgCard={bgCard}
        borderBase={borderBase}
        scrollToSection={scrollToSection}
      />

      {/* Interactive Engagement Section */}
      <EngagementInteractiveSection
        language={language}
        visibleSections={visibleSections}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        bgSkillsSection={bgSkillsSection}
        bgPage={bgPage}
        bgCard={bgCard}
        borderBase={borderBase}
        scrollToSection={scrollToSection}
        isDark={theme === 'dark'}
        onOpenBooking={() => setShowBookingModal(true)}
      />

      <Suspense fallback={null}>
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ResumeModal
          isOpen={showResumeModal}
          onClose={() => setShowResumeModal(false)}
        />
      </Suspense>

      <ClientBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

      <ContactSupport visibleSections={visibleSections} />

      {/* Footer */}
      <SiteFooter
        language={language}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        bgSection={bgSection}
        borderBase={borderBase}
        scrollToSection={scrollToSection}
      />

      {/* Scroll to Top Button */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 transition-all duration-300 ${
          activeSection !== 'home' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowUp className="text-white" size={16} />
        </button>
      </div>

      
      </div>
    </>
  );
};

export default Portfolio;