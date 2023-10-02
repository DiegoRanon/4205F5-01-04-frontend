import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHttpClient } from "../shared/hooks/http-hook";
import { useForm } from "../shared/hooks/form-hook";
import { AuthContext } from '../shared/context/auth-context';
import { useHistory } from 'react-router-dom';

function Login(props) {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [motdepasse, setMotDePasse] = useState('');
    const [type, setType] = useState('');

    const { error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: "",
                isValid: false,
            },
            motdepasse: {
                value: "",
                isValid: false,
            },
        },
        false
    );
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        let reponseData = null;

        try {
            // Essayer en tant qu'étudiant
            reponseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL +"etudiant/connexion",
                "POST",
                JSON.stringify({
                    email: email,
                    motdepasse: motdepasse,
                }),
                {
                    "Content-Type": "application/json",
                }
            );
            if (reponseData.success) {

                console.log("Connecter en tant qu'etudiant")
                history.push('/home');
                auth.login(reponseData.etudiant.id);
            } else {
                // Essayer en tant qu'employeur
                reponseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL+"/employeur/connexion",
                    "POST",
                    JSON.stringify({
                        email: email,
                        motdepasse: motdepasse,
                    }),
                    {
                        "Content-Type": "application/json",
                    }
                );

                if (reponseData.success) {
                    auth.login(reponseData.employeur.id);
                    history.push('/home');
                }  else {
                    alert("Compte inexistant.");
                }
            }
           } catch (err) {
            console.log(err);
            alert("An error noccurred while attempting to log in.");
        }
    };

    return (
        <div className="container">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        onInput={inputHandler}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="motDePasse">Mot de Passe</label>
                    <input
                        type="password"
                        id="motdepasse"
                        name="motdepasse"
                        value={motdepasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                        required
                        onInput={inputHandler}
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Connexion</button>
                </div>
                <div className="form-group">
                <Link to="/createAccountEtudiant" className="linkC">
                    Créer un compte étudiant
                </Link>
                </div>
                <Link to="/createAccountEmployeur" className="linkC">
                    Créer un compte employeur
                </Link>
            </form>
        </div>
    );
}

export default Login;