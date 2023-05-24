import { API } from "@/app.config"
import axios from "axios"
import { setSearchPlaces, setZones } from "./commonReducer"

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

//Autocomplete API
export const searchPlaces = (text:string) => async (dispatch:any) => {
    try {
      const res = await axios.get(
        `https://api.bmapsbd.com/search/autocomplete/web?search=${text}`
      );
      dispatch(setSearchPlaces(res.data.places))
    } catch (err) {
      console.error(err);
    }
  };