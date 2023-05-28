import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IconLayer, GeoJsonLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers/typed'
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed'
import { Map, Popup, FullscreenControl, useControl, Marker  } from 'react-map-gl'
import maplibregl from 'maplibre-gl';
import { MAP_CONFIG } from '@/app.config';
import * as pmtiles from "pmtiles";
import { Protocol } from 'pmtiles';
import { bbox } from '@turf/turf';
import { useAppDispatch, useAppSelector } from '../redux/store';
import MainMap from './MainMap';

// DeckGL Overlay
const DeckGLOverlay: any = (props: MapboxOverlayProps & { interleaved?: boolean }) => {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props))
  overlay.setProps(props)
  return null
}

const AutoCompleteMap = ({selectLocationFrom, selectLocationTo, setSelectLocationFrom, setSelectLocationTo}:any) => {

  const geoData: any = useAppSelector( state => state?.common?.geoData ?? '')

  const geoJsonData:any = geoData?.paths?.length > 0 ?  geoData?.paths[0]?.points : null
  let markerIcon;
  let markerData:any;

  if(!selectLocationFrom && !selectLocationTo){
    markerIcon = [] 
  }
  else{
    markerData = [selectLocationFrom, selectLocationTo] 
  }
  markerIcon = useMemo(()=> {
    return markerData?.map ((marker:any)=> ({
    ...marker,
    iconUrl: (marker?.pointType === 'From') ? '/marker.png' : '/parking-logo-green.png' 
  }))

  }, [markerData])
  

  return (
    <div>
      <MainMap 
        setSelectLocationFrom={setSelectLocationFrom} 
        setSelectLocationTo={setSelectLocationTo} 
        markerData={markerIcon}
        geoData={geoData}
        geoJsonData={geoJsonData}
      />
    </div>
  )
}

export default AutoCompleteMap