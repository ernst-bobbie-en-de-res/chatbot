import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [botMessages, setBotMessages] = useState([{ value: 'Stel uw vraag hieronder om te beginnen!', date: new Date(), bot: true }]);
  const [userMessages, setUserMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  function submitForm(e) {
    e.preventDefault();

    if (currentMessage !== "" || currentMessage.match(/^ *$/) === null)
      setUserMessages([...userMessages, { value: currentMessage, date: new Date(), bot: false }]);
    else
      return;

    setCurrentMessage("");
    fetch('http://localhost:5000/message?message=' + currentMessage, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        var newArr = data.map(x => { return { value: x.text, date: new Date(), bot: true } });
        var concatArr = botMessages.concat(newArr);
        setBotMessages(concatArr);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="chatbot">
      <div className="header">
        <h1>Dorés</h1>
      </div>
      <div className="chatbot__inner">
        <Messages
          botMessages={botMessages !== undefined ? botMessages : []}
          userMessages={userMessages !== undefined ? userMessages : []}
        />
      </div>
      <form onSubmit={e => submitForm(e)}>
        <input
          className="chat__input"
          type="text"
          placeholder="Ik wil graag meer weten over..."
          value={currentMessage}
          onChange={e => setCurrentMessage(e.target.value)}
        />
        <button type="submit" className="chat__submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  );
};

const Messages = props => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  }, [props.botMessages, props.userMessages]);

  var messages = props.userMessages.concat(props.botMessages);
  messages.sort((a, b) => a.date - b.date);
  return <div className="messages">
    {messages.map((x, i) => {
      return <div key={i} className={x.bot ? "message" : "message user"}><p>{x.value}</p></div>;
    })}
    <div ref={messagesEndRef} />
  </div>
};