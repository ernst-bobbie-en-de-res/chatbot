import React, { useState, useEffect } from 'react';

export default function Users() {
    useEffect(() => {
        fetch("http://localhost:3001/users")
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    const [users, setUsers] = useState(null);

    return <div>
        <h1>Gebruikers</h1>
        {users !== null && users !== undefined && users.length > 0
            ? users.map((x, i) => {
                return <User key={i} userId={x._id} />;
            })
            : <div>Er zijn nog geen gebruikers die de vragenlijst ingevuld hebben..</div>}
    </div>;
};

const User = (props) => {
    const [user, setUser] = useState(null);
    const [collapse, setCollapse] = useState(true);
    useEffect(() => {
        fetch(`http://localhost:3001/users/${props.userId}`)
            .then(res => res.json())
            .then(data => setUser(data));
    }, [props.userId]);

    return (
        <div className="user"
            style={{ display: 'block', marginBottom: "1rem", border: "1px solid black", borderRadius: "5px", padding: "1rem", userSelect: "none", cursor: "pointer" }}
            onClick={() => setCollapse(!collapse)}>
            <div>
                {user !== null && user !== undefined
                    ?
                    <div>
                        {collapse
                            ? <button style={{ border: "none", background: "white", fontWeight: "bold", width: "100%", outline: "none" }}>
                                {user.name}</button>
                            : <div>
                                <b>{user.name}</b>
                                <div>{user.emailAddress}</div>
                                <br />
                                <b>Adres</b>
                                <div>{user.address}</div>
                                <div>{user.town}</div>
                                <br />
                                <hr />
                                <b>Antwoorden:</b>
                                <ul>
                                    {user.answers !== null && user.answers !== undefined && user.answers.length > 0
                                        ? user.answers.map((x, i) => <li key={i}>{x.optionId}</li>)
                                        : <li>{user.name} heeft nog geen vragen beantwoord</li>}
                                </ul>
                            </div>}
                    </div>
                    : null}
            </div>
        </div>
    );
}