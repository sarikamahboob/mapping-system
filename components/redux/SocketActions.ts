// import { GPX_SOCKET } from "@/app.config"
import { GPX_SOCKET } from "@/app.config"
import { updateVehicleBySocket } from "./SocketReducer"

declare global {
    interface Window {
        pusher: any,
        Pusher: any
    }
}


// export function activateGPXSocket() {
//     const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5nbWwuYmFyaWtvaW1hcHMuZGV2L2FwaS92MS9sb2dpbiIsImlhdCI6MTY4NjEyNDQ4NCwiZXhwIjoxNjg2MzQwNDg0LCJuYmYiOjE2ODYxMjQ0ODQsImp0aSI6Ill2WklkVmZFeXdLckVaWk0iLCJzdWIiOiI0NDQwIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.z0C4Npog0QgxSxZbMBgXOaFIMVda0k-lUn3DWfPB_sw`
//     // const user: any = localStorage.getItem('user')

//     return (dispatch: any,  getState: any) => {
//         window.Pusher.logToConsole = true

//         window.pusher = new window.Pusher(GPX_SOCKET.PUSHER_APP_KEY, {
//             cluster: GPX_SOCKET.PUSHER_APP_CLUSTER,
//             wsHost: GPX_SOCKET.WS_HOST,
//             wsPort: GPX_SOCKET.WS_PORT,
//             forceTLS: false,
//             authEndPoint: GPX_SOCKET.AUTH_ENDPOINT,
//             auth: {
//                 headers: {
//                   Authorization: `Bearer ${ token }`,
//                   Accept: 'application/json'
//                 }
//               }
//         })

//         console.log(`Socket Data`,GPX_SOCKET.CHANNEL, GPX_SOCKET.EVENT_GML_GPX)

//         window.pusher.subscribe(GPX_SOCKET.CHANNEL)
//         .bind(GPX_SOCKET.EVENT_GML_GPX, (data: any) => {
//             console.log({data})
//             const vehicleGpxData : any = data?.position ? JSON.parse(data?.position) : {}
//             // dispatch(updateVehicleBySocket([
//             //     {
//             //         ...vehicleGpxData,
//             //         id: vehicleGpxData?.user_id,
//             //         field_force_status: vehicleGpxData?.field_force_status ?? 'ONLINE'
//             //     }
//             // ]))
//           })
//           .bind("pusher:subscription_error", (error: any) => {
//             const { status } = error;
//             console.log("error on pusher: ",error)
//           })
//     }
// }




export function activateGPXSocket() {
    // Get Auth Token
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5nbWwuYmFyaWtvaW1hcHMuZGV2L2FwaS92MS9sb2dpbiIsImlhdCI6MTY4NjEyNDQ4NCwiZXhwIjoxNjg2MzQwNDg0LCJuYmYiOjE2ODYxMjQ0ODQsImp0aSI6Ill2WklkVmZFeXdLckVaWk0iLCJzdWIiOiI0NDQwIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.z0C4Npog0QgxSxZbMBgXOaFIMVda0k-lUn3DWfPB_sw`
    // const user: any = localStorage.getItem('user')

    return (dispatch: any, getState: any) => {

      window.Pusher.logToConsole = false

      window.pusher = new window.Pusher(GPX_SOCKET.PUSHER_APP_KEY, {
        cluster: GPX_SOCKET.PUSHER_APP_CLUSTER,
        wsHost: GPX_SOCKET.WS_HOST,
        wsPort: GPX_SOCKET.WS_PORT,
        forceTLS: false,
        authEndpoint: GPX_SOCKET.AUTH_ENDPOINT,
        auth: {
          headers: {
            Authorization: `Bearer ${ token }`,
            Accept: 'application/json'
          }
        }
      }) 
    
      // Task Channel
      window.pusher.subscribe(GPX_SOCKET.CHANNEL)
        .bind(GPX_SOCKET.EVENT_GML_GPX, (data: any) => {
          console.log(data)
          const vehicleGpxData: any = data?.position ? JSON.parse(data?.position) : {}
          console.log(vehicleGpxData)
          dispatch( updateVehicleBySocket([ 
            { 
              ...vehicleGpxData, 
              id: vehicleGpxData?.user_id,
              field_force_status: vehicleGpxData?.field_force_status ?? 'ONLINE'
            } 
          ]) )
        })
        .bind("pusher:subscription_error", (error: any) => {
          const { status } = error;
          console.log("error on pusher: ",status)
          if (status === 408 || status === 503) {
            // Retry?
          }
        })
    }
  }

  export function deactivateGPXSocket() {
    return () => {
        if(window.pusher){
            window.pusher.unsubscribe(GPX_SOCKET.CHANNEL)
            delete window.pusher
        }
    }
}
  