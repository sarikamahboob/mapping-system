import React, { useEffect, useRef, useState } from 'react'
import { IconLayer, GeoJsonLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers/typed'
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed'
import { Map, Popup, FullscreenControl, useControl, Marker  } from 'react-map-gl'
import maplibregl from 'maplibre-gl';
import { LOCAL_BASE_URL, MAP_API_ACCESS_TOKEN, MAP_CONFIG, URL } from '@/app.config';
import * as pmtiles from "pmtiles";
import { Protocol } from 'pmtiles';
import { bbox } from '@turf/turf';
import { setReverseGeocodePlace } from '../redux/commonReducer';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { searchPlaceByUcode, searchPlacesWthGeocode, searchPlacesWthUcode, wktToJson } from '../redux/commonAction';
import { Typography } from 'antd';
import { API } from '@/app.config';
import { useRouter } from 'next/router';
import axios from 'axios';

// DeckGL Overlay
const DeckGLOverlay: any = (props: MapboxOverlayProps & { interleaved?: boolean }) => {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props))
  overlay.setProps(props)
  return null
}

// import constants
const {Paragraph} = Typography

const MainMap = ({geoData, geoJsonData, markerData}:any) => {
  const mapRef: any = useRef()
  const map = mapRef.current
  const router = useRouter();
  const dispatch = useAppDispatch()

  const lat = router?.query?.latitude
  const lng = router?.query?.longitude
  const uCode = router?.query?.place
  
  const geoCodeData: any = useAppSelector(state => state?.common?.geoCodeData ?? null)
  const wktCoordiantesData: any = useAppSelector(state => state?.common?.wktCoordinates ?? null)
  const uCodeData: any = useAppSelector(state => state?.common?.uCodeData ?? null)
  const uCodeOnly: any = useAppSelector(state => state?.common?.uCode ?? null)

  const uCodeMain: any = (uCodeData?.length > 0) ? uCodeData[0]?.uCode : ''
  const uCodeLat: any = (uCodeData?.length > 0) ? uCodeData[0]?.latitude : ''
  const uCodeLng: any = (uCodeData?.length > 0) ? uCodeData[0]?.longitude : ''


  const [popupInfo, setPopupInfo]:any = useState(false)
  const [wktPopupInfo, setWktPopupInfo]:any = useState(false)
  const [geoPopupInfo, setGeoPopupInfo]:any = useState(false)
  const [marker, setMarker]:any = useState(false)
  const [uCodeMarker, setUcodeMarker]:any = useState(false)
  const [reverseGeo, setReverseGeo] = useState(false)


  const _onMarkerClick = (info: any, e: any) => {
    setPopupInfo(info)
  }
  const _onMarkerWktClick = (info: any, e: any) => {
    setPopupInfo(null)
    setGeoPopupInfo(null)
    setWktPopupInfo(info)
   }
  const _onClosePopup = () => {
    setPopupInfo(null)
    setGeoPopupInfo(null)
    setWktPopupInfo(null)
  }

    const layers = [
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
        }),
        new ScatterplotLayer({
          id: 'scatterplot-layer',
          data: wktCoordiantesData,
          pickable: true,
          opacity: 0.8,
          stroked: true,
          filled: true,
          radiusScale: 1000,
          radiusMinPixels: 1,
          radiusMaxPixels: 100,
          lineWidthMinPixels: 1,
          getPosition: (d:any) => d.coordinates,
          getRadius: d => Math.sqrt(d.exits),
          getFillColor: d => [255, 140, 0],
          getLineColor: d => [0, 0, 0],
          onClick: (info, event) => _onMarkerWktClick(info, event)
        }),
        new IconLayer({
          id: 'IconLayer',
          data: markerData,
          getColor: d => [ 219, 0, 91],
          getIcon: d => ({
            url: d?.iconUrl,
            width: 20,
            height: 20,
            anchorY: 10,
            zIndex: 1200
          }),
          getPosition: d => [ +d?.longitude, +d?.latitude ],
          getSize: d => 5,
          sizeScale: 8,
          pickable: true,
          lineWidthScale: 20,
          lineWidthMinPixels: 2,
          onClick: (info, event) => _onMarkerClick(info, event)
      }),
    ]

    // Fitbounds
  const _onFitBounds = (data:any, jsonData:any) => {
    const map: any = mapRef.current
    if(data) {
        const geoJsonPoints: any = {
          type: 'FeatureCollection',
          features: []
      }
      data?.forEach((d: any) => {
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
              [ minLng , minLat ],
              [ maxLng , maxLat ]
          ],
          { 
              padding: 100, 
              duration: 1000 
          }
        )
      }
      return 
    }
    if(jsonData){
    const [ minLng, minLat, maxLng, maxLat ]: any = bbox(jsonData)

    if(map && map !== null){
        map?.fitBounds(
          [
              [ minLng , minLat ],
              [ maxLng , maxLat ]
          ],
          { 
              padding: 100, 
              duration: 1000 
          }
      )
    }
    }

    // const geoJsonPoints: any = {
    //     type: 'FeatureCollection',
    //     features: []
    // }

    // data?.forEach((d: any) => {
    //   geoJsonPoints?.features?.push({
    //           type: "Feature",
    //           geometry: {
    //               type: "Point",
    //               coordinates: [d?.longitude, d?.latitude]
    //         }
    //       })
    //   })

    // const [ minLng, minLat, maxLng, maxLat ]: any = bbox(jsonData)

    // if(map && map !== null){
    //     map?.fitBounds(
    //       [
    //           [ minLng || geoData?.paths[0]?.bbox[0], minLat || geoData?.paths[0]?.bbox[1] ],
    //           [ maxLng || geoData?.paths[0]?.bbox[2], maxLat || geoData?.paths[0]?.bbox[3] ]
    //       ],
    //       { 
    //           padding: 100, 
    //           duration: 1000 
    //       }
    //   )
    // }
  }
  
  
  const handleClick = (e:any) => {
    setReverseGeo(true)
    setMarker(e?.lngLat)
    const lat = e?.lngLat?.lat
    const lng = e?.lngLat?.lng
    const data = {lat, lng}
    dispatch(searchPlacesWthGeocode(data))
    dispatch(searchPlacesWthUcode(data))
  }

  const handleMarkerDrag = (e:any) => {
      setReverseGeo(true)
      setMarker(e?.lngLat)
      const lat = e?.lngLat?.lat
      const lng = e?.lngLat?.lng
      const data = {lat, lng}
      dispatch(searchPlacesWthGeocode(data))  
  };

  useEffect(()=> {
    _onFitBounds(markerData, geoJsonData)
  }, [ geoData, markerData, geoJsonData ])

  useEffect(()=>{
    dispatch(searchPlacesWthGeocode({lat, lng}))
    dispatch(searchPlaceByUcode(uCode))
    console.log(uCode)
  }, [lat, lng, uCode])

  // useEffect(()=>{
  //   if((!reverseGeo) && lat && lng){
  //     setMarker({lat, lng})
  //     map.flyTo({
  //       center: [lng, lat],
  //       zoom: 16,
  //       speed: 1.2,
  //       curve: 1.42,
  //       easing: (t:any) => t,
  //     });
  //   }
  // }, [geoCodeData, lat, lng, reverseGeo])

  const uCodeOnlyLng = uCodeOnly?.longitude ?  uCodeOnly?.longitude : ''
  const uCodeOnlyLat = uCodeOnly?.latitude ? uCodeOnly?.latitude : ''
  const latNdLng = {uCodeOnlyLng, uCodeOnlyLat}


  useEffect(()=>{
    if(uCodeOnlyLng && uCodeOnlyLat){
      setUcodeMarker(latNdLng)
      map.flyTo({
        center: [uCodeOnlyLng, uCodeOnlyLat],
        zoom: 16,
        speed: 1.2,
        curve: 1.42,
        easing: (t:any) => t,
      });
    }
  }, [uCodeOnlyLng, uCodeOnlyLat])

  useEffect(()=>{
    dispatch(wktToJson())
  }, [])



  


  return (
    <div>
      <Map initialViewState={{
        longitude: 90.39017821904588,
        latitude: 23.719800220780733,
        zoom: 12
        }}
        style={{ width: '100%', height: 580 }} 
        // mapStyle={ MAP_CONFIG.STYLES[1].uri }
        ref={mapRef}
        mapLib={maplibregl} 
        onClick={handleClick}
        mapStyle={ `data.json` }
        >
          {
            marker && 
            <Marker 
              longitude={marker?.lng} 
              latitude={marker?.lat} 
              anchor="bottom" 
              draggable={true} 
              onDrag={handleMarkerDrag} 
              onClick={ () => setGeoPopupInfo(marker) }
            >
              <img src="/parking-logo-green.png" width="30px" />
            </Marker>
          }
          {
            uCodeMarker && 
            <Marker 
              longitude={uCodeMarker?.uCodeOnlyLng} 
              latitude={uCodeMarker?.uCodeOnlyLat} 
              anchor="bottom" 
              draggable={true} 
              onDrag={handleMarkerDrag} 
              onClick={ () => setGeoPopupInfo(marker) }
            >
              <img src="/parking-logo-green.png" width="30px" />
            </Marker>
          }
          {
            geoPopupInfo && 
            <Popup 
            longitude={Number(geoPopupInfo?.lng) ?? -100}
            latitude={Number(geoPopupInfo?.lat) ?? 40}
            anchor="bottom"
            closeOnClick={false}
            onClose={ _onClosePopup }
            >  
              <Paragraph 
              copyable={{ text: `${ LOCAL_BASE_URL }?longitude=${ geoPopupInfo?.lng }&latitude=${ geoPopupInfo?.lat }` }}
              >
                {geoCodeData?.place?.address}
              </Paragraph>
            </Popup>
          }
          {
            geoPopupInfo && 
            <Popup 
            longitude={Number(geoPopupInfo?.lng) ?? -100}
            latitude={Number(geoPopupInfo?.lat) ?? 40}
            anchor="bottom"
            closeOnClick={false}
            onClose={ _onClosePopup }
            >  
              <Paragraph 
              copyable={{ text: `${ LOCAL_BASE_URL }?place=${uCodeMain}` }}
              >
                {geoCodeData?.place?.address}
              </Paragraph>
            </Popup>
          }
          {
            wktPopupInfo && 
            <Popup
            longitude={Number(wktPopupInfo?.object?.longitude) ?? -100}
            latitude={Number(wktPopupInfo?.object?.latitude) ?? 40}
            anchor="bottom"
            closeOnClick={false}
            onClose={ _onClosePopup }>
              {wktPopupInfo?.object?.name}
            </Popup>
          }
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