// Get Polygon Fill Color from Color List 
export const getPolygonFillColor: any = (value: any) => {
    const polygonLayersColors = [
      [ 255, 255, 0, 100 ],
      [ 159, 226, 191, 100 ], 
      [ 255, 127, 80, 100 ], 
      [ 0, 230, 64, 100 ] 
    ]
    const index =  value % polygonLayersColors?.length
  
    return polygonLayersColors[ index ]
  }
// Parse Geometry Data and Set as geoJson Data
export const getJsonData = (data: any) => {
    const geoJsonData: any = data?.map((d: any, idx: any) => ({
      ...d,
      geometry: d?.geometry,
      properties: {
        lineColor: [ 0, 0 , 0, 250 ],
        fillColor: getPolygonFillColor(idx) ?? [ 238, 130, 238, 100 ]
      }
    }))
  
    return geoJsonData
  }
  
export const wktToPoint = (data: any) => {
  const wkt = require('wkt')
  const point = wkt.parse(data)
  const coordinates = point?.coordinates
  return coordinates
}

export function sortByDate(data: any, key='created_at') {
  return data.sort((a: any, b: any) => {
    const timeA = new Date(a[ key ])
    const timeB = new Date(b[ key ])

    if (timeA > timeB) {
      return -1;
    }
    if (timeA < timeB) {
      return 1;
    }
    return 0;
  })
}

export function updateVehicleData(array1: any, array2: any, key: any) {
  console.log({array1}, {array2})
  const array: any = [ ...array1 ]
  array2.forEach((o: any) => {
    const index = array.findIndex((a: any) => a[ key ] === o[ key ])
    if(index >= 0) {
      array[ index ] = { ...array[ index ] , ...o }
    }
  })
  console.log(array)
  return array
}

