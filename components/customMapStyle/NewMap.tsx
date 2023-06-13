import React, { useState, useEffect } from "react";
import { Map, NavigationControl } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Row, Col, Form, TreeSelect } from "antd";
function NewMap(): JSX.Element {
  const [mapStyle, setMapStyle] = useState<any>(null);
  const [selectedBarikoiIds, setSelectedBarikoiIds] = useState<string[]>([]);
  const [selectedOpenMpIds, setSelectedOpenMapIds] = useState<string[]>([]);
  const [barikoiIdOptions, setBarikoiIdOptions] = useState<string[]>([]);
  const [openMapIdOptions, setOpenMapIdOptions] = useState<string[]>([]);
  const [filteredOpenMapIdOptions, setFilteredOpenMapIdOptions] = useState<
    string[]
  >([]);
  const MAP_API_ACCESS_TOKEN = "NDE2NzpVNzkyTE5UMUoy";
  useEffect(() => {
    fetch(
      `https://map.barikoi.com/styles/osm-liberty/style.json?key=${MAP_API_ACCESS_TOKEN}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const splicedData = data?.layers?.splice(110, 3);
        console.log(splicedData);
        // for barikoi data
        const availableBarikoiData = data?.layers?.filter(
          (layer: any) => layer.id && layer.source === "data"
        );
        // for openmap tiles data
        const availableOpenMapData = data?.layers?.filter(
          (layer: any) => layer.id && layer.source === "openmaptiles"
        );
        const availableBarikoiIds = availableBarikoiData.map(
          (layer: any) => layer.id
        );
        const availableOpenMapIds = availableOpenMapData.map(
          (layer: any) => layer.id
        );
        setBarikoiIdOptions(availableBarikoiIds);
        setOpenMapIdOptions(availableOpenMapIds);
        setMapStyle(data);

        let filteredOptions: string[] = availableOpenMapIds;
        setSelectedOpenMapIds([]);

        if (selectedBarikoiIds.includes("education")) {
          if (selectedBarikoiIds.includes("healthcare")) {
            filteredOptions = ["poi_zsc", "poi_z14hos"];
          } else {
            filteredOptions = availableOpenMapIds.filter(
              (id: string) => id === "poi_zsc"
            );
          }
        } else if (selectedBarikoiIds.includes("healthcare")) {
          filteredOptions = availableOpenMapIds.filter(
            (id: string) => id === "poi_z14hos"
          );
        }

        setFilteredOpenMapIdOptions(filteredOptions);
      })
      .catch((error) => console.error(error));
  }, [selectedBarikoiIds]);

  useEffect(() => {
    if (mapStyle) {
      const updatedMapStyle = { ...mapStyle };
      updatedMapStyle.layers.forEach((layer: any) => {
        if (
          selectedOpenMpIds.includes(layer.id) ||
          selectedBarikoiIds.includes(layer.id)
        ) {
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
      setMapStyle(updatedMapStyle);
    }
  }, [selectedOpenMpIds, selectedBarikoiIds]);
  return (
    <div className="App">
      <Row gutter={10}>
        <Col span={16}>
          {mapStyle && (
            <Map
              mapLib={maplibregl}
              initialViewState={{
                longitude: 90.378392,
                latitude: 23.766631,
                zoom: 14,
              }}
              style={{ width: "100%", height: "calc(100vh - 77px)" }}
              mapStyle={mapStyle}
            >
              <NavigationControl position="top-left" />
            </Map>
          )}
        </Col>
        <Col span={6}>
          <Form>
            <Form.Item>
              <TreeSelect
                treeData={barikoiIdOptions.map((id) => ({
                  title: id,
                  value: id,
                  key: id,
                }))}
                value={selectedBarikoiIds}
                onChange={setSelectedBarikoiIds}
                treeCheckable={true}
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                placeholder="Select barikoi data"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item>
              <TreeSelect
                treeData={filteredOpenMapIdOptions.map((id) => ({
                  title: id,
                  value: id,
                  key: id,
                }))}
                value={selectedOpenMpIds}
                onChange={setSelectedOpenMapIds}
                treeCheckable={true}
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                placeholder="Select Openmaptiles data"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
export default NewMap;
