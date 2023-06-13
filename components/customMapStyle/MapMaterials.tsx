// useEffect((): any => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `http://20.244.112.255:8080/styles/barikoi-tests/style.json`
//         );
//         const data = response.data;
//         const oldStyle = [data.layers[2].paint, data.layers[110].layout, data.layers[86].layout, data.layers[88].layout, data.layers[109].layout];
//         oldStyle[0]['fill-color'] = 'red';
//         oldStyle[0]['fill-outline-color'] = '#1e1e1e';
//         oldStyle[1]['visibility'] = 'none'
//         oldStyle[2]['visibility'] = 'none'
//         oldStyle[3]['visibility'] = 'none'
//         oldStyle[4]['visibility'] = 'none'
//         console.log(styleData)
//         dispatch(setStyleData(data))
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, [])

{
  /* <Map
          mapLib={maplibregl}
          initialViewState={{
            longitude: 90.39017821904588,
            latitude: 23.719800220780733,
            zoom: 12
          }}
          style={{ width: '100%', height: 'calc(100vh - 77px)' }}
          mapStyle={ styleData ?? `https://map.barikoi.com/styles/osm-liberty/style.json?key=${MAP_API_ACCESS_TOKEN}`}
          // mapStyle={`data.json` }
        >
          <NavigationControl position="top-left" />
        </Map> */
}

// const availableData = data.layers.filter(
//   (layer: any) =>
//     (layer.id
//       &&
//       (layer.id === "shop" ||
//         layer.id === "clinic" ||
//         layer.id === "recreation" ||
//         layer.id === "healthcare" ||
//         layer.id === "barikoi_poi" ||
//         layer.id === "landuse_hospital" ||
//         layer.id === "education" ||
//         layer.id.includes("poi") ||
//         layer.id === "landuse_school")
//         ) ||
//     layer.id && layer.source === "data"
// );
