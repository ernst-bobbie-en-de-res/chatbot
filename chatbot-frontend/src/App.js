import React, { useState } from 'react';
import './App.css';

const Messages = props => {
  var uCount = 0, bCount = 0;
  var length = props.botMessages.length + props.userMessages.length;
  var html = [];
  for (var i = 0; i < length; i++) {
    if (i % 2 === 0) {
      html.push(<div key={props.botMessages[bCount][0] + i + bCount} className="message bot">{props.botMessages[bCount]}</div>);
      bCount++;
    } else {
      html.push(<div key={props.userMessages[uCount][0] + i + uCount} className="message user">{props.userMessages[uCount]}</div>);
      uCount++;
    }
  }
  return <div className="messages">
    {html.map(x => { return x; })}
  </div>
}

export default function App() {
  const [botMessages, setBotMessages] = useState(['Stel uw vraag hieronder om te beginnen!']);
  const [userMessages, setUserMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);

  function submitForm(e) {
    e.preventDefault();
    setUserMessages([...userMessages, currentMessage]);
    fetch('http://localhost:5000/api/v1/message?message=' + currentMessage, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setBotMessages([...botMessages, data]))
      .catch(err => console.log(err));
  };

  return (
    <div className="App">
      <Messages
        botMessages={botMessages !== undefined ? botMessages : []}
        userMessages={userMessages !== undefined ? userMessages : []} 
      />
      <form onSubmit={e => submitForm(e)} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Ik wil graag meer weten over..."
          onChange={e => setCurrentMessage(e.target.value)}
          style={{
            padding: "1rem",
            width: "75%",

          }}
        />
        <button
          type="submit"
          style={{
            padding: "1rem",
            width: "20%",
            float: "right",
            color: "white",
            background: "#50a5ef",
            borderColor: "rgb(80, 165, 239)",
            outline: "none",
            borderStyle: "double",
            borderRadius: "3px"
          }}
        >
          Versturen
        </button>
      </form>
    </div>
  );
};