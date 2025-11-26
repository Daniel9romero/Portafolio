// @ts-nocheck
import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Download, ArrowRight, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import profilePhoto from '/profile-photo.jpg';

// Simple 3D Avatar Component
function Avatar3D() {
  return (
    <mesh>
      {/* Head */}
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#FFB6C1" />
      
      {/* Body */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1, 32]} />
        <meshStandardMaterial color="#4B5563" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </mesh>
  );
}

interface HeroSectionProps {
  darkMode: boolean;
}

export function HeroSection({ darkMode }: HeroSectionProps) {
  const { t } = useTranslation();
  const [showAvatar, setShowAvatar] = useState(false);
  const [photoUrl] = useState<string>(profilePhoto);



  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Photo or 3D Avatar - Aparece primero en móvil */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-first md:order-last"
          >
            {showAvatar ? (
              <div className="h-96 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                <Canvas camera={{ position: [0, 0, 3] }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <Avatar3D />
                    <OrbitControls enablePan={false} enableZoom={false} />
                    <Environment preset="city" />
                  </Suspense>
                </Canvas>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2">
                    🎮 Arrastra para rotar el avatar
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-96 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt="Daniel Romero - Desarrollador Full Stack"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </motion.div>

          {/* Text content - Aparece segundo en móvil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left order-last md:order-first"
          >
            <Badge className="mb-4 px-4 py-2" variant="secondary">
              {t('hero.company')}
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-6">
              {t('hero.subtitle')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                {t('hero.cta')} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Download className="h-4 w-4" /> {t('hero.cta2')}
              </Button>
            </div>

            {/* Photo/Avatar Toggle */}
            <div className="mt-6 flex gap-2 justify-center md:justify-start">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAvatar(!showAvatar)}
                className="gap-2"
              >
                <Box className="h-4 w-4" />
                {showAvatar ? 'Ver Foto' : 'Ver Avatar 3D'}
              </Button>
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
  );
}
