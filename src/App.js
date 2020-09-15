import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <a-scene vr-mode-ui="enabled: false" embedded arjs="sourceType: webcam; debugUIEnabled: false;">
        <a-assets>
          <a-asset-item id="cityModel" src={process.env.PUBLIC_URL + "/untitled.glb"}></a-asset-item>
        </a-assets>
        <a-entity gltf-model="#cityModel" scale="1 1 1" position="0 -1 0" modify-materials look-at="[gps-camera]"
          gps-entity-place="latitude: 51.936206; longitude: 5.564097;"></a-entity>
        <a-camera gps-camera rotation-reader></a-camera>
      </a-scene>
    </div>
  );
}

export default App;