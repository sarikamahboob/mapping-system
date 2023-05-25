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

const MainMap = ({geoData, geoJsonData, markerData}:any) => {
  const mapRef: any = useRef()
  const map = mapRef.current

  const [showPopupFrom, setShowPopupFrom] = useState(false)
  const [showPopupTo, setShowPopupTo] = useState(false)
  const [popupInfo, setPopupInfo]:any = useState(false)

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

  const _onMarkerClick = (info: any, e: any) => {
        setPopupInfo(info)
        console.log(popupInfo)
    }

    const _onClosePopup = () => {
        setPopupInfo(null)
    }

    const layers = [
        new IconLayer({
            id: 'IconLayer',
            data: markerData,
            getColor: d => [ 219, 0, 91],
            getIcon: d => ({
              url: d?.iconUrl,
              width: 30,
              height: 30,
              anchorY: 10,
              zIndex: 1200
            }),
            getPosition: d => [ +d?.longitude, +d?.latitude ],
            getSize: d => 5,
            sizeScale: 8,
            pickable: true,
            onClick: (info, event) => _onMarkerClick(info, event)
        }),
        new GeoJsonLayer({
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
            getLineColor: [ 219, 0, 91],
            getPointRadius: 100,
            getLineWidth: 1,
            getElevation: 30
        })
    ]

    // Fitbounds
  const _onFitBounds = () => {
    const map: any = mapRef.current

    const geoJsonPoints: any = {
        type: 'FeatureCollection',
        features: []
    }

    markerData?.forEach((d: any) => {
      geoJsonPoints?.features?.push({
              type: "Feature",
              geometry: {
                  type: "Point",
                  coordinates: [d?.longitude, d?.latitude]
            }
          })
      })


    const [ minLng, minLat, maxLng, maxLat ]: any = bbox(geoJsonPoints)

    if(map && map !== null){
        map?.fitBounds(
          [
              [ minLng || geoData?.paths[0]?.bbox[0], minLat || geoData?.paths[0]?.bbox[1] ],
              [ maxLng || geoData?.paths[0]?.bbox[2], maxLat || geoData?.paths[0]?.bbox[3] ]
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
  }, [ geoData, markerData ])

  return (
    <div>
      <Map initialViewState={{
        longitude: 90.39017821904588,
        latitude: 23.719800220780733,
        zoom: 12
        }}
        style={{ width: '100%', height: 580 }} 
        mapStyle={ MAP_CONFIG.STYLES[1].uri }
        ref={mapRef}
        mapLib={maplibregl} >
          {
            popupInfo && 
            <Popup 
            longitude={Number(popupInfo?.object?.longitude) ?? -100}
            latitude={Number(popupInfo?.object?.latitude) ?? 40}
            anchor="bottom"
            closeOnClick={false}
            onClose={ _onClosePopup }
            >  
              {popupInfo?.object?.value}
            </Popup>
          }
          <DeckGLOverlay layers={[...layers]} />
      </Map>
    </div>
  )
}

export default MainMap