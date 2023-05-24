import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    zones: [],
    search_places: '',
    geoData: {}
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
  }
})

export const { setZones, setSearchPlaces, setGeoData } = commonSlice.actions
export default commonSlice.reducer