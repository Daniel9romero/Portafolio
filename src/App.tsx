import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Moon, Sun, Download, Mail, Linkedin, Github,
  MapPin, ExternalLink, Globe,
  BarChart3, Brain, Map, TrendingUp,
  Target, Users, ArrowRight, Calendar,
  Loader2, ChevronLeft, ChevronRight,
  Code2, Database, LineChart as LineChartIcon, Cpu, Cloud, Users2,
  Lock, ShieldCheck, Zap, PieChart
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import './i18n';
import 'leaflet/dist/leaflet.css';

// Lazy load heavy components
const ProfilePhoto = lazy(() => import('./components/ProfilePhoto'));
const Avatar3D = lazy(() => import('./components/Avatar3D'));
const LCZMap = lazy(() => import('./components/LCZMap'));
const InteractiveLCZMap = lazy(() => import('./components/InteractiveLCZMap'));
const LinkedInEmbed = lazy(() => import('./components/LinkedInEmbed').then(module => ({ default: module.LinkedInEmbed })));
const ParticlesBackground = lazy(() => import('./components/ParticlesBackground'));

function App() {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileImage, setProfileImage] = useState(`${import.meta.env.BASE_URL}profile-photo.jpg`);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false
  });

  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    if (!emblaApi) return;

    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoScroll);
  }, [emblaApi]);

  // Auto-expand/collapse cards based on scroll position (solo en desktop)
  useEffect(() => {
    // Detectar si es móvil
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // En móvil, solo funciona con click

    let ticking = false;
    let lastScrollY = window.scrollY;
    let scrollDirection: 'up' | 'down' | null = null;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!cardsRef.current) {
            ticking = false;
            return;
          }

          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY;

          // Only update direction if there's significant movement
          if (Math.abs(scrollDelta) > 5) {
            scrollDirection = scrollDelta > 0 ? 'down' : 'up';
          }

          const rect = cardsRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Cards are in the "expand zone" - visible and scrolled into view
          const inExpandZone = rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.3;

          // Expand only when scrolling DOWN and in the expand zone
          if (inExpandZone && !cardsExpanded && scrollDirection === 'down') {
            setCardsExpanded(true);
          }
          // Collapse when scrolling UP and cards top is getting hidden
          else if (scrollDirection === 'up' && cardsExpanded && rect.top > viewportHeight * 0.2) {
            setCardsExpanded(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [cardsExpanded]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navItems = ['home', 'about', 'projects', 'skills', 'experience', 'lcz-map', 'contact'];

  const projects = [
    {
      id: 1,
      key: 'project1',
      tech: ['Google Earth Engine', 'ML', 'GIS', 'Landsat 9'],
      color: 'from-slate-600 to-slate-700',
      icon: Map,
      metrics: { accuracy: 83.65, dataPoints: '1M+' },
      confidential: false
    },
    // Proyectos confidenciales
    {
      id: 7,
      key: 'confidential1',
      tech: ['Python', 'ML', 'Time Series'],
      color: 'from-gray-400 to-gray-500',
      icon: TrendingUp,
      confidential: true,
      confidentialTitle: 'Demand Forecasting Engine',
      confidentialDesc: 'Modelo predictivo de demanda multi-categoría'
    },
    {
      id: 8,
      key: 'confidential2',
      tech: ['Python', 'APIs', 'Real-time'],
      color: 'from-gray-400 to-gray-500',
      icon: Map,
      confidential: true,
      confidentialTitle: 'Adaptive Route Intelligence',
      confidentialDesc: 'Optimización logística con respuesta dinámica a incidentes'
    },
    {
      id: 9,
      key: 'confidential3',
      tech: ['ML', 'GIS', 'Market Analysis'],
      color: 'from-gray-400 to-gray-500',
      icon: Target,
      confidential: true,
      confidentialTitle: 'Real Estate Opportunity Radar',
      confidentialDesc: 'Detección temprana de oportunidades inmobiliarias con IA'
    },
    {
      id: 10,
      key: 'confidential4',
      tech: ['RAG', 'LLMs', 'Automation'],
      color: 'from-gray-400 to-gray-500',
      icon: Brain,
      confidential: true,
      confidentialTitle: 'Intelligence Hub',
      confidentialDesc: 'Centro de inteligencia empresarial automatizado'
    }
  ];

  const skills = {
    languages: [
      { name: 'Python', level: 95 },
      { name: 'SQL', level: 92 },
      { name: 'R', level: 90 },
      { name: 'JavaScript', level: 85 }
    ],
    biAnalytics: [
      { name: 'Power BI', level: 95 },
      { name: 'Tableau', level: 85 },
      { name: 'Looker', level: 80 },
      { name: 'dbt', level: 78 },
      { name: 'Data Modeling', level: 90 }
    ],
    aiMl: [
      { name: 'Large Language Models', level: 90 },
      { name: 'RAG & Langchain', level: 88 },
      { name: 'Agentic AI', level: 87 },
      { name: 'Scikit-learn', level: 93 },
      { name: 'XGBoost / LightGBM', level: 88 },
      { name: 'Deep Learning', level: 82 },
      { name: 'Prompt Engineering', level: 92 }
    ],
    dataEngineering: [
      { name: 'Airflow', level: 80 },
      { name: 'ETL Pipelines', level: 90 },
      { name: 'Snowflake', level: 75 },
      { name: 'AWS', level: 75 },
      { name: 'Docker', level: 80 },
      { name: 'APIs RESTful', level: 92 },
      { name: 'n8n Automation', level: 93 }
    ],
    geospatial: [
      { name: 'QGIS', level: 92 },
      { name: 'Google Earth Engine', level: 88 },
      { name: 'ArcGIS', level: 85 },
      { name: 'Remote Sensing', level: 89 }
    ],
    leadership: [
      { name: 'Strategic Planning', level: 92 },
      { name: 'Team Management', level: 90 },
      { name: 'C-Level Reporting', level: 88 },
      { name: 'Market Research', level: 95 },
      { name: 'Stakeholder Management', level: 87 },
      { name: 'Agile / Scrum', level: 85 }
    ]
  };

  const skillsIcons = {
    languages: Code2,
    biAnalytics: BarChart3,
    aiMl: Brain,
    dataEngineering: Database,
    geospatial: Map,
    leadership: Users2
  };

  const leadershipRadarData = [
    { skill: 'Business Intelligence', value: 95, fullMark: 100 },
    { skill: 'Data Strategy', value: 92, fullMark: 100 },
    { skill: 'AI Implementation', value: 88, fullMark: 100 },
    { skill: 'Process Automation', value: 93, fullMark: 100 },
    { skill: 'Team Leadership', value: 90, fullMark: 100 },
    { skill: 'Strategic Planning', value: 94, fullMark: 100 }
  ];


  const languageFlag = (lng: string) => {
    switch(lng) {
      case 'es': return '🇲🇽';
      case 'en': return '🇺🇸';
      case 'pt': return '🇧🇷';
      default: return '🌐';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <span className="text-xl font-bold text-gray-800 dark:text-white tracking-widest">
                JDLR
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t(`nav.${item}`)}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => changeLanguage('es')}>
                    {languageFlag('es')} Español
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    {languageFlag('en')} English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('pt')}>
                    {languageFlag('pt')} Português
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pb-4"
              >
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    className="block py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(`nav.${item}`)}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        {/* Particles Background */}
        <Suspense fallback={null}>
          <ParticlesBackground />
        </Suspense>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Photo/Avatar (solo visible en desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <Suspense fallback={
                  <div className="w-64 h-64 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse">
                  </div>
                }>
                  <ProfilePhoto
                    initialImage={profileImage}
                    onImageChange={setProfileImage}
                  />
                </Suspense>
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <Badge className="mb-4 px-4 py-2" variant="secondary">
                {t('hero.company')}
              </Badge>

              {/* Foto en móvil - entre badge y nombre */}
              <div className="lg:hidden flex justify-center mb-4">
                <Suspense fallback={
                  <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse">
                  </div>
                }>
                  <ProfilePhoto
                    initialImage={profileImage}
                    onImageChange={setProfileImage}
                  />
                </Suspense>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
                {t('hero.title')}
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t('hero.subtitle')}
              </h2>
              <p className="text-base text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="gap-2 w-full sm:w-auto touch-manipulation" asChild>
                  <a href="#projects">
                    {t('hero.cta')} <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto touch-manipulation">
                      <Download className="h-4 w-4" /> {t('hero.cta2')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a href={`${import.meta.env.BASE_URL}cv-espanol.pdf`} download="CV-Daniel-Romero-ESP.pdf">
                        🇲🇽 Español
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={`${import.meta.env.BASE_URL}cv-english.pdf`} download="CV-Daniel-Romero-ENG.pdf">
                        🇺🇸 English
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          </div>

          {/* Interactive Impact Cards */}
          <motion.div
            ref={cardsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
          >
            {/* Market Intelligence Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setCardsExpanded(!cardsExpanded)}
              className="cursor-pointer"
            >
              <Card className={`transition-all duration-300 ${cardsExpanded ? 'h-full' : 'h-32'}`}>
                <CardContent className="p-6">
                  <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="font-bold text-sm mb-4 text-center tracking-wide">{t('hero.cards.market.title')}</h3>

                  <AnimatePresence>
                    {cardsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 text-center">
                            {t('hero.cards.market.subtitle')}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                          {t('hero.cards.market.description')}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('hero.cards.market.coreCapabilities.title')}
                          </p>
                          <div className="space-y-1">
                            {(t('hero.cards.market.coreCapabilities.items', { returnObjects: true }) as string[]).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-0.5">→</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-2">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('hero.cards.market.technicalApproach.title')}
                          </p>
                          <div className="space-y-1">
                            {(t('hero.cards.market.technicalApproach.items', { returnObjects: true }) as string[]).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-0.5">→</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Operational Efficiency Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setCardsExpanded(!cardsExpanded)}
              className="cursor-pointer"
            >
              <Card className={`transition-all duration-300 ${cardsExpanded ? 'h-full' : 'h-32'}`}>
                <CardContent className="p-6">
                  <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="font-bold text-sm mb-4 text-center tracking-wide">{t('hero.cards.efficiency.title')}</h3>

                  <AnimatePresence>
                    {cardsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
                          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
                            {t('hero.cards.efficiency.metric')}
                          </div>
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center mt-1 tracking-wide">
                            {t('hero.cards.efficiency.subtitle')}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                          {t('hero.cards.efficiency.description')}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('hero.cards.efficiency.coreCapabilities.title')}
                          </p>
                          <div className="space-y-1">
                            {(t('hero.cards.efficiency.coreCapabilities.items', { returnObjects: true }) as string[]).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-0.5">→</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-2">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('hero.cards.efficiency.technicalApproach.title')}
                          </p>
                          <div className="space-y-1">
                            {(t('hero.cards.efficiency.technicalApproach.items', { returnObjects: true }) as string[]).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-0.5">→</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Intelligent Automation Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setCardsExpanded(!cardsExpanded)}
              className="cursor-pointer"
            >
              <Card className={`transition-all duration-300 ${cardsExpanded ? 'h-full' : 'h-32'}`}>
                <CardContent className="p-6">
                  <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="font-bold text-sm mb-4 text-center tracking-wide">{t('hero.cards.automation.title')}</h3>

                  <AnimatePresence>
                    {cardsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
                          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
                            {t('hero.cards.automation.metric')}
                          </div>
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center mt-1 tracking-wide">
                            {t('hero.cards.automation.subtitle')}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                          {t('hero.cards.automation.description')}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('hero.cards.automation.coreCapabilities.title')}
                          </p>
                          <div className="space-y-1">
                            {(t('hero.cards.automation.coreCapabilities.items', { returnObjects: true }) as string[]).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-0.5">→</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-2">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('hero.cards.automation.technicalApproach.title')}
                          </p>
                          <div className="space-y-1">
                            {(t('hero.cards.automation.technicalApproach.items', { returnObjects: true }) as string[]).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-0.5">→</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Research Excellence Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setCardsExpanded(!cardsExpanded)}
              className="cursor-pointer"
            >
              <Card className={`transition-all duration-300 ${cardsExpanded ? 'h-full' : 'h-32'}`}>
                <CardContent className="p-6">
                  <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="font-bold text-sm mb-4 text-center tracking-wide">{t('hero.cards.research.title')}</h3>

                  <AnimatePresence>
                    {cardsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
                          <div className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center leading-relaxed">
                            {t('hero.cards.research.subtitle')}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                          {t('hero.cards.research.description')}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('hero.cards.research.recentWork.title')}
                          </p>
                          <div className="space-y-1">
                            {(t('hero.cards.research.recentWork.items', { returnObjects: true }) as string[]).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-1">→</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('hero.cards.research.interests.title')}
                          </p>
                          <div className="space-y-1">
                            {(t('hero.cards.research.interests.items', { returnObjects: true }) as string[]).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-1">→</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <p className="text-xs italic text-gray-600 dark:text-gray-400 text-center">
                          {t('hero.cards.research.collaboration')}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-12">{t('about.title')}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t('about.content1')}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t('about.content2')}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t('about.content3')}</p>

                  {/* Highlight Cards */}
                  <div className="mt-6 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        {t('about.expanded.impact.title')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('about.expanded.impact.description')}
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        {t('about.expanded.research.title')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('about.expanded.research.description')}
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        {t('about.expanded.leadership.title')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('about.expanded.leadership.description')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-slate-900 border-0 shadow-lg h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Competencias clave - arriba */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-3 bg-white/70 dark:bg-gray-700/50 rounded-lg">
                      <Target className="h-5 w-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Visión Estratégica</div>
                    </div>
                    <div className="text-center p-3 bg-white/70 dark:bg-gray-700/50 rounded-lg">
                      <Users className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Gestión de Equipos</div>
                    </div>
                    <div className="text-center p-3 bg-white/70 dark:bg-gray-700/50 rounded-lg">
                      <TrendingUp className="h-5 w-5 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Orientación a Resultados</div>
                    </div>
                  </div>

                  {/* Radar Chart - centro, crece para llenar */}
                  <div className="flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={leadershipRadarData}>
                        <PolarGrid
                          stroke="#cbd5e1"
                          strokeDasharray="3 3"
                          gridType="polygon"
                        />
                        <PolarAngleAxis
                          dataKey="skill"
                          tick={{
                            fill: '#475569',
                            fontSize: 9,
                            fontWeight: 500
                          }}
                          tickLine={false}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name="Nivel"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          fill="url(#radarGradient)"
                          fillOpacity={0.6}
                          dot={{
                            r: 3,
                            fill: '#3B82F6',
                            strokeWidth: 2,
                            stroke: '#fff'
                          }}
                        />
                        <defs>
                          <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.4} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                          formatter={(value: number) => [`${value}%`, 'Dominio']}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Tags de expertise - abajo en grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <span className="px-3 py-2 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-center">
                      Inteligencia de Negocios
                    </span>
                    <span className="px-3 py-2 text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-center">
                      Estrategia de Datos
                    </span>
                    <span className="px-3 py-2 text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-center">
                      Automatización
                    </span>
                    <span className="px-3 py-2 text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-lg text-center">
                      Liderazgo Técnico
                    </span>
                    <span className="px-3 py-2 text-xs font-medium bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-lg text-center">
                      Investigación Aplicada
                    </span>
                    <span className="px-3 py-2 text-xs font-medium bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 rounded-lg text-center">
                      Transformación Digital
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">{t('projects.title')}</h2>
          

          {/* Todos los proyectos en cuadrícula uniforme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Proyecto LCZ (público) */}
            {projects.filter(p => !p.confidential).map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                            {t(`projects.${project.key}.title`)}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                            {t(`projects.${project.key}.description`)}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tech.slice(0, 3).map((tech) => (
                              <span key={tech} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <a
                            href="#lcz-map"
                            className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span className="border-b border-current">{t('projects.viewDetails')}</span>
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            {/* Proyectos Confidenciales */}
            {projects.filter(p => p.confidential).map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border overflow-hidden relative cursor-pointer">
                    {/* Contenido borroso de fondo - blur sutil para que se lea el título */}
                    <div className="p-4 transition-all duration-300 blur-[1px] group-hover:blur-[0.5px]">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                            {t(`projects.${project.key}.title`)}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                            {t(`projects.${project.key}.description`)}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tech.slice(0, 3).map((tech) => (
                              <span key={tech} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 dark:group-hover:bg-gray-900/30">
                      {/* Estado inicial */}
                      <div className="flex items-center gap-2 group-hover:hidden">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('projects.confidential.moreInfo')}</span>
                      </div>

                      {/* Estado hover */}
                      <div className="hidden group-hover:flex flex-col items-center text-center px-4">
                        <span className="text-xs text-gray-600 dark:text-gray-300 mb-1 italic px-2 py-0.5 bg-white/80 dark:bg-gray-800/80 rounded">
                          {t(`projects.${project.key}.status`)}
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3 px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded">
                          {t('projects.confidential.interest')}
                        </span>
                        <Button size="sm" variant="outline" className="h-7 text-xs bg-white dark:bg-gray-800" asChild>
                          <a href="#contact">
                            {t('projects.confidential.cta')} <ArrowRight className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">{t('skills.title')}</h2>

          {/* Carousel Controls */}
          <div className="flex justify-center gap-3 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollPrev()}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollNext()}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {Object.entries(skills).map(([category, items]) => {
                const Icon = skillsIcons[category as keyof typeof skillsIcons];
                return (
                  <motion.div
                    key={category}
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow border-2">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center shadow-md">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-lg">
                            {t(`skills.categories.${category}`)}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                          {items.map((skill: { name: string; level: number }) => (
                            <div key={skill.name} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {skill.level}%
                                </span>
                              </div>
                              <Progress value={skill.level} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Object.keys(skills).map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors"
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">{t('experience.title')}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Experiencia multisectorial en datos, estrategia y liderazgo
          </p>

          {/* Zigzag Timeline */}
          <div className="max-w-5xl mx-auto relative">
            {/* Central timeline line - hidden on mobile */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-gray-300 to-gray-200 dark:via-gray-700 dark:to-gray-800 transform -translate-x-1/2"></div>

            {[1, 2, 3, 4].map((job, index) => {
              const isLeft = index % 2 === 0;
              const sectorIcons: { [key: number]: React.ReactNode } = {
                1: <BarChart3 className="h-5 w-5" />,
                2: <LineChartIcon className="h-5 w-5" />,
                3: <Target className="h-5 w-5" />,
                4: <TrendingUp className="h-5 w-5" />
              };

              return (
                <motion.div
                  key={job}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={`relative flex items-center mb-8 last:mb-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col md:gap-8`}
                >
                  {/* Content Card */}
                  <div className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className={`hover:shadow-lg transition-all duration-300 ${
                      job === 1 ? 'border-t-4 border-t-blue-600 md:border-t-0 md:border-l-4 md:border-l-blue-600' : ''
                    }`}>
                      <CardHeader className="pb-3">
                        <div className={`flex flex-col gap-2 ${isLeft ? 'md:items-end' : 'md:items-start'}`}>
                          <Badge variant={job === 1 ? "default" : "secondary"} className="w-fit">
                            <Calendar className="h-3 w-3 mr-1" />
                            {t(`experience.job${job}.period`)}
                          </Badge>
                          <CardTitle className="text-lg">{t(`experience.job${job}.title`)}</CardTitle>
                          <CardDescription className={`flex items-center gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                            <span className="font-medium">{t(`experience.job${job}.company`)}</span>
                            <span className="text-xs">•</span>
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{t(`experience.job${job}.location`)}</span>
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${isLeft ? 'md:text-right' : ''}`}>
                          {t(`experience.job${job}.description`)}
                        </p>
                        {/* Highlights */}
                        <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                          {(t(`experience.job${job}.highlights`, { returnObjects: true }) as string[]).map((highlight, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Center Icon Node */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900 ${
                      job === 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {sectorIcons[job]}
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="hidden md:block w-[calc(50%-2rem)]"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* LCZ Map Section - Interactive Visualization */}
      <section id="lcz-map" className="py-12 px-4">
        <Suspense fallback={
          <div className="container mx-auto text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading interactive map...</p>
          </div>
        }>
          <LCZMap />
        </Suspense>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">{t('contact.title')}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            {t('contact.subtitle')}
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('contact.email')}</p>
                      <a href="mailto:daniel9romero@hotmail.com" className="text-lg font-medium hover:text-blue-600 transition-colors">
                        daniel9romero@hotmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <Linkedin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('contact.linkedin')}</p>
                      <a
                        href="https://linkedin.com/in/daniel9romero"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium hover:text-blue-600 transition-colors"
                      >
                        linkedin.com/in/daniel9romero
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <Github className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('contact.github')}</p>
                      <a
                        href="https://github.com/Daniel9romero"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium hover:text-blue-600 transition-colors"
                      >
                        github.com/Daniel9romero
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('contact.location')}</p>
                      <p className="text-lg font-medium">Chihuahua, México</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn Featured Post */}
            <Suspense fallback={
              <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg h-96"></div>
            }>
              <LinkedInEmbed />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 José Daniel López Romero
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
