import { createSlice, current } from "@reduxjs/toolkit"
import { sortByDate, updateVehicleData } from "../utils"

const initialState = {
    vehicles: [{
        "user_id": 4913,
        "name": "TestUser",
        "latitude": "23.8237112",
        "longitude": "90.3640439",
        "altitude": "-33.79999923706055",
        "speed": "0.046653975",
        "bearing": "0.0",
        "gpx_time": "2023-06-07 15:52:18",
        "created_at": "2023-06-07 15:52:18",
        "updated_at": "2023-06-07 15:52:18",
        "active_status": 1
    }]
}

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        updateVehicleBySocket: (state, action) => {
            console.log(action.payload)
            state.vehicles = (updateVehicleData(current(state.vehicles), action.payload, 'user_id'))
            console.log( state.vehicles )
          },
    }
})



export const { updateVehicleBySocket } = socketSlice.actions
export default socketSlice.reducer