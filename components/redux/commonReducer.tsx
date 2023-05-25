import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    zones: [],
    search_places: [],
    geoData: {},
    isLoading: false
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
    }
  }
})

export const { setZones, setSearchPlaces, setGeoData, setIsLoading } = commonSlice.actions
export default commonSlice.reducer