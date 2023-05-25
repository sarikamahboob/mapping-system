// // Base URL
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export const MAP_API_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAP_API_ACCESS_TOKEN || ''

export const SEARCH_URL = process.env.NEXT_PUBLIC_BASE_URL_SEARCH || ''

// `?point=${start.lat},${start.lon}&point=${end.lat},${end.lon}&locale=en-us&elevation=false&profile=car&optimize=%22true%22&use_miles=false&layer=Barikoi&points_encoded=false`

// API Routes
export const API = {
  GET_ZONES: `${ BASE_URL }/api/v1/get-zone`,
  AUTOCOMPLETE: `https://api.bmapsbd.com/search/autocomplete/web?search=`
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

