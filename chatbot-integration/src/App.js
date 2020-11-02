import './App.css';

export default function App() {
  
  return (
    <div>
      <iframe src="http://localhost:61436" style={chatWidgetIframeStyle} />
      <button style={chatWidgetButtonStyle}>?</button>
    </div>
  );
};

const chatWidgetIframeStyle = {

};

const chatWidgetButtonStyle = {
  border: "none",
  outline: "none",
  borderRadius: "5rem",
  background: "#43ca6c",
  color: "white",
  fontWeight: "bolder",
  fontSize: "2rem",
  padding: "1rem 1.5rem",
  cursor: "pointer",
  position: "absolute",
  bottom: "1.5rem",
  right: "1.5rem",
};