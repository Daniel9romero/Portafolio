DOCUMENTOS DEL PROYECTO LCZ - ZONAS CLIMATICAS LOCALES CDMX
============================================================

Este folder contiene los archivos originales y de referencia del proyecto
de clasificacion de Zonas Climaticas Locales para la Ciudad de Mexico.

REPOSITORIO DEL PROYECTO:
https://github.com/Daniel9romero/LZCmap

URL DEL SITIO DESPLEGADO:
https://daniel9romero.github.io/LZCmap/

CONTENIDO DE ESTA CARPETA:
--------------------------

1. LCZ_CDMX_L9_Clasificacion_2023_2025_17clases.tif
   - Archivo GeoTIFF original con la clasificacion completa (17 clases)
   - Resolucion: 30 metros
   - Fuente: Landsat 9 OLI-2 TIRS-2

2. LCZMap.tsx
   - Componente principal del mapa interactivo
   - Incluye toda la logica de visualizacion del GeoTIFF con Leaflet

3. InteractiveLCZMap.tsx
   - Version simplificada del mapa con puntos de ejemplo

4. lcz-fotos/
   - Imagenes representativas de cada clase LCZ
   - LCZ1.jpg a LCZ9.jpg (urbanas)
   - LCZA.png a G.jpg (naturales)

5. congreso-cima-2025/
   - Fotos de la presentacion en el Congreso CIMA 2025

DATOS DEL PROYECTO:
-------------------
- Precision: 83.65%
- Kappa: 0.824
- Algoritmo: Gradient Tree Boost
- Plataforma: Google Earth Engine
- Periodo: Dic 2023 - Abr 2025
- Area: 2,226 km2
- Clases: 16 (9 urbanas + 7 naturales)
