import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Moon, Sun, Download, Mail, Linkedin, Github, 
  MapPin, ExternalLink, Globe,
  BarChart3, Brain, Map, TrendingUp,
  Target, Users, Award, ArrowRight, Calendar, BookOpen,
  Sparkles, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import './i18n';
import 'leaflet/dist/leaflet.css';

// Lazy load heavy components
const ProfilePhoto = lazy(() => import('./components/ProfilePhoto'));
const Avatar3D = lazy(() => import('./components/Avatar3D'));
const LCZMap = lazy(() => import('./components/LCZMap'));
const InteractiveLCZMap = lazy(() => import('./components/InteractiveLCZMap'));

function App() {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [profileImage, setProfileImage] = useState(`${import.meta.env.BASE_URL}profile-photo.jpg`);


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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navItems = ['home', 'about', 'projects', 'skills', 'experience', 'research', 'lcz-map', 'contact'];

  const projects = [
    {
      id: 1,
      key: 'project1',
      tech: ['Python', 'ML', 'GIS', 'Landsat'],
      color: 'from-slate-600 to-slate-700',
      icon: Map,
      metrics: { accuracy: 83.65, dataPoints: '1M+' }
    },
    {
      id: 2,
      key: 'project2',
      tech: ['Power BI', 'Python', 'SQL'],
      color: 'from-blue-600 to-blue-700',
      icon: TrendingUp,
      metrics: { stores: 1000, roi: '250%' }
    },
    {
      id: 3,
      key: 'project3',
      tech: ['Python', 'Web Scraping', 'NLP'],
      color: 'from-emerald-600 to-emerald-700',
      icon: Target,
      metrics: { companies: 5, insights: 150 }
    },
    {
      id: 4,
      key: 'project4',
      tech: ['R', 'Statistical Analysis'],
      color: 'from-amber-600 to-amber-700',
      icon: BarChart3,
      metrics: { states: 32, categories: 15 }
    },
    {
      id: 5,
      key: 'project5',
      tech: ['R', 'Machine Learning'],
      color: 'from-indigo-600 to-indigo-700',',
      icon: Brain,
      metrics: { efficiency: 2300, products: '10K+' }
    },
    {
      id: 6,
      key: 'project6',
      tech: ['Strategic Planning', 'BI'],
      color: 'from-gray-600 to-gray-700',
      icon: Users,
      metrics: { divisions: 4, initiatives: 25 }
    }
  ];

  const skills = {
    data: ['Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'Statistics'],
    bi: ['Power BI', 'Tableau', 'Qlik Sense', 'Excel Advanced', 'Data Modeling'],
    gis: ['QGIS', 'Google Earth Engine', 'ArcGIS', 'Remote Sensing', 'Landsat', 'Sentinel'],
    programming: ['JavaScript', 'Git', 'Docker', 'APIs', 'Web Scraping', 'ETL']
  };

  const growthData = [
    { year: '2020', efficiency: 100, impact: 20 },
    { year: '2021', efficiency: 500, impact: 45 },
    { year: '2022', efficiency: 1200, impact: 70 },
    { year: '2023', efficiency: 1800, impact: 85 },
    { year: '2024', efficiency: 2300, impact: 95 }
  ];

  const marketShareData = [
    { name: 'Grupo Bafar', value: 35, fill: '#3B82F6' },
    { name: 'Sigma', value: 30, fill: '#8B5CF6' },
    { name: 'Qualtia', value: 20, fill: '#10B981' },
    { name: 'Others', value: 15, fill: '#F59E0B' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => 
        p.tech.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()))
      );

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
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              DR
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
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Photo/Avatar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
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
              className="text-center lg:text-left order-1 lg:order-2"
            >
              <Badge className="mb-4 px-4 py-2" variant="secondary">
                {t('hero.company')}
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('hero.title')}
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-6">
                {t('hero.subtitle')}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8">
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
                        🇪🇸 Español
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={`${import.meta.env.BASE_URL}cv-english.pdf`} download="CV-Daniel-Romero-ENG.pdf">
                        🇬🇧 English
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          </div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {Object.entries(t('about.stats', { returnObjects: true })).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {value}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
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
                  <p className="text-gray-600 dark:text-gray-400">{t('about.content3')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" name="Efficiency %" />
                      <Line type="monotone" dataKey="impact" stroke="#8B5CF6" name="Business Impact" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">{t('projects.title')}</h2>
          
          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <Tabs defaultValue="all" onValueChange={setActiveFilter}>
              <TabsList>
                <TabsTrigger value="all">{t('projects.all')}</TabsTrigger>
                <TabsTrigger value="Python">Python</TabsTrigger>
                <TabsTrigger value="R">R</TabsTrigger>
                <TabsTrigger value="ML">ML</TabsTrigger>
                <TabsTrigger value="BI">BI</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project, index) => {
                const Icon = project.icon;
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center mb-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle>{t(`projects.${project.key}.title`)}</CardTitle>
                        <CardDescription>{t(`projects.${project.key}.description`)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {t(`projects.${project.key}.achievement`)}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map((tech) => (
                            <Badge key={tech} variant="secondary">{tech}</Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            {t('projects.viewDetails')} <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">{t('skills.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, items]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{t(`skills.categories.${category}`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items.map((skill) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-sm">{skill}</span>
                        <Progress value={85 + Math.random() * 15} className="w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">{t('experience.title')}</h2>
          <div className="max-w-4xl mx-auto">
            {[1, 2, 3].map((job, index) => (
              <motion.div
                key={job}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative pl-8 pb-12 last:pb-0"
              >
                <div className="absolute left-0 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="absolute left-[7px] top-4 w-0.5 h-full bg-gray-300 dark:bg-gray-700 last:hidden"></div>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{t(`experience.job${job}.title`)}</CardTitle>
                        <CardDescription>{t(`experience.job${job}.company`)}</CardDescription>
                      </div>
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {t(`experience.job${job}.period`)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t(`experience.job${job}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">{t('research.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>{t('research.thesis.title')}</CardTitle>
                <CardDescription>{t('research.thesis.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="mb-4">{t('research.thesis.status')}</Badge>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        {marketShareData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>{t('research.interests.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {t(`research.interests.item${item}`)}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-sm font-medium">{t('research.phd')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Map className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle>Mapa Interactivo LCZ</CardTitle>
                    <CardDescription>Visualización de Clasificación</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Explora el mapa interactivo con las 17 clases LCZ identificadas en CDMX con 83.65% de precisión.
                </p>
                <Button asChild className="w-full">
                  <a href="#lcz-map">
                    <Map className="w-4 h-4 mr-2" />
                    Ver Mapa Interactivo
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* LCZ Map Section - Interactive Visualization */}
      <section id="lcz-map" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
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
      <section id="contact" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-4">{t('contact.title')}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            {t('contact.subtitle')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">{t('contact.email')}</p>
                      <p className="font-medium">jose.martinez@grupobafar.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">{t('contact.linkedin')}</p>
                      <p className="font-medium">linkedin.com/in/jose-martinez</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">{t('contact.github')}</p>
                      <p className="font-medium">github.com/josemartinez</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">{t('contact.location')}</p>
                      <p className="font-medium">{t('contact.locationValue')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t('contact.name')}</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('contact.emailField')}</label>
                    <input
                      type="email"
                      className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('contact.messageField')}</label>
                    <textarea
                      rows={4}
                      className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                  <Button className="w-full">{t('contact.send')}</Button>
                </form>
              </CardContent>
            </Card>
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
