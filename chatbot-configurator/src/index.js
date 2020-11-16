import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { DragAndDropSidebar } from "./DragAndDropSidebar";



function App() {
  return (
    <div className="App">
      <DragAndDropSidebar></DragAndDropSidebar>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
