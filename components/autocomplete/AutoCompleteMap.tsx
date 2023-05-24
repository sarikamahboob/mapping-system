import React, { useEffect, useRef, useState } from 'react'
import { IconLayer, GeoJsonLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers/typed'
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed'
import { Map, Popup, FullscreenControl, useControl, Marker  } from 'react-map-gl'
import maplibregl from 'maplibre-gl';
import { MAP_CONFIG } from '@/app.config';
import * as pmtiles from "pmtiles";
import { Protocol } from 'pmtiles';
import { bbox } from '@turf/turf';
import { useAppDispatch, useAppSelector } from '../redux/store';

// DeckGL Overlay
const DeckGLOverlay: any = (props: MapboxOverlayProps & { interleaved?: boolean }) => {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props))
  overlay.setProps(props)
  return null
}

const AutoCompleteMap = ({selectLocationFrom, selectLocationTo}:any) => {
  const mapRef: any = useRef()
  const map = mapRef.current
  const geoData: any = useAppSelector( state => state?.common?.geoData ?? '')
  const geoJsonData:any = geoData?.paths?.length > 0 ?  geoData?.paths[0]?.points : null
  console.log(geoData)

  // if(selectLocationFrom){
  //   map.flyTo({
  //     center: [selectLocationFrom?.longitude, selectLocationFrom?.latitude],
  //     zoom: 16,
  //     speed: 1.2,
  //     curve: 1.42,
  //     easing: (t:any) => t,
  //   });
  // }
  // if(selectLocationTo){
  //   map.flyTo({
  //     center: [selectLocationTo?.longitude, selectLocationTo?.latitude],
  //     zoom: 16,
  //     speed: 1.2,
  //     curve: 1.42,
  //     easing: (t:any) => t,
  //   });
  // }

    const layer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonData,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: 'circle',
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: [160, 160, 180, 200],
    getLineColor: [ 255, 0, 0, 250 ],
    getPointRadius: 100,
    getLineWidth: 1,
    getElevation: 30
    })

    // Fitbounds
  const _onFitBounds = () => {
    const map: any = mapRef.current

    if(map && map !== null){
        map.fitBounds(
            [
                [ geoData?.paths[0]?.bbox[0], geoData?.paths[0]?.bbox[1] ],
                [ geoData?.paths[0]?.bbox[2], geoData?.paths[0]?.bbox[3] ]
            ],
            { 
                padding: 100, 
                duration: 1000 
            }
        )
    }
  }
  
  useEffect(()=> {
    _onFitBounds()
  }, [])


  return (
    <div>
      <Map initialViewState={{
        longitude: 90.39017821904588,
        latitude: 23.719800220780733,
        zoom: 12
        }}
        style={{width: '100%', height: 700}} 
        mapStyle={ MAP_CONFIG.STYLES[1].uri }
        ref={mapRef}
        mapLib={maplibregl} >
          {selectLocationFrom && (
            <Marker
              longitude={Number(selectLocationFrom?.longitude)}
              latitude={Number(selectLocationFrom?.latitude)}
              anchor="bottom"
            >
              <img src="marker.png" alt="" width={30}/>
            </Marker>
          )}
          {selectLocationTo && (
            <Marker
              longitude={Number(selectLocationTo?.longitude)}
              latitude={Number(selectLocationTo?.latitude)}
              anchor="bottom"
            >
              <img src="parking-logo-green.png" alt="" width={30}/>
            </Marker>
          )}
          <DeckGLOverlay layers={layer} 
          // getTooltip={({object}:any) => object && `${object.name}\n${object.address}`} 
          />
      </Map>
    </div>
  )
}

export default AutoCompleteMap