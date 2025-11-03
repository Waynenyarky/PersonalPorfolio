import { useState, useEffect } from 'react';
import { Facebook, Twitter, Linkedin, MessageSquare, ChevronDown, Award, CheckCircle, Users, Code, GitBranch, ArrowUp, Terminal, Package, FileCode, Figma, Paintbrush, Palette, Database, Server, Smartphone, Layout, Box, Menu, X, Zap, Shield, Star, Quote, Calendar, Phone, Mail, Send } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import ProjectModal from '../components/ProjectModal';
import ResumeModal from '../components/ResumeModal';
import { useTheme } from '../theme/useTheme';
import { t, type Language } from '../i18n/translations';
import ContactSupport from './ContactSupport';
import formalImg from '../assets/formal.png';
import myCv from '../assets/MyCV.pdf';
import { projects } from '../data/projects';
import type { Project } from '../types/project';
import { sendContactMessage } from '../services/contactService';

const Portfolio = () => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'skills' | 'tools'>('skills');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['home']));
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    name: '',
    role: '',
    company: '',
    email: '',
    rating: 5,
    review: ''
  });

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

    const sections = ['about', 'skills', 'portfolio', 'services', 'engagement', 'reviews', 'contact'];
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
    { icon: Award, value: '1+', label: 'Years of Experience', color: 'text-orange-500' },
    { icon: CheckCircle, value: '4+', label: 'Completed Projects', color: 'text-green-500' },
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
       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBg} ${scrolled ? 'backdrop-blur-md shadow-md border-b ' + borderBase : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              className={`${navText} text-xl sm:text-2xl font-bold tracking-tight`}
              aria-label="Go to Home"
              onClick={() => scrollToSection('home')}
            >
              Wayne<span className="text-orange-500">.</span>
            </button>
            
            <div className="hidden md:flex space-x-8">
              {navItems.map(({ labelKey, id }) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={labelKey}
                    href={`#${id}`}
                    className={`relative text-sm font-medium transition-colors duration-200 ${
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
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all duration-200 ${
                      isActive ? 'w-full' : 'w-0 hover:w-full'
                    }`}></span>
                  </a>
                );
              })}
            </div>

            {/* Desktop utilities */}
            <div className="hidden md:flex items-center space-x-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className={`${inputBg} border ${borderBase} ${textPrimary} rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition-colors`}
                aria-label={t(language, 'lang.select')}
              >
                <option value="en">{t(language, 'lang.english')}</option>
                <option value="fil">{t(language, 'lang.filipino')}</option>
              </select>
              <ThemeToggle className="w-9 h-9 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200" size={18} />
            </div>

            {/* Mobile menu button */}
            <button
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-300 ${navText} ${scrolled ? 'bg-transparent' : ''}`}
              aria-label="Toggle navigation menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {/* Mobile menu panel */}
            {mobileOpen && (
          <div className={`md:hidden ${bgCard} border-t ${borderBase}`}>
            <div className="px-6 pb-6 space-y-4">
              <div className="pt-2 grid grid-cols-1 gap-2">
                {navItems.map(({ labelKey, id }) => {
                  const isActive = activeSection === id;
                  return (
                    <a
                      key={labelKey}
                      href={`#${id}`}
                      className={`relative block py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${
                        isActive ? 'text-orange-500' : navText
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
                      {isActive && <span className="absolute left-0 top-1/2 w-1 h-4 bg-orange-500 rounded-r"></span>}
                    </a>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className={`${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer`}
                  aria-label={t(language, 'lang.select')}
                >
                  <option value="en">{t(language, 'lang.english')}</option>
                  <option value="fil">{t(language, 'lang.filipino')}</option>
                </select>
                <ThemeToggle size={20} />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className={`min-h-screen flex items-center justify-center relative pt-20 sm:pt-24 overflow-hidden ${bgSection}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none"></div>
        
        <div className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col items-center space-y-5 z-10 animate-fade-in-left">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`}>
            <Facebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`}>
            <Twitter size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`}>
            <Linkedin size={20} />
          </a>
          <div className="w-px h-24 bg-gray-300 dark:bg-gray-700"></div>
        </div>

        <div className="text-center px-4 sm:px-6 z-10 max-w-4xl mx-auto animate-fade-in-up">
          <div className="mb-3 sm:mb-4 inline-block animate-float">
            <span className={`${textSecondary} text-xs sm:text-sm font-medium tracking-wider uppercase`}>{t(language, 'hero.role')}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 tracking-tight leading-tight ${textPrimary}`}>
            John Wayne
            <br />
            <span className="text-orange-500 animate-pulse-slow">Enrique</span>
          </h1>
          <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mb-2 sm:mb-3 ${textSecondary}`}>
            {t(language, 'hero.title.line1')}
          </h2>
          <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mb-8 sm:mb-10 ${textSecondary}`}>
            {t(language, 'hero.title.line2')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              {t(language, 'cta.getInTouch')}
            </button>
            <button
              onClick={() => setShowResumeModal(true)}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${borderBase} hover:border-orange-500 ${textPrimary} font-semibold rounded-lg transition-all duration-300 hover:scale-105`}
            >
              {t(language, 'cta.viewResume')}
            </button>
          </div>
        </div>

        <div className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col items-center animate-fade-in-right">
          <div className={`writing-vertical text-xs tracking-wider ${textSecondary} font-medium mb-4`}>
            SCROLL
          </div>
          <div className="w-px h-24 bg-gray-300 dark:bg-gray-700"></div>
          <ChevronDown className="text-orange-500 mt-3 animate-bounce" size={20} />
        </div>
      </section>

      {/* About Section */}
       <section id="about" className={`min-h-screen flex items-center py-16 sm:py-24 lg:py-32 ${bgSection} ${visibleSections.has('about') ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-24">
            {stats.map((stat, index) => (
               <div
                 key={index}
                 className={`${bgCard} rounded-lg p-6 border ${borderBase} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${visibleSections.has('about') ? `animate-fade-in-up` : 'opacity-0'}`}
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
       <section id="skills" className={`min-h-screen py-16 sm:py-24 lg:py-32 ${bgSkillsSection} ${visibleSections.has('skills') ? 'animate-fade-in-up' : 'opacity-0'}`}>
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
      <section id="portfolio" className={`py-16 sm:py-24 lg:py-32 ${bgSection} ${visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-8 sm:mb-12 ${visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="inline-block mb-4">
              <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'portfolio.section')}</span>
              <div className="h-0.5 w-10 bg-orange-500 mt-2 mx-auto"></div>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>
              {t(language, 'portfolio.heading1')} <span className="text-orange-500">{t(language, 'portfolio.heading2')}</span>
            </h2>
            <p className={`${textSecondary} text-sm sm:text-base max-w-2xl mx-auto px-4 sm:px-0`}>
              {t(language, 'portfolio.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`group ${bgCard} rounded-lg overflow-hidden border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer ${visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-110`}>
                  <Code className="text-white opacity-80 transition-opacity duration-300 group-hover:opacity-100" size={48} />
                </div>
                <div className="p-5">
                  <div className="text-xs text-orange-500 font-semibold mb-2 uppercase tracking-wider">{project.category}</div>
                  <h3 className={`text-lg font-bold mb-1 transition-colors duration-300 group-hover:text-orange-500 ${textPrimary}`}>{project.title}</h3>
                  <p className={`${textSecondary} text-sm`}>{project.tech}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`py-16 sm:py-24 lg:py-32 ${bgSkillsSection} ${visibleSections.has('services') ? 'animate-fade-in-up' : 'opacity-0'}`}>
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

      {/* Testimonials Section */}
      <section id="reviews" data-section="reviews" className={`py-16 sm:py-24 lg:py-32 ${bgSection}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-10 sm:mb-12 lg:mb-16 ${visibleSections.has('reviews') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="inline-block mb-4">
              <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'reviews.section')}</span>
              <div className="h-0.5 w-10 bg-orange-500 mt-2 mx-auto"></div>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>
              {t(language, 'reviews.heading1')} <span className="text-orange-500">{t(language, 'reviews.heading2')}</span>
            </h2>
            <p className={`${textSecondary} text-sm sm:text-base max-w-2xl mx-auto px-4 sm:px-0 mb-4 sm:mb-6`}>
              {t(language, 'reviews.subtitle')}
            </p>
            <div className={`mt-4 sm:mt-6 max-w-3xl mx-auto ${bgCard} border ${borderBase} rounded-lg p-4 sm:p-5 text-left`}>
              <h3 className={`text-sm font-semibold mb-2 ${textPrimary}`}>{t(language, 'reviews.howItWorks')}</h3>
              <ul className={`text-sm list-disc pl-5 space-y-1 ${textSecondary}`}>
                <li>{t(language, 'reviews.point1')}</li>
                <li>{t(language, 'reviews.point2')}</li>
                <li>{t(language, 'reviews.point3')}</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Product Manager',
                company: 'Tech Solutions Inc.',
                content: 'Wayne delivered exceptional work that exceeded our expectations. The project was completed on time with attention to detail and professionalism.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'CEO',
                company: 'StartupHub',
                content: 'Outstanding developer with deep technical knowledge. Wayne transformed our vision into a polished, user-friendly application.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'Design Director',
                company: 'Creative Agency',
                content: 'Working with Wayne was a pleasure. His expertise in both frontend and backend development made our collaboration seamless.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`${bgCard} rounded-lg p-6 border ${borderBase} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${visibleSections.has('reviews') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-orange-500 fill-orange-500" size={16} />
                  ))}
                </div>
                <Quote className={`${textSecondary} mb-4 opacity-50`} size={24} />
                <p className={`${textSecondary} mb-4 leading-relaxed text-sm`}>{testimonial.content}</p>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className={`font-semibold ${textPrimary} text-sm`}>{testimonial.name}</p>
                  <p className={`${textSecondary} text-xs`}>{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Review Submission Form */}
          <div className={`max-w-2xl mx-auto ${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6 ${visibleSections.has('reviews') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
              <h3 className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{t(language, 'reviewForm.title')}</h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className={`w-full sm:w-auto px-4 py-2 ${showReviewForm ? 'bg-gray-200 dark:bg-gray-700' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-lg transition-colors duration-200 text-sm font-semibold`}
              >
                {showReviewForm ? t(language, 'reviewForm.cancel') : t(language, 'reviewForm.leave')}
              </button>
            </div>
            {showReviewForm && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const result = await sendContactMessage({
                      full_name: reviewData.name,
                      email: reviewData.email || 'review@portfolio.com', // Use provided email or placeholder
                      subject: `Client Review - Rating: ${reviewData.rating}/5`,
                      message: `Review from ${reviewData.name} (${reviewData.role} at ${reviewData.company}):\n\nRating: ${reviewData.rating}/5\n\nReview:\n${reviewData.review}`,
                      phone: ''
                    });
                    if (result.type === 'success') {
                      alert('Thank you for your review! It will be reviewed and may be published.');
                      setReviewData({ name: '', role: '', company: '', email: '', rating: 5, review: '' });
                      setShowReviewForm(false);
                    } else {
                      alert(result.message || 'There was an error submitting your review. Please try again.');
                    }
                  } catch (error) {
                    alert('There was an error submitting your review. Please try again or contact directly.');
                  }
                }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder={t(language, 'reviewForm.name')}
                    value={reviewData.name}
                    onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                    required
                    className={`${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  <input
                    type="text"
                    placeholder={t(language, 'reviewForm.role')}
                    value={reviewData.role}
                    onChange={(e) => setReviewData({ ...reviewData, role: e.target.value })}
                    required
                    className={`${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  <input
                    type="text"
                    placeholder={t(language, 'reviewForm.company')}
                    value={reviewData.company}
                    onChange={(e) => setReviewData({ ...reviewData, company: e.target.value })}
                    required
                    className={`${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={t(language, 'reviewForm.email')}
                    value={reviewData.email}
                    onChange={(e) => setReviewData({ ...reviewData, email: e.target.value })}
                    className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-semibold ${textPrimary}`}>{t(language, 'reviewForm.rating')}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating })}
                        className="transition-transform duration-200 hover:scale-110"
                        aria-label={`Set rating ${rating}`}
                      >
                        <Star
                          className={reviewData.rating >= rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300 dark:text-gray-600'}
                          size={24}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <textarea
                    placeholder={t(language, 'reviewForm.placeholder')}
                    value={reviewData.review}
                    onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                    required
                    rows={4}
                    className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {t(language, 'reviewForm.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-12 sm:py-16 lg:py-24 ${bgSection} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10"></div>
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
      <section id="engagement" className={`py-16 sm:py-24 lg:py-32 ${bgSkillsSection} ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
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
      <section className={`py-16 sm:py-24 lg:py-32 ${bgSkillsSection} ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
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
                icon: Phone,
                title: t(language, 'contact.scheduleCall'),
                description: 'Book a discovery call to discuss your project requirements and timeline.',
                action: () => {
                  // You can integrate with Calendly or similar booking service
                  alert('Booking link: Schedule your call via email or contact form');
                  scrollToSection('contact');
                },
                buttonText: t(language, 'contact.bookNow'),
                color: 'from-green-500 to-green-600'
              },
              {
                icon: Calendar,
                title: t(language, 'contact.quickConsult'),
                description: 'Request a 15-minute consultation to explore how I can help your project.',
                action: () => scrollToSection('contact'),
                buttonText: t(language, 'contact.request'),
                color: 'from-purple-500 to-purple-600'
              }
            ].map((method, index) => (
              <div
                key={index}
                className={`${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6 transition-all duration-300 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1 ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}>
                  <method.icon className="text-white" size={24} />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${textPrimary}`}>{method.title}</h3>
                <p className={`${textSecondary} text-sm mb-4 leading-relaxed`}>{method.description}</p>
                <button
                  onClick={method.action}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                >
                  {method.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Social Media Engagement */}
          <div className={`${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6 ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center ${textPrimary}`}>{t(language, 'contact.connectOnSocial')}</h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a
                href="https://facebook.com"
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

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ResumeModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />

      <ContactSupport />

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
                  href="https://facebook.com"
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
              </div>
            </div>
          </div>
          <div className={`pt-6 sm:pt-8 border-t ${borderBase} text-center ${textSecondary} text-xs sm:text-sm`}>
            © 2024 <span className="text-orange-500 font-semibold">Wayne Enrique</span>. All rights reserved
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-lg z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="text-white" size={16} />
      </button>

      <style>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;