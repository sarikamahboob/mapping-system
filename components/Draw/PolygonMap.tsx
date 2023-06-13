import React, { useEffect, useRef, useState } from 'react'
import { Map, Popup, FullscreenControl, Marker } from 'maplibre-gl'
import { MAP_CONFIG } from '@/app.config'

const PolygonMap = () => {
  const mapContainer : any = useRef()
  const map : any = useRef()

  // States
  const [ lng ]: any = useState(90.39017821904588)
  const [ lat ]: any = useState(23.719800220780733)
  const [ zoom ]: any = useState(8)
  const [ renderedMarkers, setRenderedMarker ]: any = useState([])

  // Resize Map
  const _onMapResize = (mapRef: any) => {
    const map: any = mapRef.current

      if(map && map !== null){
          map.resize()
      }
  }
  // Distroy Map
  const _onDistroyMap = () => {
      // _onRemoveGeojson(renderedGeojson)
      // _onRemovePoints(renderedPoints)
      setRenderedMarker([])
  }

  useEffect(() => {
      if (map.current) return //stops map from intializing more than once
      map.current = new Map({
          container: mapContainer.current,
          style: MAP_CONFIG.STYLES[1].uri,
          center: [lng, lat],
          zoom: zoom,
          doubleClickZoom: false
      })

      map.current.addControl(new FullscreenControl({}), 'top-right')
      _onMapResize(map)
      return () => { 
          _onDistroyMap() 
      }
  }, [])

  return (
    <div>
      <div ref={ mapContainer } style={ containerStyles } />
    </div>
  )
}

const containerStyles = {
  boxSizing: 'border-box' as 'border-box',
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  minHeight: '500px',
  overflow: 'hidden',
  border: '1px solid #dcdcdc',
  borderRadius: '4px',
  display: 'flex',
  flex: 1
}

export default PolygonMap