import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Upload, Info, Award, X, ChevronDown } from 'lucide-react';

// Congreso CIMA 2025 photos
const congresoPhotos = [
  { id: 1, src: './congreso-cima-2025/congreso-foto-1.png', alt: 'Exposición Congreso CIMA 2025' },
  { id: 2, src: './congreso-cima-2025/congreso-foto-2.png', alt: 'Presentación LCZ CDMX' },
  { id: 3, src: './congreso-cima-2025/congreso-foto-3.jpg', alt: 'Congreso CIMA 2025' },
  { id: 4, src: './congreso-cima-2025/constancia-participacion.png', alt: 'Constancia de Participación' },
];

// LCZ Classes with colors
const lczClasses = {
  1: { name: 'Compact high-rise', color: '#8B0000' },
  2: { name: 'Compact midrise', color: '#CC0000' },
  3: { name: 'Compact low-rise', color: '#FF0000' },
  4: { name: 'Open high-rise', color: '#FF6666' },
  5: { name: 'Open midrise', color: '#FFCCCC' },
  6: { name: 'Open low-rise', color: '#FFE5E5' },
  7: { name: 'Lightweight low-rise', color: '#FFFFCC' },
  8: { name: 'Large low-rise', color: '#999999' },
  9: { name: 'Sparsely built', color: '#CCCCCC' },
  10: { name: 'Heavy industry', color: '#666666' },
  A: { name: 'Dense trees', color: '#006400' },
  B: { name: 'Scattered trees', color: '#228B22' },
  C: { name: 'Bush, scrub', color: '#90EE90' },
  D: { name: 'Low plants', color: '#ADFF2F' },
  E: { name: 'Bare rock or paved', color: '#A9A9A9' },
  F: { name: 'Bare soil or sand', color: '#F4A460' },
  G: { name: 'Water', color: '#4682B4' }
};

// Sample data points for Mexico City
const sampleData = [
  { id: 1, x: 30, y: 40, lcz: 2, zone: 'Centro Histórico', lat: 19.4326, lng: -99.1332 },
  { id: 2, x: 45, y: 35, lcz: 1, zone: 'Polanco', lat: 19.4270, lng: -99.1678 },
  { id: 3, x: 40, y: 55, lcz: 3, zone: 'Coyoacán', lat: 19.3838, lng: -99.1770 },
  { id: 4, x: 20, y: 50, lcz: 6, zone: 'Santa Fe', lat: 19.3587, lng: -99.2840 },
  { id: 5, x: 55, y: 25, lcz: 'A', zone: 'Bosque de Aragón', lat: 19.5033, lng: -99.1528 },
  { id: 6, x: 35, y: 70, lcz: 'D', zone: 'Xochimilco', lat: 19.3256, lng: -99.2115 },
  { id: 7, x: 42, y: 45, lcz: 4, zone: 'Roma Norte', lat: 19.4136, lng: -99.1745 },
  { id: 8, x: 65, y: 60, lcz: 'B', zone: 'Tláhuac', lat: 19.2943, lng: -99.0568 }
];

export default function InteractiveLCZMap({ geoTiffUrl }: { geoTiffUrl?: string }) {
  const [selectedPoint, setSelectedPoint] = useState<typeof sampleData[0] | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tiffLoaded, setTiffLoaded] = useState(!!geoTiffUrl);
  const [congresoOpen, setCongresoOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof congresoPhotos[0] | null>(null);

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.tif,.tiff,.geotiff';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('GeoTIFF file selected:', file.name);
        // Here you would process the GeoTIFF file
        alert(`GeoTIFF "${file.name}" cargado. En producción, aquí se procesaría y visualizaría el archivo.`);
      }
    };
    input.click();
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="relative h-[500px] w-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
        {/* Background Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Map Points */}
        <div className="absolute inset-0">
          {sampleData.map((point) => {
            const lczInfo = lczClasses[point.lcz as keyof typeof lczClasses];
            return (
              <motion.div
                key={point.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: point.id * 0.1 }}
                className="absolute cursor-pointer"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedPoint(point)}
                onMouseEnter={() => setHoveredPoint(point.id)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`relative ${hoveredPoint === point.id ? 'z-20' : 'z-10'}`}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: lczInfo.color }}
                  />
                  {(hoveredPoint === point.id || selectedPoint?.id === point.id) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl whitespace-nowrap z-30"
                    >
                      <div className="text-sm font-bold">{point.zone}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        LCZ {point.lcz}: {lczInfo.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Upload Button / Status */}
        {tiffLoaded ? (
          <div className="absolute top-4 left-4 z-20 bg-green-500/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            GeoTIFF Cargado: LCZ_CDMX_L9
          </div>
        ) : (
          <button
            onClick={handleFileUpload}
            className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-white dark:hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Cargar GeoTIFF
          </button>
        )}

        {/* Stats Overlay */}
        <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur p-3 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-blue-600">83.65%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Precisión ML</div>
          <div className="text-xs text-gray-500 mt-1">Landsat 9</div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur p-3 rounded-lg shadow-lg max-w-xs">
          <div className="text-sm font-bold mb-2 flex items-center gap-1">
            <Info className="w-4 h-4" /> Clases LCZ
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(lczClasses).slice(0, 6).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-sm border border-gray-300"
                  style={{ backgroundColor: val.color }}
                />
                <span className="truncate">{key}: {val.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {selectedPoint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-lg">{selectedPoint.zone}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Clasificación: LCZ {selectedPoint.lcz} - {lczClasses[selectedPoint.lcz as keyof typeof lczClasses].name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Coordenadas: {selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)}
              </p>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Congreso CIMA 2025 Section */}
      <div className="mt-6">
        <motion.button
          onClick={() => setCongresoOpen(!congresoOpen)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-between group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6" />
            <div className="text-left">
              <div className="text-lg">Congreso CIMA 2025</div>
              <div className="text-sm opacity-90 font-normal">Exposición: Clasificación LCZ en CDMX</div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: congresoOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {congresoOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Presentación del proyecto de clasificación de Zonas Climáticas Locales (LCZ) para la Ciudad de México
                  utilizando imágenes Landsat 9 y técnicas de Machine Learning.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {congresoPhotos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer relative group overflow-hidden rounded-lg shadow-md"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-24 md:h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium px-2 text-center">
                          {photo.alt}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              <p className="text-white text-center mt-3 text-sm">{selectedPhoto.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
