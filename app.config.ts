// // Base URL
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export const MAP_API_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAP_API_ACCESS_TOKEN || ''

export const SEARCH_URL = process.env.NEXT_PUBLIC_BASE_URL_SEARCH || ''

export const PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || ''

export const PUSHER_APP_SECRET = process.env.NEXT_PUBLIC_PUSHER_APP_SECRET || ''

export const WS_HOST = process.env.NEXT_PUBLIC_WS_HOST || ''

export const LOCAL_BASE_URL = 'http://localhost:3000' || ''

export const URL = process.env.NEXT_PUBLIC_URL || ''

// API Routes
export const API = {
  GET_ZONES: `${ BASE_URL }/api/v1/get-zone`,
  AUTOCOMPLETE: `https://api.bmapsbd.com/search/autocomplete/web?search=`,
  REVERSE_GEO: `https://barikoi.xyz/v1/api/search/reverse/MjYyMzpHOVkzWFlGNjZG/geocode?`,
  UCODE_SEARCH: `https://api.bmapsbd.com/place`,
  WKT_URL: `${ BASE_URL }/api/v1/get-trips`,
  REVERSE_GEO_URL: `${ URL }/reverse/without/auth?`,
}

// Map Configs
export const MAP_CONFIG = {
    ACCESS_TOKEN: 'Mjg5MTpGMDNaTU1HTjZU',
    STYLES: [
      {
        title: 'Bangla',
        uri:''
      },
      {
        title: 'Light',
        uri:`https://map.barikoi.com/styles/osm-liberty/style.json?key=${ MAP_API_ACCESS_TOKEN }`
      },
      {
        title: 'Dark',
        uri:'https://map.barikoi.com/styles/barikoi-dark/style.json'
      }
    ]
  }



  export const GPX_SOCKET = {
    PUSHER_APP_KEY: 'mykey',
    PUSHER_APP_SECRET: '63a40b2bc45123cff47e',
    PUSHER_APP_CLUSTER: 'ap2',
    PUSHER_APP_ID: 1126684,
    WS_HOST: 'backend.barikoi.com',
    WS_PORT: 6001,
    CHANNEL: 'private-garbage_man_47477',
    EVENT_GML_GPX: 'garbage_man_default_channel',
    AUTH_ENDPOINT: 'https://backend.barikoi.com:8888/api/broadcasting/auth',
  }
