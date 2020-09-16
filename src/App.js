import React, { useState } from 'react';
import './App.css';

const style = { border: "none", background: "#117b99", color: "white", padding: "1rem 1.25rem", fontSize: "1rem", borderRadius: "5px", fontWeight: "bold", margin: "1rem" };

export default function App() {
  const [sceneRendered, setSceneRendered] = useState(false);

  return (
    <div className="App">
      <button
        style={style}
        onClick={() => {
          if (!sceneRendered)
            renderArScene();
          setSceneRendered(!sceneRendered);
        }}
      >Laad AR omgeving</button>
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