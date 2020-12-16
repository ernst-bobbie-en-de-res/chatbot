import Axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { API_URL } from './Constants';
import logo from './logo.png'

export default function App() {
  return (
    <div className="app">
      <div className="header">
        <img src={logo} />
        <h1>Dorés</h1>
      </div>
      <Conversation />
    </div>
  );
}

export function App2() {
  const [botMessages, setBotMessages] = useState([
    {
      value: `Hallo ik ben Dorès, de virtuele assistent van de RES!🖐 Je kan bij mij terecht voor vragen over de Regionale Energie Strategie of ik kan je begeleiden bij het vinden van RES-gerelateerde informatie.`,
      date: new Date(),
      bot: true,
      options: ['Wat is de res?', 'Wie besluit over de RES?']
    }
  ]);
  const [userMessages, setUserMessages] = useState([]);
  let [currentMessage, setCurrentMessage] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();

    if (currentMessage !== "" && currentMessage.match(/^ *$/) === null)
      setUserMessages([...userMessages, { value: currentMessage, date: new Date(), bot: false }]);
    else
      return;

    setCurrentMessage("");

    const message = await Axios.get(API_URL + '/message?message=' + currentMessage);

    const messages = message.data.map(x => ({
      type: x.type,
      value: x.answer,
      options: x.options,
      validResponse: x.validResponse,
      date: new Date(),
      bot: true
    }));

    setBotMessages([...botMessages, ...messages]);
  };

  return (
    <div className="chatbot">
      <div className="header">
        <img src={logo} />
        <h1>Dorés</h1>
      </div>
      <div className="chatbot__inner">
        <small>Dit gesprek wordt opgeslagen om de gebruikerservaring voor u en anderen te verbeteren</small>
        <Messages
          ask={(question) => {
            setCurrentMessage(question);
            currentMessage = question;
            submitForm({ preventDefault: () => { } })
          }}
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

const FigmaMessageComponent = (props) => {
  const [img, setImg] = useState()

  useEffect(async () => {
    const figmaComponent = await Axios.get(API_URL + '/images/' + props.value);
    setImg(figmaComponent.data.url);
  }, [])

  return <>
    {img && <img src={img} onLoad={() => props.scrollToEnd()}></img>}
  </>
}

const MapsComponent = (props) => {
  const [mapsApiKey, setMapsApiKey] = useState();

  useEffect(() => {
    // (async () => {
    //   const apiKey = await Axios.get(API_URL + '/maps-api-key');
    //   setMapsApiKey(apiKey.data);
    //   props.scrollToEnd();
    // })();

    setMapsApiKey('AIzaSyDPfffkf5pnMH5AmDLnVNb-3w1dNpdh-co')
  }, [])

  return <>{mapsApiKey && <iframe
    title={props.value}
    width="350"
    height="250"
    frameBorder="0" style={{ border: 0 }}
    src={`https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${props.value}`} allowFullscreen>
  </iframe>}</>
}

const YoutubeComponent = (props) => {
  return <><iframe
    title={props}
    width="300"
    height="225"
    src={`https://www.youtube.com/embed/${props.value}`} allowFullScreen>
  </iframe></>
}

const HtmlComponent = (props) => {
  var renderHtml = () => {
    return { __html: props.value };
  }

  return <p dangerouslySetInnerHTML={renderHtml()}></p>
}

const types = {
  maps: {
    component: MapsComponent
  },
  figma: {
    component: FigmaMessageComponent
  },
  text: {
    component: (props) => <p>{props.value}</p>
  },
  youtube: {
    component: YoutubeComponent
  },
  html: {
    component: HtmlComponent
  }
}

const Messages = props => {
  const messagesEndRef = useRef(null);
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState([...props.botMessages, ...props.userMessages]);

  const submitFeedback = async (email, question) => {
    await Axios.post(API_URL + '/feedback', {
      email, question
    })
  };

  const scrollToEnd = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  };

  useEffect(() => {
    (async () => {
      var messageArr = props.userMessages.concat(props.botMessages)
      messageArr.sort((a, b) => a.date - b.date);
      messageArr.map(async x => {
        if (!x.figmaComponent)
          return;
        await Axios.get(API_URL + '/images/' + x.figmaComponent)
          .then(({ data }) => {
            x.img = data.url;
            setMessages([...messageArr]);
            scrollToEnd();
          });
      });

      setMessages(messageArr);
    })().then(() => scrollToEnd());
  }, [props.botMessages, props.userMessages]);

  return <div className="messages">
    {messages.map((message, i) => {

      const TheComponent = types[message.type || 'text'].component

      return <div key={`msg-wrapper-${i}`} className={message.bot ? "message__wrapper" : "message_wrapper user"}>
        <div key={`msg-${i}-${message.bot}`} className={message.bot ? "message" : "message user"}>
          <TheComponent value={message.value} scrollToEnd={scrollToEnd}></TheComponent>
          {(message.options || []).map(option =>
            <p className="option" onClick={() => props.ask(option)}>{option}</p>
          )}
          {
            message.img !== undefined
              ? <img src={message.img} alt="De opgevraagde afbeelding is helaas niet beschikbaar :(" />
              : null
          }
        </div>
        {message.validResponse !== undefined && message.validResponse === false
          ? <div key={i} className={message.bot ? "message" : "message user"}>
            <p className="help">
              Wil je graag een persoonlijk antwoord op je vraag vul hier je e-mailadres in:<br></br>
              <input type="email" className="email__input" placeholder="E-mailadres" value={email} onChange={e => setEmail(e.target.value)}></input>
              <button className="email__button" onClick={() => submitFeedback(email, messages[i - 1].value)}>Verzend</button>
            </p>
          </div>
          : null
        }
      </div>
    })}
    <div className="message__end" ref={messagesEndRef} />
  </div>
};


/*
  Conversational component.
  Contains logic for the next message to be sent. 
*/
const Conversation = () => {
  // Refs
  const messagesEndRef = useRef(null);
  const messageFormRef = useRef(null);

  // User related
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentMessageType, setCurrentMessageType] = useState('informational');
  const [forContextVariable, setForContextVariable] = useState(null);

  //System related
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      if (!conversationId)
        await Axios.post(API_URL + '/conversations')
          .then(res => {
            setConversationId(res.data.id)
            setMessages(res.data.messages)
          });
    })();
  });

  const handleConversationUpdate = async (messages) => {
    let lastMessage = messages[messages.length - 1];
    if (lastMessage.source === 'system' && lastMessage.messageType === 'contextual') {
      setCurrentMessageType('contextual');
      setForContextVariable(lastMessage.forContextVariable);
    } else {
      setCurrentMessageType('informational');
      setForContextVariable(null);
    }
    setCurrentMessage('');
    setMessages(messages);

  };

  const createMessageObject = (source, messageType, obj) => {
    return {
      source: source,
      messageType: messageType,
      componentType: obj.type || 'text',
      forContextVariable: obj.forContextVariable,
      value: obj.answer,
      options: obj.options,
      contextAnswerType: obj.contextAnswerType,
      contextAnswer: obj.contextAnswer || obj.answer,
    };
  }

  const submitForm = async (e) => {
    e.preventDefault();

    let newMessages = [...messages];
    if (currentMessage !== "" && currentMessage.match(/^ *$/) === null)
      newMessages.push({ source: 'user', messageType: currentMessageType, componentType: 'text', forContextVariable: forContextVariable, value: currentMessage, options: [] });
    else
      return;

    let lastUserMessage = newMessages.filter(x => x.source === 'user').last();
    let lastSystemMessage = newMessages.filter(x => x.source === 'system').last();
    if (lastUserMessage.messageType === 'contextual') {
      newMessages.push(createMessageObject('system', lastSystemMessage.messageType, lastSystemMessage));
      await handleConversationUpdate(newMessages);
    } else {
      await Axios.get(API_URL + '/message?message=' + currentMessage + '&messageType=' + currentMessageType)
        .then(res => res.data.map(x => newMessages.push(createMessageObject('system', x.componentType, x))))
        .then(async () => await handleConversationUpdate(newMessages))
        .catch(err => console.log(err));
    }
  };

  const selectOption = (option) => {
    setCurrentMessage(option);
    setCurrentMessageType('informational');
    messageFormRef.current.click();
  }

  const scrollToEnd = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  };

  return <div className="conversation">
    <div className="messages">
      {
        messages !== undefined && messages.length > 0
          ? messages.map((message, i) => {
            const prevMsg = messages[i - 1];
            const isContextualAnswer = prevMsg !== undefined ? prevMsg.source === 'user' && prevMsg.messageType === 'contextual' : false;
            const TheComponent = isContextualAnswer ? types[message.contextAnswerType || 'text'].component : types[message.componentType || 'text'].component;

            return <div key={`msg-wrapper-${i}`} className={`message__wrapper ${message.source}`}>
              <div key={`msg-${i}-${message.source}`} className={`message ${message.source}`}>
                <TheComponent value={isContextualAnswer ? prevMsg.value : message.value} scrollToEnd={scrollToEnd}></TheComponent>
                {(message.options || []).map(option =>
                  <p className="option" onClick={() => selectOption(option)}>{option}</p>
                )}
                {
                  message.img !== undefined
                    ? <img src={message.img} alt="De opgevraagde afbeelding is helaas niet beschikbaar :(" />
                    : null
                }
              </div>
            </div>
          })
          : null
      }
    </div>
    <div className="message__end" ref={messagesEndRef} />
    <form onSubmit={e => submitForm(e)}>
      <input
        className="chat__input"
        type="text"
        placeholder="Ik wil graag meer weten over..."
        value={currentMessage}
        onChange={e => setCurrentMessage(e.target.value)}
      />
      <button type="submit" className="chat__submit" ref={messageFormRef}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </form>
  </div>;
};