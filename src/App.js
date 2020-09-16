import React from 'react';
import './App.css';

function App(props) {
  return (
    <div className="App">
      <button onClick={() => renderArScene()}>Laad AR omgeving</button>
    </div>
  );
}

function renderArScene() {
  var html = `<a-scene vr-mode-ui="enabled: false" embedded arjs="sourceType: webcam; debugUIEnabled: false;sourceWidth:360; sourceHeight:120; displayWidth: 360; displayHeight: 120;">
    <a-entity scale="0.5 0.5 0.5" gltf-model="${process.env.PUBLIC_URL + "/untitled.glb"}" modify-materials look-at="[gps-camera]"
      gps-entity-place="latitude: 51.935948; longitude: 5.563490;"></a-entity>
    <a-camera gps-camera rotation-reader></a-camera>
  </a-scene>`;
  document.getElementById("ar-root").insertAdjacentHTML("beforebegin", html);
}

export default App;