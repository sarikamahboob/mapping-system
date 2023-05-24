import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    zones: [],
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setZones: (state, action) => {
      state.zones = action.payload
    },
  }
})

export const { setZones } = commonSlice.actions
export default commonSlice.reducer