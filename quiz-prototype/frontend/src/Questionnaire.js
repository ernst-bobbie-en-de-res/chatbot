import React, { useState, useEffect } from 'react';

export default function Questionnaire() {
    useEffect(() => {
        fetch("http://localhost:3001/questions")
            .then(res => res.json())
            .then(data => {
                setQuestions(data);
            });
    }, []);

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    return (
        <div className="Questionnaire">
            <h1>Vragenlijst</h1>
            {questions.map((x, i) => {
                return <div key={i} className="Question" style={{ marginBottom: "2rem" }}>
                    <b>{x.question}</b>
                    <hr />
                    <div>
                        {x.options.map((y, j) => {
                            return <label key={j} style={{ display: "block" }}>
                                <input
                                    onChange={() => setAnswers(oldArray => [...oldArray, y.text])}
                                    type="radio"
                                    name={`question-${i}`}
                                    key={j} value={y.text} />
                                {y.text}
                            </label>
                        })}
                    </div>
                </div>
            })}
            <button onClick={() => console.log(answers)}>Verzenden</button>
        </div>
    )
}