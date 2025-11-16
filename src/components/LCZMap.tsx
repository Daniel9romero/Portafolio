import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  MapPin, Layers, Info, ZoomIn, ZoomOut, 
  Thermometer, Wind, Cloud, Building
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// LCZ Types with colors (Local Climate Zones)
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
  { id: 'A', name: 'Dense trees', color: '#006600', icon: Cloud },
  { id: 'B', name: 'Scattered trees', color: '#009900', icon: Cloud },
  { id: 'C', name: 'Bush, scrub', color: '#66CC00', icon: Cloud },
  { id: 'D', name: 'Low plants', color: '#99FF00', icon: Cloud },
  { id: 'E', name: 'Bare rock or paved', color: '#999999', icon: Cloud },
  { id: 'F', name: 'Bare soil or sand', color: '#CC9966', icon: Cloud },
  { id: 'G', name: 'Water', color: '#0066FF', icon: Cloud },
];

// Sample data for CDMX zones (alcaldías)
const cdmxZones = [
  { name: 'Cuauhtémoc', lcz: 2, accuracy: 85.2, lat: 19.4326, lng: -99.1332 },
  { name: 'Miguel Hidalgo', lcz: 3, accuracy: 82.7, lat: 19.4204, lng: -99.2027 },
  { name: 'Benito Juárez', lcz: 3, accuracy: 84.1, lat: 19.3700, lng: -99.1586 },
  { name: 'Coyoacán', lcz: 6, accuracy: 86.3, lat: 19.3467, lng: -99.1617 },
  { name: 'Tlalpan', lcz: 'A', accuracy: 88.9, lat: 19.2964, lng: -99.1663 },
  { name: 'Xochimilco', lcz: 'D', accuracy: 87.4, lat: 19.2578, lng: -99.1036 },
  { name: 'Gustavo A. Madero', lcz: 5, accuracy: 81.8, lat: 19.4900, lng: -99.1097 },
  { name: 'Iztapalapa', lcz: 6, accuracy: 83.2, lat: 19.3578, lng: -99.0589 },
];

interface LCZMapProps {
  tifFile?: File | null;
}

export function LCZMap({ tifFile }: LCZMapProps) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedZone, setSelectedZone] = useState<typeof cdmxZones[0] | null>(null);
  const [opacity, setOpacity] = useState([80]);
  const [showLegend, setShowLegend] = useState(true);
  const [mapMode, setMapMode] = useState<'lcz' | 'accuracy' | 'temperature'>('lcz');

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      // Dynamic import for Leaflet
      import('leaflet').then((L) => {
        import('leaflet/dist/leaflet.css');
        
        // Initialize map
        const map = L.map(mapRef.current!, {
          center: [19.4326, -99.1332], // CDMX center
          zoom: 10,
        });

        // Add base layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add LCZ zones as circles
        cdmxZones.forEach(zone => {
          const lczInfo = lczTypes.find(t => t.id === zone.lcz);
          const color = lczInfo?.color || '#999';
          
          const circle = L.circle([zone.lat, zone.lng], {
            color: color,
            fillColor: color,
            fillOpacity: opacity[0] / 100,
            radius: 3000
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

        // Add scale
        L.control.scale().addTo(map);

        return () => {
          map.remove();
        };
      });
    }
  }, [opacity, mapMode]);

  // Process TIF file if provided
  useEffect(() => {
    if (tifFile) {
      // Here you would process the TIF file
      // Using libraries like geotiff.js or georaster
      console.log('Processing TIF file:', tifFile.name);
      // Implementation would go here
    }
  }, [tifFile]);

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
          </p>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Map Container */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
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
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Accuracy
                      </Button>
                      <Button
                        size="sm"
                        variant={mapMode === 'temperature' ? 'default' : 'outline'}
                        onClick={() => setMapMode('temperature')}
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
                  <div 
                    ref={mapRef} 
                    className="h-[500px] w-full relative"
                    style={{ zIndex: 0 }}
                  />
                  
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

              {/* Selected Zone Details */}
              {selectedZone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedZone.name}</CardTitle>
                      <CardDescription>Zone Details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">LCZ Type</p>
                          <p className="text-lg font-bold">{selectedZone.lcz}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Accuracy</p>
                          <p className="text-lg font-bold">{selectedZone.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Algorithm</p>
                          <p className="text-lg font-bold">Gradient Boost</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Legend Sidebar */}
            {showLegend && (
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">LCZ Legend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {lczTypes.map(lcz => {
                        const Icon = lcz.icon;
                        return (
                          <div key={lcz.id} className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: lcz.color }}
                            />
                            <Icon className="h-3 w-3 text-gray-500" />
                            <span className="text-xs">
                              {lcz.id}: {lcz.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Upload TIF Option */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Upload GeoTIFF</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="file"
                      accept=".tif,.tiff"
                      className="text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log('TIF file selected:', file.name);
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload your classified Landsat 9 GeoTIFF for precise visualization
                    </p>
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
