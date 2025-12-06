import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Loader2, Info } from 'lucide-react';

// ============================================
// CONFIGURACIÓN - MODIFICA ESTOS VALORES
// ============================================
const CONFIG = {
  // Webhook de n8n
  webhookUrl: 'https://daniel9romero.app.n8n.cloud/webhook/c29242f0-52cc-4e00-9d6e-eea254e18b13',

  // Información del asistente
  assistantName: 'Daniel Romero',
  assistantRole: 'Data & AI Specialist',
  assistantPhoto: `${import.meta.env.BASE_URL}Fotito.jpg`,

  // Textos personalizables
  infoBannerText: 'Pregúntame sobre mi experiencia y proyectos',
  inputPlaceholder: 'Escribe tu pregunta...',
  footerHint: 'Pregunta lo que necesites sobre mi perfil',
  loadingText: 'Escribiendo...',
  errorMessage: 'Lo siento, hubo un error al conectar con el servidor. Por favor intenta de nuevo.',

  // Colores (usa clases de Tailwind o valores hex)
  accentColor: 'blue-500', // Color principal del tema
  accentColorHex: 'rgba(59, 130, 246, 0.5)', // Para el glow del botón

  // Posición del chat
  bubblePosition: 'bottom-4 right-4 sm:bottom-6 sm:right-6', // Posición de la burbuja
  windowPosition: 'bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6', // Posición de la ventana

  // Tamaños
  bubbleSize: 'w-14 h-14 sm:w-20 sm:h-20', // Tamaño de la burbuja
  windowSize: 'h-[70vh] sm:w-[350px] sm:h-[450px] rounded-2xl', // Tamaño de la ventana

  // Tiempo para mostrar notificación (ms)
  notificationDelay: 3000,
};
// ============================================

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

const MARGIN = 24;

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Estado para modo hero (cuando está sobre la foto de perfil)
  const [isHeroMode, setIsHeroMode] = useState(true);
  const [heroPosition, setHeroPosition] = useState<{ x: number; y: number; size: number } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const prevHeroModeRef = useRef(true);
  const initialHeroPositionRef = useRef<{ x: number; y: number; size: number } | null>(null);

  // Posición de la burbuja cuando está en modo normal (esquina)
  const [cornerPosition, setCornerPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  const getBubbleSize = () => (typeof window !== 'undefined' && window.innerWidth < 640 ? 56 : 80);

  // Dirección de la transición: 'toHero' o 'toCorner'
  const [transitionDirection, setTransitionDirection] = useState<'toHero' | 'toCorner' | null>(null);

  // Detectar cambio de modo para activar transición
  useEffect(() => {
    if (prevHeroModeRef.current !== isHeroMode) {
      setIsTransitioning(true);
      setTransitionDirection(isHeroMode ? 'toHero' : 'toCorner');
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 1200);
      prevHeroModeRef.current = isHeroMode;
      return () => clearTimeout(timer);
    }
  }, [isHeroMode]);

  // Detectar la foto de perfil y su visibilidad
  useEffect(() => {
    const updateHeroPosition = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      const photoId = isMobile ? 'profile-photo-mobile' : 'profile-photo-desktop';
      const photoElement = document.getElementById(photoId);

      if (photoElement) {
        // Buscar el div circular dentro del contenedor
        const circularPhoto = photoElement.querySelector('.rounded-full') as HTMLElement;

        if (circularPhoto) {
          const rect = circularPhoto.getBoundingClientRect();

          // Solo actualizar si tiene dimensiones válidas
          if (rect.width > 0 && rect.height > 0) {
            // Calcular posición esperada del centro de la pantalla (aproximado)
            const expectedCenterX = window.innerWidth / 2 - rect.width / 2;
            const isPositionValid = isMobile
              ? rect.left > expectedCenterX - 100 // Móvil: debe estar cerca del centro
              : rect.left > 50; // Desktop: no debe estar muy pegado al borde

            // Guardar posición inicial solo si es válida (animación terminada)
            if (!initialHeroPositionRef.current && isPositionValid) {
              initialHeroPositionRef.current = {
                x: rect.left,
                y: rect.top + window.scrollY, // Guardar posición absoluta (no relativa al viewport)
                size: rect.width
              };
            }

            // Usar posición inicial si existe, sino usar rect actual
            const basePos = initialHeroPositionRef.current || {
              x: rect.left,
              y: rect.top + window.scrollY,
              size: rect.width
            };

            // Calcular posición actual restando scroll
            const heroPos = {
              x: basePos.x,
              y: basePos.y - window.scrollY,
              size: basePos.size
            };

            setHeroPosition(heroPos);

            // Verificar si la foto está visible en el viewport
            const isVisible = heroPos.y < window.innerHeight * 0.6 && heroPos.y + heroPos.size > 80;
            setIsHeroMode(isVisible && !isOpen);
          }
        }
      }
    };

    // Esperar a que todo esté cargado y marcar como listo
    const initPosition = () => {
      // Intentar obtener posición válida con reintentos
      const tryGetPosition = (attempts = 0) => {
        updateHeroPosition();

        // Si ya tenemos posición válida, mostrar
        if (initialHeroPositionRef.current) {
          setIsReady(true);
        } else if (attempts < 20) {
          // Reintentar cada 100ms hasta 2 segundos
          setTimeout(() => tryGetPosition(attempts + 1), 100);
        } else {
          // Fallback: mostrar de todas formas
          setIsReady(true);
        }
      };

      // Empezar después de 800ms (duración de animación)
      setTimeout(() => tryGetPosition(0), 800);
    };

    // Si el documento ya cargó, inicializar
    if (document.readyState === 'complete') {
      initPosition();
    } else {
      window.addEventListener('load', initPosition);
    }

    // También actualizar cuando las fuentes carguen (puede afectar el layout)
    document.fonts?.ready?.then(updateHeroPosition);

    // Actualizar en scroll y resize
    const handleScroll = () => {
      requestAnimationFrame(updateHeroPosition);
    };

    const handleResize = () => {
      // Resetear posición inicial al cambiar tamaño para recalcular
      initialHeroPositionRef.current = null;
      updateHeroPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('load', initPosition);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Inicializar posición de esquina
  useEffect(() => {
    if (cornerPosition === null && typeof window !== 'undefined') {
      const size = getBubbleSize();
      setCornerPosition({
        x: window.innerWidth - size - MARGIN,
        y: window.innerHeight - size - MARGIN
      });
    }
  }, [cornerPosition]);

  // Ajustar esquina al resize
  useEffect(() => {
    const handleResize = () => {
      if (!cornerPosition) return;
      const size = getBubbleSize();
      setCornerPosition({
        x: Math.min(Math.max(MARGIN, cornerPosition.x), window.innerWidth - size - MARGIN),
        y: Math.min(Math.max(MARGIN, cornerPosition.y), window.innerHeight - size - MARGIN)
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cornerPosition]);

  // Snap al borde más cercano
  const snapToEdge = (x: number, y: number) => {
    const size = getBubbleSize();
    const maxX = window.innerWidth - size - MARGIN;
    const maxY = window.innerHeight - size - MARGIN;

    const distLeft = x - MARGIN;
    const distRight = maxX - x;
    const distTop = y - MARGIN;
    const distBottom = maxY - y;

    const minH = Math.min(distLeft, distRight);
    const minV = Math.min(distTop, distBottom);

    if (minH < minV) {
      return { x: distLeft < distRight ? MARGIN : maxX, y };
    } else {
      return { x, y: distTop < distBottom ? MARGIN : maxY };
    }
  };

  // Handlers de drag (solo cuando no está en hero mode)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isHeroMode || !cornerPosition) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY, posX: cornerPosition.x, posY: cornerPosition.y };
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isHeroMode || !dragStartRef.current || !cornerPosition) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (!isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      setIsDragging(true);
    }

    if (isDragging || Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      const size = getBubbleSize();
      const newX = Math.min(Math.max(MARGIN, dragStartRef.current.posX + dx), window.innerWidth - size - MARGIN);
      const newY = Math.min(Math.max(MARGIN, dragStartRef.current.posY + dy), window.innerHeight - size - MARGIN);
      setCornerPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = () => {
    if (isHeroMode) return;
    const wasDragging = isDragging;
    dragStartRef.current = null;
    setIsDragging(false);

    if (wasDragging && cornerPosition) {
      requestAnimationFrame(() => {
        const snapped = snapToEdge(cornerPosition.x, cornerPosition.y);
        setCornerPosition(snapped);
      });
    }
  };

  // Calcular posición y tamaño actual
  const currentPosition = isHeroMode && heroPosition
    ? { x: heroPosition.x, y: heroPosition.y }
    : cornerPosition;

  const currentSize = isHeroMode && heroPosition
    ? heroPosition.size
    : getBubbleSize();

  // Posición del chat según donde esté la burbuja
  const isTopHalf = currentPosition ? currentPosition.y < window.innerHeight / 2 : false;
  const isLeftHalf = currentPosition ? currentPosition.x < window.innerWidth / 2 : false;

  const getWindowPositionClasses = () => {
    if (isTopHalf && isLeftHalf) return 'top-4 left-4 right-4 sm:right-auto sm:top-6 sm:left-6';
    if (isTopHalf) return 'top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6';
    if (isLeftHalf) return 'bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6';
    return 'bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6';
  };

  // Simular notificación después del tiempo configurado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNotification(true);
      }
    }, CONFIG.notificationDelay);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasNotification(false);

    // Mensaje de bienvenida si no hay mensajes
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now(),
        text: '¡Hola! Soy José Daniel, Head of Intelligence. Este es mi portafolio, estoy aquí para resolver tus dudas sobre mi experiencia y proyectos.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close chat with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta');
      }

      const contentType = response.headers.get('content-type');
      let botText: string;

      if (contentType?.includes('application/json')) {
        const data = await response.json();
        botText = data.response || data.output || data.message || data;
      } else {
        botText = await response.text();
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botText || 'Lo siento, no pude procesar tu pregunta.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: CONFIG.errorMessage,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Ocultar las fotos de perfil originales cuando la burbuja está en hero mode Y lista
  useEffect(() => {
    const desktopPhoto = document.getElementById('profile-photo-desktop');
    const mobilePhoto = document.getElementById('profile-photo-mobile');

    // Solo ocultar la foto original cuando la burbuja está lista Y en hero mode
    const shouldHide = isHeroMode && isReady;

    if (desktopPhoto) {
      desktopPhoto.style.opacity = shouldHide ? '0' : '1';
      desktopPhoto.style.transition = 'opacity 0.3s ease';
    }
    if (mobilePhoto) {
      mobilePhoto.style.opacity = shouldHide ? '0' : '1';
      mobilePhoto.style.transition = 'opacity 0.3s ease';
    }
  }, [isHeroMode, isReady]);

  return (
    <>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && currentPosition && isReady && (
          <motion.div
            ref={bubbleRef}
            initial={isHeroMode ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`fixed select-none ${isHeroMode && !isTransitioning ? 'z-40' : 'z-50'}`}
            style={{
              left: currentPosition.x,
              top: currentPosition.y,
              width: currentSize,
              height: currentSize,
              touchAction: 'none',
              cursor: isHeroMode ? 'pointer' : (isDragging ? 'grabbing' : 'grab'),
              transition: isDragging
                ? 'none'
                : isTransitioning
                  ? 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1), top 1.2s cubic-bezier(0.4, 0, 0.2, 1), width 1.2s cubic-bezier(0.4, 0, 0.2, 1), height 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  : isHeroMode
                    ? 'none'
                    : 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Notification badge - proporción 25% en hero, 30% en corner */}
            <AnimatePresence>
              {hasNotification && (() => {
                const badgeRatio = isHeroMode ? 0.25 : 0.3;
                const badgeSize = currentSize * badgeRatio;
                const fontSize = currentSize * (badgeRatio / 2);
                const borderWidth = Math.max(2, currentSize * 0.025);
                return (
                  <>
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute bg-red-500 rounded-full"
                      style={{
                        width: badgeSize,
                        height: badgeSize,
                        top: 0,
                        right: 0,
                        transition: isTransitioning ? 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                      }}
                    />
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      onClick={() => !isDragging && handleOpenChat()}
                      className="absolute bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10 cursor-pointer"
                      style={{
                        width: badgeSize,
                        height: badgeSize,
                        fontSize: fontSize,
                        top: -badgeSize * 0.15,
                        right: -badgeSize * 0.15,
                        borderWidth: borderWidth,
                        borderColor: 'black',
                        borderStyle: 'solid',
                        transition: isTransitioning ? 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                      }}
                    >
                      1
                    </motion.span>
                  </>
                );
              })()}
            </AnimatePresence>

            {/* Botón con foto */}
            <button
              onClick={() => !isDragging && handleOpenChat()}
              className="w-full h-full rounded-full shadow-2xl overflow-hidden transition-transform duration-200 hover:scale-105"
              style={{
                boxShadow: isHeroMode
                  ? '0 4px 20px rgba(0,0,0,0.3)'
                  : `0 0 25px ${CONFIG.accentColorHex}, 0 4px 20px rgba(0,0,0,0.4)`,
                border: isHeroMode ? '4px solid rgba(255,255,255,0.2)' : `3px solid rgba(59, 130, 246, 0.6)`
              }}
            >
              <img
                src={CONFIG.assistantPhoto}
                alt="Chat Assistant"
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: isTopHalf ? -20 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: isTopHalf ? -20 : 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed ${getWindowPositionClasses()} z-50 ${CONFIG.windowSize} bg-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r from-${CONFIG.accentColor}/20 to-green-600/20 px-4 py-3 flex items-center gap-3 border-b border-white/10`}>
              <div className={`w-10 h-10 rounded-full overflow-hidden border-2 border-${CONFIG.accentColor}/50`}>
                <img
                  src={CONFIG.assistantPhoto}
                  alt="Assistant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{CONFIG.assistantName}</h3>
                <p className={`text-${CONFIG.accentColor} text-xs`}>{CONFIG.assistantRole}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* Info banner */}
              {messages.length === 0 && (
                <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2 px-3">
                  <Info size={14} className="text-gray-400" />
                  <p className="text-xs text-gray-400">
                    {CONFIG.infoBannerText}
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      message.isUser
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white/10 text-gray-200 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-[10px] mt-1 ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className={`animate-spin text-${CONFIG.accentColor}`} />
                      <span className="text-sm text-gray-400">{CONFIG.loadingText}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/50">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={CONFIG.inputPlaceholder}
                  disabled={isLoading}
                  className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-${CONFIG.accentColor}/50 focus:ring-1 focus:ring-${CONFIG.accentColor}/30 transition-all disabled:opacity-50`}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-gray-600 mt-2 text-center">
                {CONFIG.footerHint}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
