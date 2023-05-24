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