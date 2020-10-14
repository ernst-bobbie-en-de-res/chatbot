import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Users from './Users';
import Questionnaire from './Questionnaire';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="App" style={{ padding: "3rem" }}>
        <nav>
          <b>Links:</b>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/users">Gebruikers</Link></li>
            <li><Link to="/questionnaire">Vragenlijst</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/questionnaire" component={Questionnaire} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

const Home = () => {
  return <div className="Home">
    <h1>Welkom bij de Quizzer!</h1>
    <p>Deze applicatie dient als opiniepeiler: Hoe ziet jouw woonomgeving eruit na de energietransitie?</p>
  </div>
}