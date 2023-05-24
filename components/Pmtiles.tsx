import { Protocol } from 'pmtiles';
import React, { useEffect } from 'react'
import { Map } from 'react-map-gl'
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Pmtiles = () => {
    useEffect(() => {
        let protocol = new Protocol();
        maplibregl.addProtocol("pmtiles", protocol.tile);
        return () => {
          maplibregl.removeProtocol("pmtiles");
        };
      }, []);
  return (
    <div>
        <Map
        style={{ width: 600, height: 400 }}
        mapStyle={{
          version: 8,
          sources: {
            sample: {
              type: "vector",
              url:
                "pmtiles://https://r2-public.protomaps.com/protomaps-sample-datasets/cb_2018_us_zcta510_500k.pmtiles"
            }
          },
          layers: [
            {
              id: "zcta",
              source: "sample",
              "source-layer": "zcta",
              type: "line",
              paint: {
                "line-color": "#999"
              }
            }
          ]
        }}
        mapLib={maplibregl}
      />
    </div>
  )
}

export default Pmtiles