import React, { Component, useState} from 'react';
import "./createAccount.css";
import { useHttpClient } from '../shared/hooks/http-hook';
import { useForm } from "../shared/hooks/form-hook";
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';


   

function CreateAccountEtudiant(props) {
    const history = useHistory();
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [motdepasse, setMotDePasse] = useState('');
    const [numTel, setNumTel] = useState('');
    const [userType, setUserType] = useState('');
    const { error, sendRequest, clearError } = useHttpClient();
    const [selectedOption, setSelectedOption] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [formState, inputHandler, setFormData] = useForm(
        {
            nom:{
                value:"",
                isValid:false,
            },
            prenom:{
                value:"",
                isValid:false,
            },
            email: {
                value: "",
                isValid: false,
            },
            motdepasse: {
                value: "",
                isValid: false,
            },
            numTel: {
                value:"",
                isValid:false,
            },
            userType: {
                value:"",
                isValid:false
            }
        },
        false
    );
    const inputHandlerPhone = (e) => {
        const phoneNumberPattern = /^\d{10}$/; 
    
        const inputPhoneNumber = e.target.value;
        const isPhoneNumberValid = phoneNumberPattern.test(inputPhoneNumber);
    
        setIsValid(isPhoneNumberValid);
        setNumTel(inputPhoneNumber);
      };


    const handleSubmit = async (event) => {
        event.preventDefault();
        let reponseData = null;
        let nomComplet = nom +" "+ prenom;
        try {
           
            reponseData = await sendRequest(
                "http://localhost:5000/etudiant/inscription",
                "POST",
                JSON.stringify({
                    nom:nomComplet,
                    email: email,
                    motdepasse: motdepasse,
                    numTel: numTel,
                    userType:"etudiant"
                }),
                {
                    "Content-Type": "application/json",
                }
            );
           
            

            if (reponseData != null) {
                alert("Creation of account succefull!");
                setNom("");
                setPrenom("");
                setEmail("");
                setNumTel("");
                setMotDePasse("");
                setUserType("");
                history.push('/login');

            } else {
                alert("Creation of account failed. Please try again later.");
            }
        } catch (err) {
            console.log(err);
            alert("An error occurred while attempting to creating your account.");
           
        }
    };
    

    
        return (
            <div className="container">
                <h2>Creation de Compte</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Nom">Nom</label>
                        <input type="text" id="nom" name="nom" value={nom} onChange={(e) =>setNom(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="prenom">Prenom</label>
                        <input type="text" id="prenom" name="prenom" value={prenom} onChange={(e) =>setPrenom(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) =>setEmail(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Numero de telephone</label>
                        <input type="tel" id="numeroTelephone" name="numeroTelephone" value={numTel} onChange={(e) =>setNumTel(e.target.value)} required onInput={inputHandlerPhone}/>
                        {!isValid && (
        <p style={{ color: 'red' }}>Please enter a valid 10-digit phone number.</p>
      )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={motdepasse} onChange={(e) =>setMotDePasse(e.target.value)} required onInput={inputHandler}/>
                        </div>
                    <div className="form-group">
                        <button type="submit">Creer un compte</button>
                    </div>
                    <Link to="/login" className="linkC"> Connexion </Link>
                    
                </form>
            </div>
        );
    
        }

export default CreateAccountEtudiant;
