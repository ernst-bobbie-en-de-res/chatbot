import Axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [botMessages, setBotMessages] = useState([{ value: 'Stel uw vraag hieronder om te beginnen!', date: new Date(), bot: true }]);
  const [userMessages, setUserMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();

    if (currentMessage !== "" || currentMessage.match(/^ *$/) === null)
      setUserMessages([...userMessages, { value: currentMessage, date: new Date(), bot: false }]);
    else
      return;

    setCurrentMessage("");

    const message = await Axios.get('http://localhost:5000/message?message=' + currentMessage);
    var newArr = message.data.map(x => { return { value: x.text, date: new Date(), bot: true } });
    setBotMessages([...botMessages, ...newArr]);
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
  const [email, setEmail] = useState("");

  const submitFeedback = async (email, question) => {
    await Axios.post('http://localhost:5000/feedback', {
      email, question
    })
  }

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  }, [props.botMessages, props.userMessages]);

  var messages = props.userMessages.concat(props.botMessages);
  messages.sort((a, b) => a.date - b.date);
  console.log(messages)
  return <div className="messages">
    {messages.map((x, i) => {
      return <><div key={i} className={x.bot ? "message" : "message user"}>
        <p>{x.value}</p>
      </div>
        {x.value === "Ik begrijp niet wat ik moet doen.. :(" &&
          <div key={i} className={x.bot ? "message" : "message user"}>
            <p className="help">
              Wil je graag een persoonlijk antwoord op je vraag vul hier je email adres in:<br></br> 
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}></input>
              <button onClick={() => submitFeedback(email, messages[i - 1].value)}>Verzend</button>
            </p>
          </div>}

      </>
    })}
    <div ref={messagesEndRef} />
  </div>
};