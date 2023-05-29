import { API } from "@/app.config"
import axios from "axios"
import { setGeoCodeData, setGeoData, setIsLoading, setReverseGeocodePlace, setSearchPlaces, setUcode, setUcodeData, setWktCoordinates, setZones } from "./commonReducer"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { message } from 'antd'
import { wktToPoint } from "../utils"

// Get Zones
export function getZones() {
    return (dispatch: any) => {
            axios.get(`${ API.GET_ZONES }`)
                .then(res => {
                    const data: any = res?.data?.data
                    if(data && data?.length){
                        const zones: any = data?.map((d: any, idx: any) => ({
                            ...d,
                            key: d?.id ?? idx,
                            zone_id: d?.id ?? '',
                            value: d?.id ?? '',
                            label: d?.name ?? '',
                            zone_name: d?.name ?? '',
                            geometry: JSON.parse(d?.geom) 
                        }))
                        dispatch( setZones(zones) )
                    } else {
                        dispatch( setZones([]) )
                    }
                    
                })
                .catch(err => {
                    console.error(err)
                    dispatch( setZones([]) )
                })
        }
    }


export const searchPlaces = createAsyncThunk('search/searchPlaces', async (data: any, { dispatch }) => {
    // Set Is Loading
    // dispatch( setIsLoading(true) )
    try {
        const res = await axios.get(`${ API.AUTOCOMPLETE }${ data }`)
        dispatch( setSearchPlaces(res.data.places) )
    } catch(err) {
        console.error(err)
        message.error({ content: 'Failed to get data !'})

    } finally {
        // dispatch( setIsLoading(false) )
    }
})

export const searchPlacesWthGeocode = createAsyncThunk('search/searchPlacesWithGeocode', async (data: any, { dispatch }) => {
    const {lat, lng } = data
    try {
        const res = await axios.get(`${ API.REVERSE_GEO }longitude=${ lng }&latitude=${ lat }&district=true&post_code=true&country=true&sub_district=true&union=true&pauroshova=true&location_type=true&division=true&address=true&area=true&bangla=true`)
        dispatch( setGeoCodeData(res?.data) )
    } catch(err) {
        console.error(err)
        // message.error({ content: 'Failed to get data !'})

    } finally {
        // dispatch( setIsLoading(false) )
    }
})

export const searchPlacesWthUcode = createAsyncThunk('search/searchPlacesWithGeocode', async (data: any, { dispatch }) => {
    const {lat, lng } = data
    try {
        const res = await axios.get(`${ API.REVERSE_GEO_URL }latitude=${ lat }&longitude=${ lng }`)
        console.log(res)
        dispatch( setUcodeData(res?.data) )
    } catch(err) {
        console.error(err)
        // message.error({ content: 'Failed to get data !'})

    } finally {
        // dispatch( setIsLoading(false) )
    }
})

export const searchPlaceByUcode = createAsyncThunk('search/searchPlaceByUcode', async (data: any, { dispatch }) => {

    try {
        const res = await axios.get(`https://api.bmapsbd.com/place/${data}`)
        console.log(res?.data)
        dispatch( setUcode(res?.data) )
    } catch(err) {
        console.error(err)
        // message.error({ content: 'Failed to get data !'})

    } finally {
        // dispatch( setIsLoading(false) )
    }
})

export const wktToJson = createAsyncThunk('wkt/wktToJson', async (_, { dispatch }) => {

    try {
        const res = await axios.get(`${ API.WKT_URL }`)
        const data = res?.data?.data
        const tranformedData: any = data?.map((item:any, index: number)=> ({
            ...item,
            id: item?.id ?? index,
            coordinates: item?.start_point ? (wktToPoint(item?.start_point)) : '',
            longitude: item?.start_point ? wktToPoint(item?.start_point)[0] : '',
            latitude: item?.start_point ? wktToPoint(item?.start_point)[1] : '',
        }))
        dispatch( setWktCoordinates(tranformedData) )
    } catch(err) {
        console.error(err)
        // message.error({ content: 'Failed to get data !'})

    } finally {
        // dispatch( setIsLoading(false) )
    }
})


export const handleDistance = createAsyncThunk('search/searchPlaces', async (data:any, { dispatch }) => {
    const {selectLocationFrom, selectLocationTo} = data
    // Set Is Loading
    dispatch( setIsLoading(true) )
    try {
        const res = await axios.get(`https://geoserver.bmapsbd.com/gh/route?point=${selectLocationFrom.latitude},${selectLocationFrom.longitude}&point=${selectLocationTo.latitude},${selectLocationTo.longitude}&locale=en-us&elevation=false&profile=car&optimize=%22true%22&use_miles=false&layer=Barikoi&points_encoded=false`)
        dispatch(setGeoData(res?.data))
    } catch(err) {
        console.error(err)
        message.error({ content: 'Failed to get data !'})
    } finally {
        dispatch( setIsLoading(false) )
    }
})