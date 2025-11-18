import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  MapPin, Layers, Info, ZoomIn, ZoomOut, 
  Thermometer, Wind, Cloud, Building, Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// LCZ Types with colors matching standard LCZ classification
const lczTypes = [
  { id: 1, name: 'Compact high-rise', color: '#8B0000', icon: Building },
  { id: 2, name: 'Compact midrise', color: '#CC0000', icon: Building },
  { id: 3, name: 'Compact low-rise', color: '#FF0000', icon: Building },
  { id: 4, name: 'Open high-rise', color: '#FF6600', icon: Building },
  { id: 5, name: 'Open midrise', color: '#FF9900', icon: Building },
  { id: 6, name: 'Open low-rise', color: '#FFCC00', icon: Building },
  { id: 7, name: 'Lightweight low-rise', color: '#FFFF00', icon: Building },
  { id: 8, name: 'Large low-rise', color: '#99CC00', icon: Building },
  { id: 9, name: 'Sparsely built', color: '#669900', icon: Building },
  { id: 10, name: 'Heavy industry', color: '#333333', icon: Building },
  { id: 11, name: 'Dense trees', color: '#006600', icon: Cloud }, // A
  { id: 12, name: 'Scattered trees', color: '#009900', icon: Cloud }, // B
  { id: 13, name: 'Bush, scrub', color: '#66CC00', icon: Cloud }, // C
  { id: 14, name: 'Low plants', color: '#99FF00', icon: Cloud }, // D
  { id: 15, name: 'Bare rock or paved', color: '#999999', icon: Cloud }, // E
  { id: 16, name: 'Bare soil or sand', color: '#CC9966', icon: Cloud }, // F
  { id: 17, name: 'Water', color: '#0066FF', icon: Cloud }, // G
];

// Sample data for CDMX zones (alcaldías) - for reference points
const cdmxZones = [
  { name: 'Cuauhtémoc', lcz: 2, accuracy: 85.2, lat: 19.4326, lng: -99.1332 },
  { name: 'Miguel Hidalgo', lcz: 3, accuracy: 82.7, lat: 19.4204, lng: -99.2027 },
  { name: 'Benito Juárez', lcz: 3, accuracy: 84.1, lat: 19.3700, lng: -99.1586 },
  { name: 'Coyoacán', lcz: 6, accuracy: 86.3, lat: 19.3467, lng: -99.1617 },
  { name: 'Tlalpan', lcz: 11, accuracy: 88.9, lat: 19.2964, lng: -99.1663 },
  { name: 'Xochimilco', lcz: 14, accuracy: 87.4, lat: 19.2578, lng: -99.1036 },
  { name: 'Gustavo A. Madero', lcz: 5, accuracy: 81.8, lat: 19.4900, lng: -99.1097 },
  { name: 'Iztapalapa', lcz: 6, accuracy: 83.2, lat: 19.3578, lng: -99.0589 },
];

export function LCZMap() {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedZone, setSelectedZone] = useState<typeof cdmxZones[0] | null>(null);
  const [opacity, setOpacity] = useState([80]);
  const [showLegend, setShowLegend] = useState(true);
  const [mapMode, setMapMode] = useState<'lcz' | 'accuracy' | 'temperature'>('lcz');
  const [loading, setLoading] = useState(true);
  const [tifLoaded, setTifLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      setLoading(true);
      
      // Dynamic imports
      Promise.all([
        import('leaflet'),
        import('leaflet/dist/leaflet.css'),
        import('georaster'),
        import('georaster-layer-for-leaflet'),
      ]).then(async ([L, _, parseGeoraster, GeoRasterLayer]) => {
        
        // Initialize map
        const map = L.map(mapRef.current!, {
          center: [19.4326, -99.1332], // CDMX center
          zoom: 10,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Add base layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Try to load the GeoTIFF
        try {
          const tifUrl = `${import.meta.env.BASE_URL}lcz-cdmx.tif`;
          const response = await fetch(tifUrl);
          const arrayBuffer = await response.arrayBuffer();
          const georaster = await parseGeoraster.default(arrayBuffer);

          // Create color map for LCZ classes (1-17)
          const colorMap = (values: number[]) => {
            const value = values[0];
            if (value === 0 || value === null || value === undefined) {
              return 'rgba(0,0,0,0)'; // Transparent for no data
            }
            
            const lcz = lczTypes.find(t => t.id === Math.round(value));
            if (lcz) {
              return lcz.color;
            }
            return '#999999'; // Default gray
          };

          // Add GeoRaster layer
          const layer = new GeoRasterLayer.default({
            georaster: georaster,
            opacity: opacity[0] / 100,
            pixelValuesToColorFn: colorMap,
            resolution: 256,
          });

          layer.addTo(map);
          setTifLoaded(true);
          setLoading(false);

          // Update opacity when slider changes
          const updateOpacity = () => {
            layer.setOpacity(opacity[0] / 100);
          };

          // Store update function
          (map as any)._updateOpacity = updateOpacity;

        } catch (error) {
          console.error('Error loading GeoTIFF:', error);
          setLoading(false);
          
          // Fallback: Add sample points if TIF fails
          cdmxZones.forEach(zone => {
            const lczInfo = lczTypes.find(t => t.id === zone.lcz);
            const color = lczInfo?.color || '#999';
            
            const circle = L.circle([zone.lat, zone.lng], {
              color: color,
              fillColor: color,
              fillOpacity: 0.6,
              radius: 5000
            }).addTo(map);

            circle.bindPopup(`
              <div style="text-align: center;">
                <strong>${zone.name}</strong><br/>
                LCZ Type: ${zone.lcz} - ${lczInfo?.name}<br/>
                Accuracy: ${zone.accuracy}%
              </div>
            `);

            circle.on('click', () => {
              setSelectedZone(zone);
            });
          });
        }

        // Add scale
        L.control.scale({ metric: true, imperial: false }).addTo(map);

      }).catch(error => {
        console.error('Error initializing map:', error);
        setLoading(false);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update opacity when slider changes
  useEffect(() => {
    if (mapInstanceRef.current && (mapInstanceRef.current as any)._updateOpacity) {
      (mapInstanceRef.current as any)._updateOpacity();
    }
  }, [opacity]);

  return (
    <div className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            LCZ Classification - Mexico City
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Interactive map showing Local Climate Zones with {' '}
            <span className="font-bold text-blue-600">83.65% accuracy</span>
            {tifLoaded && (
              <Badge variant="outline" className="ml-2">
                GeoTIFF Loaded
              </Badge>
            )}
          </p>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Map Container */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={mapMode === 'lcz' ? 'default' : 'outline'}
                        onClick={() => setMapMode('lcz')}
                      >
                        <Layers className="h-4 w-4 mr-1" />
                        LCZ Types
                      </Button>
                      <Button
                        size="sm"
                        variant={mapMode === 'accuracy' ? 'default' : 'outline'}
                        onClick={() => setMapMode('accuracy')}
                        disabled
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Accuracy
                      </Button>
                      <Button
                        size="sm"
                        variant={mapMode === 'temperature' ? 'default' : 'outline'}
                        onClick={() => setMapMode('temperature')}
                        disabled
                      >
                        <Thermometer className="h-4 w-4 mr-1" />
                        Temperature
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowLegend(!showLegend)}
                    >
                      {showLegend ? 'Hide' : 'Show'} Legend
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <div 
                      ref={mapRef} 
                      className="h-[600px] w-full relative"
                      style={{ zIndex: 0 }}
                    />
                    
                    {loading && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Loading GeoTIFF classification...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Opacity Control */}
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Layer Opacity:</span>
                      <Slider
                        value={opacity}
                        onValueChange={setOpacity}
                        max={100}
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500 w-12">{opacity}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">17</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">LCZ Classes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">83.65%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">Landsat 9</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Data Source</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Legend Sidebar */}
            {showLegend && (
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">LCZ Legend</CardTitle>
                    <CardDescription>17 Climate Zone Classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {lczTypes.map(lcz => {
                        const Icon = lcz.icon;
                        return (
                          <div key={lcz.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                            <div
                              className="w-6 h-6 rounded flex-shrink-0 border border-gray-300"
                              style={{ backgroundColor: lcz.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold">{lcz.id}:</span>
                                <span className="text-xs truncate">{lcz.name}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Methodology Card */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Methodology</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                    <p><strong>Algorithm:</strong> Gradient Tree Boost</p>
                    <p><strong>Satellite:</strong> Landsat 9 OLI/TIRS</p>
                    <p><strong>Period:</strong> 2023-2025</p>
                    <p><strong>Resolution:</strong> 30m</p>
                    <p><strong>Classes:</strong> 17 LCZ types</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LCZMap;
