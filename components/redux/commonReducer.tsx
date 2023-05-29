import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    zones: [],
    search_places: [],
    geoData: {},
    isLoading: false,
    reverseGeocodePlace: {},
    geoCodeData: null,
    wktCoordinates: null,
    uCodeData: null,
    uCode: null
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setZones: (state, action) => {
      state.zones = action.payload
    },
    setSearchPlaces: (state, action) => {
      state.search_places = action.payload
    },
    setGeoData: (state, action) => {
      state.geoData = action.payload
    },
    setIsLoading: (state, action) => {  
      state.isLoading = action.payload
    },
    setReverseGeocodePlace: (state, action) => {  
      state.reverseGeocodePlace = action.payload
    },
    setGeoCodeData: (state, action) => {  
      state.geoCodeData = action.payload
    },
    setWktCoordinates : (state, action) => {  
      state.wktCoordinates = action.payload
    },
    setUcodeData : (state, action) => {  
      state.uCodeData = action.payload
    },
    setUcode : (state, action) => {  
      state.uCode = action.payload
    },
  }
})

export const { setZones, setSearchPlaces, setGeoData, setIsLoading, setReverseGeocodePlace, setGeoCodeData, setWktCoordinates, setUcodeData, setUcode } = commonSlice.actions
export default commonSlice.reducer