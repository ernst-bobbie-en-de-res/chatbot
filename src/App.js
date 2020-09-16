import React, { useEffect } from 'react';
import './App.css';

function App() {

  useEffect(() => {
    var d1 = document.getElementById('root');
    d1.insertAdjacentHTML('beforebegin', `    <a-scene vr-mode-ui="enabled: false" embedded arjs="sourceType: webcam; debugUIEnabled: false;sourceWidth:360; sourceHeight:120; displayWidth: 360; displayHeight: 120;"> 
      <a-entity scale="0.25 0.25 0.25" gltf-model="/untitled.glb" modify-materials look-at="[gps-camera]"
      gps-entity-place="latitude: 51.93354636; longitude: 6.65203426;"></a-entity>
  
      <a-camera gps-camera rotation-reader></a-camera>
    </a-scene>`);

  }, []);

  return (

    <div className="App">


    </div>
  );
}

export default App;