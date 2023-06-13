import { MAP_CONFIG } from '@/app.config';
import React, { useState } from 'react'
import { Map } from 'react-map-gl';
// import MapGL  from 'react-map-gl';
import { Editor, EditingMode, DrawLineStringMode, DrawPolygonMode } from 'react-map-gl-draw';
// import maplibregl from 'maplibre-gl';


// const PolygonDrawMap = () => {
const MODES = [
    { id: 'drawPolyline', text: 'Draw Polyline', handler: DrawLineStringMode },
    { id: 'drawPolygon', text: 'Draw Polygon', handler: DrawPolygonMode },
    { id: 'editing', text: 'Edit Feature', handler: EditingMode },
  ];
  
const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
  longitude: -122.45,
  latitude: 37.78,
  zoom: 14,
};
      
const PolygonDrawMap = () => {
  const [viewport, setViewport]:any = useState(DEFAULT_VIEWPORT);
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler]:any = useState(null);

  const switchMode = (evt:any) => {
    const newModeId = evt.target.value === modeId ? null : evt.target.value;
    const mode = MODES.find(m => m.id === newModeId);
    const newModeHandler = mode ? new mode.handler() : null;
    setModeId(newModeId);
    setModeHandler(newModeHandler);
  };

  const renderToolbar = () => {
    return (
      <div style={{ position: 'absolute', top: 0, right: 0, maxWidth: '320px' }}>
        <select onChange={switchMode}>
          <option value="">--Please choose a draw mode--</option>
          {MODES.map(mode => (
            <option key={mode.id} value={mode.id}>
              {mode.text}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const updateViewport = (viewport:any) => {
    setViewport(viewport);
  };
return (
  <div>
      <Map
          {...viewport}
          style={{width: '100%', height: '100%'}}
          mapStyle={MAP_CONFIG.STYLES[1].uri}
          onViewportChange={updateViewport}
          >
          <Editor mode={modeHandler} />
          {renderToolbar()}
      </Map>
  </div>
)
}

export default PolygonDrawMap