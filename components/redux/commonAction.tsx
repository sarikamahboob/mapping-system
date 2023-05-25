import { API } from "@/app.config"
import axios from "axios"
import { setGeoData, setIsLoading, setSearchPlaces, setZones } from "./commonReducer"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { message } from 'antd'

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