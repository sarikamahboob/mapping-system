// // Base URL
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export const MAP_API_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAP_API_ACCESS_TOKEN || ''

export const SEARCH_URL = process.env.NEXT_PUBLIC_BASE_URL_SEARCH || ''

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

