import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">

      <a-scene vr-mode-ui="enabled: false" embedded arjs="sourceType: webcam; debugUIEnabled: false;sourceWidth:360; sourceHeight:120; displayWidth: 360; displayHeight: 120;">

        <a-entity scale="0.25 0.25 0.25" position="0 -1 0" gltf-model="untitled.glb" modify-materials look-at="[gps-camera]"
          gps-entity-place="latitude: 51.98753116; longitude: 5.95172667;"></a-entity>

        <a-camera gps-camera rotation-reader></a-camera>
      </a-scene>

    </div>
  );
}

export default App;