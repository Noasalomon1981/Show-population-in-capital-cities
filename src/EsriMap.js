import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

const EsriMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    loadModules(['esri/Map', 'esri/views/MapView', 'esri/widgets/Zoom', 'esri/layers/FeatureLayer', 'esri/widgets/Popup'], { css: true })
      .then(([Map, MapView, Zoom, FeatureLayer,Popup]) => {
        const map = new Map({
          basemap: 'streets-vector'
        });

        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [34.8516, 31.0461],
          zoom: 7
        });

       
          const popup = new Popup({
            view: view
          });
  
          view.ui.add(popup, 'top-right');

        const featureLayer = new FeatureLayer({
          url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Cities/FeatureServer/0',
          outFields: ['CITY_NAME ', 'POP'],
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-marker',
              color: 'red'
            }
          }
        });

        map.add(featureLayer);

        view.on('click', (event) => {
            
          view.hitTest(event).then((response) => {
            const feature = response.results[0].graphic;
            console.log(feature.attributes.CITY_NAME);
            console.log(feature.attributes.POP);
            if (feature) {
              view.popup.open({
                title: feature.attributes.CITY_NAME,
                content: `Population: ${feature.attributes.POP}`,
                location: feature.geometry
              });
            }
          });
        });
      })
      .catch((err) => {
        console.error('Error loading Esri modules:', err);
      });
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default EsriMap;