import React, { useEffect, useRef, useState } from 'react'
import { IconLayer, GeoJsonLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers/typed'
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed'
import { Map, Popup, FullscreenControl, useControl, Marker  } from 'react-map-gl'
import maplibregl from 'maplibre-gl';
import { MAP_API_ACCESS_TOKEN, MAP_CONFIG } from '@/app.config';
import { getJsonData } from './utils';
import { useAppDispatch, useAppSelector } from './redux/store';
import { getZones } from './redux/commonAction';
import * as pmtiles from "pmtiles";
import { Protocol } from 'pmtiles';
import { bbox } from '@turf/turf';
import axios from 'axios';

// let protocol = new pmtiles.Protocol();
// maplibregl.addProtocol("pmtiles",protocol.tile);

// DeckGL Overlay
const DeckGLOverlay: any = (props: MapboxOverlayProps & { interleaved?: boolean }) => {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props))
  overlay.setProps(props)
  return null
}

const data = [
  { name: 'Colma (COLM)', address: '365 D Street, Colma CA 94014', position: [90.412, 23.810], color: [255, 0, 0], size: 50, icon: '/images/marker.png', },
  { name: 'Colma', address: '365 D Street,', position: [89.235, 24.363], color: [0, 255, 0], size: 50, icon: '/images/marker.png' },
  { name: 'Ola', address: 'Mola', position: [91.813, 21.426], color: [0, 0, 255], size: 80, icon: '/images/marker.png' },
  { name: 'TOla', address: 'TMola', position: [92.412, 24.810], color: [255, 0, 0], size: 50, icon: '/images/marker.png' },
  { name: 'POla', address: 'PMola', position: [83.235, 25.363], color: [0, 255, 0], size: 50, icon: '/images/marker.png' },
  { name: 'OOla', address: 'OMola', position: [94.813, 22.426], color: [0, 0, 255], size: 80, icon: '/images/marker.png' },
  // Add more points...
];

const DeckGlMap = () => {

   // Redux Data
   const zones: any = useAppSelector( state => state?.common?.zones ?? [])
   const vehicles: any = useAppSelector(state => state?.socket?.vehicles ?? [])
   const dispatch = useAppDispatch();
  
  // States
  const [ popupInfo, setPopupInfo ]: any = useState(null)
  const [showPopup, setShowPopup] = useState(true);
  const [ geoJsonData, setGeoJsonData ] = useState([])


  

  // Refs
  const mapRef = useRef(null)

  // Get Icon Based On Type
  const _onGetIconUrl = (type: any) => {
      let url: any = 'marker.png'
      return url
  }

  // On Marker Click
  const _onMarkerClick = (info: any, e: any) => {
    const tapCount: any = e?.tapCount ?? 0
    if(tapCount === 2){
        _onDoubleClick(info, e)
    } else if (tapCount === 1) {
        _onSingleClick(info, e)
    }
  }
    // On Single Click on Marker
    const _onSingleClick = (info: any, e: any) => {
      setPopupInfo(info)
  }

  // On Double Click on Marker
  const _onDoubleClick = (info: any, e: any) => {
      setPopupInfo(null)
      // onIconDoubleClick && onIconDoubleClick(info, e)
  }

  // On Hovering Over Layers
  const _onHoverLayers = (d: any) => {
      setPopupInfo(d)
  }

  const layers = [
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 20,
      radiusMinPixels: 1,
      radiusMaxPixels: 200,
      lineWidthMinPixels: 1,
      getPosition: (d) => d.position,
      getFillColor: (d) => d.color,
      getRadius: (d) => Math.sqrt(d.exits),
      getLineColor: d => [0, 0, 0],
      onHover: (d) => _onHoverLayers(d)
    }),
    new IconLayer({
      id: 'IconLayer',
      data,
      getColor: d => [Math.sqrt(d.exits), 140, 0],
      getIcon: d => 'marker',
      getPosition: d => d.position,
      getSize: d => 5,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: {
        marker: {
          x: 0,
          y: 0,
          width: 128,
          height: 128,
          anchorY: 128,
          mask: true
        }
      },
      sizeScale: 8,
      pickable: true,
      onClick: (info, event) => _onMarkerClick(info, event)
    }),
    new GeoJsonLayer({
      id: 'GeoJsonLayer',
      data: geoJsonData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      pointType: 'circle+text',
      lineWidthScale: 1,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 4,
      getFillColor: (d) => d?.properties?.fillColor ?? [ 220, 20, 60, 100 ],
      getLineColor: (d) => d?.properties?.lineColor ?? [ 255, 0, 0, 250 ],
      getPointRadius: 2000,
      getLineWidth: (d) => d?.properties?.linWidth ?? 4,
      getElevation: (d) => d?.properties?.elevation ?? 0,
      wireframe: true,
      onHover: (d) => _onHoverLayers(d),
      getTextColor: (d) => d?.properties?.textColor ?? [ 0, 0, 0, 255 ],
      getTextPixelOffset: [ 0, 24 ],
      textSizeMaxPixels: 24,
      textSizeUnits: 'pixels'
    })
  ]

  // Fitbounds
  const _onFitBounds = () => {
      const map: any = mapRef.current

      if (!geoJsonData || geoJsonData?.length <= 0){
          return
      }

      const geoJson: any = {
          type: 'FeatureCollection',
          features: []
      }

      geoJsonData.forEach((d: any) => {
          geoJson.features.push({
              type: "Feature",
              geometry: d?.geometry,
          })
      })

      const [ minLng, minLat, maxLng, maxLat ]: any = bbox(geoJson)

      if(map && map !== null){
          map.fitBounds(
              [
                  [ minLng, minLat ],
                  [ maxLng, maxLat ]
              ],
              { 
                  padding: 100, 
                  duration: 1000 
              }
          )
      }
  }

  const _onSetGeoJsonData = (data: any) => { 
      setGeoJsonData( getJsonData(data) )
  }

  // Close Popup
  const _onClosePopup = () => {
      setPopupInfo(null)
  }

  

  useEffect(()=>{
    dispatch(getZones())
  }, [])

  useEffect(() => {
      _onSetGeoJsonData(zones)
      _onFitBounds()
  }, [ zones ])


  return (
    <div>
        <Map initialViewState={{
        longitude: 90.39017821904588,
        latitude: 23.719800220780733,
        zoom: 12
        }}
        style={{width: '100%', height: 700}}
        mapStyle={ `https://map.barikoi.com/styles/osm-liberty/style.json?key=${MAP_API_ACCESS_TOKEN}` } 
        // mapStyle={ MAP_CONFIG.STYLES[1].uri }
        ref={mapRef}
        mapLib={maplibregl} >
          {/* {
            data.map((i:any)=>(
              <Marker longitude={i?.position[0]} latitude={i?.position[1]} anchor="bottom" onClick={()=> setShowPopup(true)}>
                <img src="marker.png" alt="" width="20px"/>
              </Marker>
            ))
          }
             {
              showPopup && 
              data.map((i:any)=>(
              <Popup 
                longitude={ i?.position[0] ?? -100 } 
                latitude={  i?.position[1] ?? 40 }
                anchor="bottom"
                closeOnClick={false}
                onClose={ () => setShowPopup(false) }
                style={{ zIndex: 1000 }}
              >
                  <span style={{ fontWeight: 600 }}>{i?.name}</span>
              </Popup>
              ))
            }
            {
              popupInfo?.object?.zone_name &&  
              <Popup 
              longitude={ popupInfo?.coordinate[0] ?? -100 } 
              latitude={  popupInfo?.coordinate[1] ?? 40 }
              anchor="bottom"
              closeOnClick={false}
              onClose={ () => setShowPopup(false) }
              style={{ zIndex: 1000 }}
            >
                <span style={{ fontWeight: 600 }}>{popupInfo?.object?.zone_name}</span>
            </Popup>
            }
            {
              vehicles && vehicles.map((item:any)=> (
                <Marker longitude={item?.longitude} latitude={item?.latitude} anchor="bottom" onClick={()=> setShowPopup(true)}>
                  <img src="marker.png" alt="" width="20px"/>
                </Marker>
              ))
            }
          <DeckGLOverlay layers={[...layers]} 
          // getTooltip={({object}:any) => object && `${object.name}\n${object.address}`} 
          /> */}
        </Map>
    </div>
  )
}

export default DeckGlMap