import { useState, useEffect, lazy, Suspense } from 'react';
import './portfolio.css';
import { Facebook, Twitter, Linkedin, Github, MessageSquare, ChevronDown, Award, CheckCircle, Users, Code, GitBranch, ArrowUp, Terminal, Package, FileCode, Figma, Paintbrush, Palette, Database, Server, Smartphone, Layout, Box, Zap, Shield, Calendar, Mail, Menu, X } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
const ProjectModal = lazy(() => import('../components/ProjectModal'));
const ResumeModal = lazy(() => import('../components/ResumeModal'));
import { useTheme } from '../theme/useTheme';
import SectionHeader from '../components/SectionHeader';
import ProjectCard from '../components/ProjectCard';
import CTAButtons from '../components/CTAButtons';
const ClientReviews = lazy(() => import('./ClientReviews'));
import { t, type Language } from '../i18n/translations';
import ContactSupport from './ContactSupport';
import ClientBookingModal from './ClientBookingModal';
import ProfessionalDropdown from '../components/ProfessionalDropdown';
import formalImg from '../assets/formal.png';
import myCv from '../assets/MyCV.pdf';
import { projects } from '../data/projects';
import type { Project } from '../types/project';

const Portfolio = () => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'skills' | 'tools'>('skills');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['home']));
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterTech, setFilterTech] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'skills', 'portfolio', 'services', 'reviews', 'contact'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
     { name: 'Angular', icon: Box, color: 'from-red-600 to-red-700' },
     { name: 'Vue.js', icon: Box, color: 'from-green-500 to-green-600' },
     { name: 'Node.js', icon: Server, color: 'from-green-600 to-green-700' },
     { name: 'Database', icon: Database, color: 'from-purple-500 to-purple-600' },
     { name: 'Git', icon: GitBranch, color: 'from-gray-700 to-gray-800' },
     { name: 'Responsive', icon: Smartphone, color: 'from-pink-500 to-pink-600' },
     { name: 'UI/UX', icon: Layout, color: 'from-indigo-500 to-indigo-600' },
   ];

  const stats = [
    { icon: Award, value: '3+', label: 'Years of Experience', color: 'text-orange-500' },
    { icon: CheckCircle, value: '6+', label: 'Completed Projects', color: 'text-green-500' },
    { icon: Users, value: '2+', label: 'Happy Clients', color: 'text-blue-500' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
  const navBg = scrolled ? (theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/80') : 'bg-transparent';
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
    <div className={`min-h-screen ${bgPage} transition-colors duration-300`}>
      {/* Navigation */}
       <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBg} ${scrolled ? 'backdrop-blur-lg shadow-lg border-b ' + borderBase : 'backdrop-blur-sm'}`}>
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
                return (
                  <a
                    key={labelKey}
                    href={`#${id}`}
                    className={`group relative text-sm font-semibold transition-all duration-300 ${
                      isActive ? 'text-orange-500' : navText + ' hover:text-orange-500'
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
                    <span className={`absolute -bottom-1.5 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-orange-500/30 blur-sm"></span>
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
                {navItems.map(({ labelKey, id }, index) => {
                  const isActive = activeSection === id;
                  return (
                    <a
                      key={labelKey}
                      href={`#${id}`}
                      className={`relative block py-2.5 px-3 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg ${
                        isActive ? 'text-orange-500 bg-orange-500/10' : navText + ' hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-500'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(id);
                        setMobileOpen(false);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={`Go to ${t(language, labelKey)}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {t(language, labelKey)}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r"></span>
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

      {/* Hero Section */}
      <section id="home" className={`min-h-screen flex items-center justify-center relative pt-16 sm:pt-20 overflow-hidden ${bgSection}`}>
        {/* Subtle Background Effects with Animation */}
        <div className="absolute inset-0 bg-linear-to-b from-orange-500/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
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

        {/* Hero Content with Staggered Animations */}
        <div className="text-center px-4 sm:px-6 z-10 max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-5 inline-block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${borderBase} bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md`}>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className={`${textSecondary} text-xs sm:text-sm font-semibold tracking-wider uppercase`}>{t(language, 'hero.role')}</span>
            </div>
          </div>
          
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-5 tracking-tight leading-tight ${textPrimary} opacity-0 animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
            <span className="inline-block transition-all duration-300 hover:scale-105">John Wayne</span>
            <br />
            <span className="text-orange-500 inline-block relative transition-all duration-300 hover:scale-105">
              Enrique
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-transparent via-orange-500/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </span>
          </h1>
          
          <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mb-2 sm:mb-3 ${textSecondary} opacity-0 animate-fade-in-up`} style={{ animationDelay: '0.6s' }}>
            {t(language, 'hero.title.line1')}
          </h2>
          <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mb-8 sm:mb-10 ${textSecondary} opacity-0 animate-fade-in-up`} style={{ animationDelay: '0.7s' }}>
            {t(language, 'hero.title.line2')}
          </h2>
          
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
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
      <section id="about" className={`py-12 sm:py-16 lg:py-20 ${bgSection} ${visibleSections.has('about') ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${bgCard} rounded-lg p-6 border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:-translate-y-1 ${visibleSections.has('about') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                    <stat.icon size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <div className={`text-3xl font-bold mb-1 ${textPrimary}`}>{stat.value}</div>
                    <div className={`${textSecondary} text-sm`}>{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* About Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className={`relative w-full max-w-md mx-auto lg:mx-0 mb-8 lg:mb-0 ${visibleSections.has('about') ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className={`aspect-square ${bgCard} rounded-lg border ${borderBase} overflow-hidden transition-transform duration-500 hover:scale-105`}>
                <img src={formalImg} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
            </div>

            <div className={`${visibleSections.has('about') ? 'animate-fade-in-right' : 'opacity-0'}`}>
               <div className="mb-3 sm:mb-4">
                 <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'about.section')}</span>
                 <div className="h-0.5 w-10 bg-orange-500 mt-2"></div>
              </div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight ${textPrimary}`}>
                {t(language, 'about.heading.line1')}
                <br />
                <span className="text-orange-500">{t(language, 'about.heading.line2')}</span>
              </h2>
              <p className={`${textSecondary} mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed`}>
                {t(language, 'about.p1')}
              </p>
              <p className={`${textSecondary} mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed`}>
                {t(language, 'about.p2')}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  {t(language, 'about.hireMe')}
                </button>
                <a
                  href={myCv}
                  download="MyCV.pdf"
                  className={`px-6 py-3 border ${borderBase} hover:border-orange-500 ${textPrimary} font-semibold rounded-lg transition-all duration-300 hover:scale-105`}
                >
                  {t(language, 'about.downloadCV')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`py-12 sm:py-16 lg:py-20 ${bgSkillsSection} ${visibleSections.has('skills') ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 items-start">
            <div className={`lg:col-span-2 mb-8 lg:mb-0 ${visibleSections.has('skills') ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="mb-3 sm:mb-4">
                <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'skills.section')}</span>
                <div className="h-0.5 w-10 bg-orange-500 mt-2"></div>
              </div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight ${textPrimary}`}>
                {t(language, 'skills.heading1')}
                <br />
                <span className="text-orange-500">{t(language, 'skills.heading2')}</span>
              </h2>
              <p className={`${textSecondary} mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed`}>
                Specialized in building responsive, scalable applications using cutting-edge technologies and industry best practices.
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`px-5 py-2 rounded-md font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'skills' 
                      ? 'bg-orange-500 text-white scale-105' 
                      : `${bgCard} border ${borderBase} ${textPrimary} hover:border-orange-500 hover:scale-105`
                  }`}
                >
                  {t(language, 'skills.tab.skills')}
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-5 py-2 rounded-md font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'tools' 
                      ? 'bg-orange-500 text-white scale-105' 
                      : `${bgCard} border ${borderBase} ${textPrimary} hover:border-orange-500 hover:scale-105`
                  }`}
                >
                  {t(language, 'skills.tab.tools')}
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {(activeTab === 'skills' ? skills : tools).map((item, index) => (
                <div
                  key={index}
                  className={`${bgCard} rounded-lg p-4 border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:-translate-y-1 aspect-square flex flex-col items-center justify-center ${visibleSections.has('skills') ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <item.icon className={`${textPrimary} mb-2 transition-transform duration-300 group-hover:scale-110`} size={28} />
                  <span className={`text-xs font-medium ${textPrimary} text-center leading-tight`}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className={`py-12 sm:py-16 lg:py-20 ${bgSection} ${visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'} overflow-visible`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-visible">
          <div className={`${visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <SectionHeader
              label={t(language, 'portfolio.section')}
              title={<><span className={`${textPrimary}`}>{t(language, 'portfolio.heading1')} </span><span className="text-orange-500">{t(language, 'portfolio.heading2')}</span></>}
              subtitle={t(language, 'portfolio.subtitle')}
              align="center"
              textPrimaryClass={textPrimary}
              textSecondaryClass={textSecondary}
            />
          </div>

          {/* Filters */}
          <div className={`mb-6 ${bgCard} border ${borderBase} rounded-lg p-3 sm:p-4 transition-all duration-300 ${visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'} overflow-visible`}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 relative">
                <label className={`text-xs ${textSecondary}`}>{t(language, 'portfolio.filter.category')}</label>
                <ProfessionalDropdown
                  value={filterCategory}
                  onChange={setFilterCategory}
                  options={[
                    { value: '', label: t(language, 'portfolio.filter.all') },
                    ...Array.from(new Set(projects.map(p => p.category))).map((cat) => ({
                      value: cat,
                      label: cat,
                    })),
                  ]}
                  className="min-w-[160px] max-w-[160px]"
                  inputBg={inputBg}
                  borderBase={borderBase}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  aria-label="Filter projects by category"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className={`text-xs ${textSecondary}`}>{t(language, 'portfolio.filter.tech')}</label>
                <input
                  type="text"
                  value={filterTech}
                  onChange={(e) => setFilterTech(e.target.value)}
                  placeholder={t(language, 'portfolio.filter.placeholder')}
                  className={`w-full sm:w-[220px] ${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 hover:border-orange-500/60`}
                />
                {(filterCategory || filterTech) && (
                  <button
                    onClick={() => { setFilterCategory(''); setFilterTech(''); }}
                    className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 hover:border-orange-500 transition-all duration-200 hover:scale-[1.02]"
                    aria-label="Clear filters"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {(filterCategory || filterTech) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {filterCategory && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-orange-500/10 text-orange-600 border border-orange-300/40 transition-all duration-200 hover:scale-[1.02]">
                    Category: {filterCategory}
                    <button className="ml-1" aria-label="Remove category filter" onClick={() => setFilterCategory('')}>×</button>
                  </span>
                )}
                {filterTech && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-600 border border-blue-300/40 transition-all duration-200 hover:scale-[1.02]">
                    Tech: {filterTech}
                    <button className="ml-1" aria-label="Remove tech filter" onClick={() => setFilterTech('')}>×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {(() => {
            const filteredProjects = projects
              .filter((p) => !filterCategory || p.category === filterCategory)
              .filter((p) => {
                if (!filterTech) return true;
                const q = filterTech.toLowerCase();
                return p.tech.toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
              });
            const hasMoreThanSix = filteredProjects.length > 6;
            
            return (
              <div className="relative">
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ${
                    hasMoreThanSix
                      ? 'projects-scrollable overflow-y-auto pb-4'
                      : ''
                  }`}
                >
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      bgCardClass={bgCard}
                      borderBaseClass={borderBase}
                      textPrimaryClass={textPrimary}
                      textSecondaryClass={textSecondary}
                      visible={visibleSections.has('portfolio')}
                      onSelect={setSelectedProject}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`py-12 sm:py-16 lg:py-20 ${bgSkillsSection} ${visibleSections.has('services') ? 'animate-fade-in-up' : 'opacity-0'}`}>
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
            {[ 
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
            ].map((service, index) => (
              <div
                key={index}
                className={`${bgCard} rounded-lg p-6 border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1 ${visibleSections.has('services') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
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

      <Suspense fallback={<div className={`py-12 sm:py-16 lg:py-20 ${bgSection}`}><div className="max-w-7xl mx-auto px-4 sm:px-6 text-center"><p className={textSecondary}>Loading reviews...</p></div></div>}>
        <ClientReviews language={language} visibleSections={visibleSections} />
      </Suspense>

      {/* CTA Section */}
      <section id="cta" className={`py-10 sm:py-12 lg:py-16 ${bgSection} relative overflow-hidden ${visibleSections.has('cta') ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-orange-600/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>
            {t(language, 'cta.big.title')}
          </h2>
          <p className={`${textSecondary} mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto`}>
            {t(language, 'cta.big.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t(language, 'cta.getStarted')}
            </button>
            <a
              href={myCv}
              download="MyCV.pdf"
              className={`px-8 py-3 border-2 ${borderBase} hover:border-orange-500 ${textPrimary} font-semibold rounded-lg transition-all duration-300 hover:scale-105`}
            >
              {t(language, 'cta.downloadResume')}
            </a>
          </div>
        </div>
      </section>

      {/* Engagement Section */}
      <section id="engagement" className={`py-12 sm:py-16 lg:py-20 ${bgSkillsSection} ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* How We Work */}
            <div className={`${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6`}>
              <div className="mb-3 sm:mb-4">
                <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'engagement.process')}</span>
                <div className="h-0.5 w-10 bg-orange-500 mt-2"></div>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>{t(language, 'engagement.howWeWork')}</h3>
              <ol className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${textSecondary} mb-4 sm:mb-6`}>
                <li className={`${textSecondary}`}>
                  {t(language, 'engagement.step1')}
                </li>
                <li className={`${textSecondary}`}>
                  {t(language, 'engagement.step2')}
                </li>
                <li className={`${textSecondary}`}>
                  {t(language, 'engagement.step3')}
                </li>
                <li className={`${textSecondary}`}>
                  {t(language, 'engagement.step4')}
                </li>
              </ol>
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {t(language, 'engagement.bookCall')}
                </button>
                <a
                  href="mailto:joma.enrique.up@phinmaed.com"
                  className={`px-6 py-2 border ${borderBase} hover:border-orange-500 ${textPrimary} font-semibold rounded-lg transition-colors`}
                >
                  {t(language, 'engagement.emailMe')}
                </a>
              </div>
            </div>

            {/* Engagement Models */}
            <div className={`${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6`}>
              <div className="mb-3 sm:mb-4">
                <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>Engagement</span>
                <div className="h-0.5 w-10 bg-orange-500 mt-2"></div>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>{t(language, 'engagement.title')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className={`${bgPage} border ${borderBase} rounded-lg p-4`}>
                  <h4 className={`font-semibold mb-1 ${textPrimary}`}>{t(language, 'engagement.fixed')}</h4>
                  <p className={`${textSecondary} text-sm`}>Clear scope and timeline; ideal for well-defined projects.</p>
                </div>
                <div className={`${bgPage} border ${borderBase} rounded-lg p-4`}>
                  <h4 className={`font-semibold mb-1 ${textPrimary}`}>{t(language, 'engagement.hourly')}</h4>
                  <p className={`${textSecondary} text-sm`}>Flexible ongoing work, billed monthly for actual hours.</p>
                </div>
                <div className={`${bgPage} border ${borderBase} rounded-lg p-4`}>
                  <h4 className={`font-semibold mb-1 ${textPrimary}`}>{t(language, 'engagement.retainer')}</h4>
                  <p className={`${textSecondary} text-sm`}>Guaranteed availability for continuous improvements.</p>
                </div>
                <div className={`${bgPage} border ${borderBase} rounded-lg p-4`}>
                  <h4 className={`font-semibold mb-1 ${textPrimary}`}>{t(language, 'engagement.consulting')}</h4>
                  <p className={`${textSecondary} text-sm`}>Architecture, audits, and roadmap planning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Engagement Section */}
      <section className={`py-12 sm:py-16 lg:py-20 ${bgSkillsSection} ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
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
            {[
              {
                icon: MessageSquare,
                title: t(language, 'contact.sendMessage'),
                description: 'Fill out the contact form below for project inquiries or questions.',
                action: () => scrollToSection('contact'),
                buttonText: t(language, 'contact.openForm'),
                color: 'from-orange-500 to-orange-600'
              },
              {
                icon: Mail,
                title: t(language, 'contact.emailDirectly'),
                description: 'Reach out via email for a more detailed discussion about your project.',
                action: () => window.open('mailto:joma.enrique.up@phinmaed.com?subject=Project Inquiry', '_blank'),
                buttonText: t(language, 'contact.sendEmail'),
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Calendar,
                title: 'Client Booking',
                description: 'Book a session to discuss your project timeline, scope, and goals.',
                action: () => {
                  setShowBookingModal(true);
                },
                buttonText: 'Book Now',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: Github,
                title: 'GitHub',
                description: 'Browse my repositories, projects, and code samples.',
                action: () => window.open('https://github.com/Waynenyarky', '_blank'),
                buttonText: 'View Profile',
                color: 'from-gray-800 to-gray-900'
              }
            ].map((method, index) => (
              <div
                key={index}
                className={`${bgCard} border ${borderBase} rounded-xl p-5 sm:p-6 transition-all duration-300 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1 ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'} h-full flex flex-col`}
                style={{ animationDelay: `${index * 0.1}s` }}
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
                  <button
                    onClick={method.action}
                    className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
                  >
                    {method.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media Engagement */}
          <div className={`${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6 ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center ${textPrimary}`}>{t(language, 'contact.connectOnSocial')}</h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a
                href="https://web.facebook.com/jowne.enrique.11"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Facebook className="text-blue-500" size={24} />
                </div>
                <span className="text-xs font-medium">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}
              >
                <div className="w-14 h-14 bg-sky-500/10 rounded-full flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                  <Twitter className="text-sky-500" size={24} />
                </div>
                <span className="text-xs font-medium">Twitter</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}
              >
                <div className="w-14 h-14 bg-blue-600/10 rounded-full flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                  <Linkedin className="text-blue-600" size={24} />
                </div>
                <span className="text-xs font-medium">LinkedIn</span>
              </a>
              <a
                href="https://github.com/Waynenyarky"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}
              >
                <div className="w-14 h-14 bg-neutral-800/10 rounded-full flex items-center justify-center group-hover:bg-neutral-800/20 transition-colors">
                  <Github className="text-neutral-800 dark:text-white" size={24} />
                </div>
                <span className="text-xs font-medium">GitHub</span>
              </a>
              <a
                href="mailto:joma.enrique.up@phinmaed.com"
                className={`flex flex-col items-center gap-2 ${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110 group`}
              >
                <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Mail className="text-orange-500" size={24} />
                </div>
                <span className="text-xs font-medium">Email</span>
              </a>
            </div>
          </div>
        </div>
      </section>

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
      <footer className={`${bgSection} py-8 sm:py-12 border-t ${borderBase}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className={`text-2xl font-bold tracking-tight mb-4 ${textPrimary}`}>
                Wayne<span className="text-orange-500">.</span>
              </div>
              <p className={`${textSecondary} text-xs sm:text-sm leading-relaxed`}>
                Full-stack developer specializing in creating exceptional digital experiences with modern technologies.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${textPrimary}`}>{t(language, 'footer.portfolio')}</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {[
                  { labelKey: 'nav.about', id: 'about' },
                  { labelKey: 'nav.skills', id: 'skills' },
                  { labelKey: 'nav.projects', id: 'portfolio' },
                ].map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className={`${textSecondary} text-sm hover:text-orange-500 transition-colors duration-200`}
                    >
                      {t(language, item.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${textPrimary}`}>{t(language, 'footer.services')}</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {[
                  { labelKey: 'nav.services', id: 'services' },
                  { labelKey: 'nav.reviews', id: 'reviews' },
                ].map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className={`${textSecondary} text-sm hover:text-orange-500 transition-colors duration-200`}
                    >
                      {t(language, item.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${textPrimary}`}>{t(language, 'footer.connect')}</h3>
              <div className="flex space-x-4">
                <a
                  href="https://web.facebook.com/jowne.enrique.11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`}
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`}
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`}
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              <a
                href="https://github.com/Waynenyarky"
                target="_blank"
                rel="noopener noreferrer"
                className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`}
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              </div>
            </div>
          </div>
          <div className={`pt-6 sm:pt-8 border-t ${borderBase} text-center ${textSecondary} text-xs sm:text-sm`}>
            © 2025 <span className="text-orange-500 font-semibold">Wayne Enrique</span>. All rights reserved
          </div>
        </div>
      </footer>

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
  );
};

export default Portfolio;