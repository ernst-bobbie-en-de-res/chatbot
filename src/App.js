import React, { useEffect, useState } from 'react';
import LocationPicker from 'react-location-picker';
import './App.css';

const style = { border: "none", background: "#117b99", color: "white", padding: "1rem 1.25rem", fontSize: "3rem", borderRadius: "5px", fontWeight: "bold", margin: "1rem" };

export default function App() {
  const [sceneRendered, setSceneRendered] = useState(false);
  const [defaultPosition, setDefaultPosition] = useState({
    lat: 0,
    lng: 0
  });

  const handleLocationChange = (result) => {
    setDefaultPosition({ ...result.position })
    console.log(result);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos)
      setDefaultPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
    });
  }, [])

  return (
    <div className="App">
      {  !sceneRendered && <>      <LocationPicker
        prop={defaultPosition}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: 'calc(100vh - 100px)' }} />}
        defaultPosition={defaultPosition}
        onChange={handleLocationChange}
        radius="-1"
        zoom={14}
      />
        <button
          style={style}
          onClick={() => {
            renderArScene(defaultPosition.lat, defaultPosition.lng);
            setSceneRendered(!sceneRendered);
          }}
        >Laad AR omgeving</button> </>
      }

    </div>
  );
}

function renderArScene(lat, lng) {
  var html = `<a-scene vr-mode-ui="enabled: false" embedded arjs="sourceType: webcam; debugUIEnabled: false;sourceWidth:360; sourceHeight:120; displayWidth: 360; displayHeight: 120;">
    <a-entity scale="1 1 1" gltf-model="${process.env.PUBLIC_URL + "/untitled.glb"}" modify-materials look-at="[gps-camera]"
      gps-entity-place="latitude: ${lat}; longitude: ${lng};"></a-entity>
    <a-camera gps-camera rotation-reader></a-camera>
  </a-scene>`;
  document.getElementById("ar-root").insertAdjacentHTML("beforebegin", html);
}