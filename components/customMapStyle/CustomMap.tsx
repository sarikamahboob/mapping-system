import React, { useEffect, useRef, useState } from "react";
import { Map, NavigationControl } from "react-map-gl";
import { MAP_API_ACCESS_TOKEN } from "@/app.config";
import axios from "axios";
import { setStyleData } from "../redux/commonReducer";
import { useAppDispatch, useAppSelector } from "../redux/store";
import maplibregl from "maplibre-gl";
import { Checkbox, Col, Form, Row } from "antd";

import { Select } from "antd";

const { Option } = Select;

const CustomMap = () => {
  // const dispatch = useAppDispatch();
  // const styleData: any = useAppSelector((state) => state?.common?.styleData);
  // dispatch(setStyleData(data))

  const [mapStyle, setMapStyle]: any = useState(null);
  const [selectedIds, setSelectedIds]: any = useState([]);
  const [barikoiDataIds, setBarikoiDataIds] = useState([]);
  const [openMapDataIds, setOpenMapDataIds] = useState([]);

  useEffect((): any => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          // `http://20.244.112.255:8080/styles/barikoi-tests/style.json`
          `https://map.barikoi.com/styles/osm-liberty/style.json?key=NDE2NzpVNzkyTE5UMUoy`
        );
        const data = response.data;

        // Aavailable datas from json file
        const availableDataForBarikoi = data.layers.filter(
          (layer: any) => layer.id && layer.source === "data"
        );
        const availableDataForOpenMapTiles = data.layers.filter(
          (layer: any) => layer.id && layer.source === "openmaptiles"
        );

        const availableBarikoiIds = availableDataForBarikoi.map(
          (layer: any) => layer.id
        );
        const availableOpenMapIds = availableDataForOpenMapTiles.map(
          (layer: any) => layer.id
        );
        setBarikoiDataIds(availableBarikoiIds);
        setOpenMapDataIds(availableOpenMapIds);
        setMapStyle(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (mapStyle) {
      const updatedMapStyle = { ...mapStyle };

      updatedMapStyle.layers.forEach((layer: any) => {
        if (selectedIds.includes(layer.id)) {
          layer.layout = {
            ...layer.layout,
            visibility: "none",
          };
        } else {
          layer.layout = {
            ...layer.layout,
            visibility: "visible",
          };
        }
      });
      // Set visibility to "none" for "poi_zsc" when "education" is checked
      if (selectedIds.includes("education")) {
        const poiZscLayer = updatedMapStyle.layers.find(
          (layer: any) => layer.id === "poi_zsc"
        );
        if (poiZscLayer) {
          poiZscLayer.layout = {
            ...poiZscLayer.layout,
            visibility: "none",
          };
        }
      }
      setMapStyle(updatedMapStyle);
      console.log({ updatedMapStyle });
    }
  }, [selectedIds]);

  const handleCheckboxChange = (e: any) => {
    const { value, checked } = e.target;
    setSelectedIds((prevIds: any) => {
      let updatedIds = [...prevIds];
      if (checked) {
        if (value === "education") {
          updatedIds = [...prevIds, value];
          const poiZ13Layer = mapStyle.layers.find(
            (layer: any) => layer.id === "poi_z13"
          );
          const poiZ15Layer = mapStyle.layers.find(
            (layer: any) => layer.id === "poi_z15"
          );
          const poiZ16Layer = mapStyle.layers.find(
            (layer: any) => layer.id === "poi_z16"
          );
          if (poiZ13Layer) {
            poiZ13Layer.minzoom = 24;
          }
          if (poiZ15Layer) {
            poiZ15Layer.minzoom = 24;
          }
          if (poiZ16Layer) {
            poiZ16Layer.minzoom = 24;
          }
        } else {
          updatedIds = [...prevIds, value];
        }
      } else {
        updatedIds = prevIds.filter((id: any) => id !== value);
        if (value === "education") {
          const poiLayers = mapStyle.layers.find(
            (layer: any) =>
              layer.id === "poi_z13" &&
              layer.id === "poi_z15" &&
              layer.id === "poi_z16"
          );
          if (poiLayers) {
            poiLayers.minzoom = 15;
          }
        }
      }
      return updatedIds;
    });
  };

  return (
    <div>
      <Row gutter={20}>
        <Col span={16}>
          <Map
            mapLib={maplibregl}
            initialViewState={{
              longitude: 90.378392,
              latitude: 23.766631,
              zoom: 14,
            }}
            style={{ width: "100%", height: "calc(100vh - 77px)" }}
            mapStyle={
              mapStyle ??
              `https://map.barikoi.com/styles/osm-liberty/style.json?key=${MAP_API_ACCESS_TOKEN}`
            }
          >
            <NavigationControl position="top-left" />
          </Map>
        </Col>
        <Col span={6}>
          <Form>
            <Form.Item label="Barikoi Data:" labelCol={{ span: 24 }}>
              {barikoiDataIds.map((id, index) => (
                <Checkbox
                  key={id}
                  value={id}
                  onChange={handleCheckboxChange}
                  checked={selectedIds.includes(id)}
                >
                  {id}
                </Checkbox>
              ))}
            </Form.Item>
          </Form>
          <Form>
            <Form.Item label="Openmaptiles Data:" labelCol={{ span: 24 }}>
              {openMapDataIds.map((id, index) => (
                <Checkbox
                  key={id}
                  value={id}
                  onChange={handleCheckboxChange}
                  checked={selectedIds.includes(id)}
                >
                  {id}
                </Checkbox>
              ))}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default CustomMap;
