import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHttpClient } from "../shared/hooks/http-hook";
import { useForm } from "../shared/hooks/form-hook";
import { AuthContext } from '../shared/context/auth-context';
import { useParams } from 'react-router-dom';

function MyProfile(props) {
  const auth = useContext(AuthContext);
  const { error, sendRequest, clearError } = useHttpClient();
  const [loadedEtudiant, setLoadedEtudiant] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(auth.userId);
  let access = false;

  // Variables des modèles
    const [email, setEmail] = useState('');
    const [motdepasse, setMotDePasse] = useState('');
    const [type, setType] = useState('');
    const [nom, setNom] = useState('');
    const [numTel, setNumTel] = useState('');
    const [nomEntreprise, setNomEntreprise] = useState('');
    const [adresseEntreprise, setAdresseEntreprise] = useState('');
    const [posteTel, setPosteTel] = useState('');



  
  // Verif
  const [etudiant, setEtudiant] = useState(false);
  const [employeur, setEmployeur] = useState(false);

  let utilisateur;

  const [formState, inputHandler, setFormData] = useForm(
    {
      nom: {
        value: '',
        isValid: false
      },
      email: {
        value: '',
        isValid: false
      },
      numTel: {
        value: '',
        isValid: false
      },
      motdepasse: {
        value: '',
        isValid: false
      },
      nomEntreprise: {
        value: '',
        isValid: false
      },
      adresseEntreprise: {
        value: '',
        isValid: false
      },
      posteTel: {
        value: '',
        isValid: false
      },
      type: {
        value: '',
        isValid: false
      }
    },
    false
  );

    const fetchUtilisateur = async () => {

      access = true;
      console.log("access = true")
      try {
        const reponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL +`etudiant/${userId}`);
        if (reponseData.success) {
          console.log("Profile Étudiant");
          setEtudiant(true);
          utilisateur = reponseData.etudiant;
          // Setup des variables
          setNom(utilisateur.nom);
          setEmail(utilisateur.email);
          setMotDePasse(utilisateur.motdepasse);
          setNumTel(utilisateur.numTel);
          
          
        } else {
          const reponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL +`employeur/${userId}`);
          if (reponseData.success) {
            console.log("Profile Employeur");
            setEmployeur(true);
            utilisateur = reponseData.employeur;
            // Setup des variables
            setNom(utilisateur.nom);
            setNomEntreprise(utilisateur.nomEntreprise)
            setAdresseEntreprise(utilisateur.adresseEntreprise)
            setEmail(utilisateur.email);
            setMotDePasse(utilisateur.motdepasse);
            setNumTel(utilisateur.numTel);
            setPosteTel(utilisateur.posteTel);
            
          }
        }
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };

    if(access == false) {
    fetchUtilisateur();
    }
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    let reponseData = null;
    try {
      if(etudiant) {
      reponseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +`etudiant/${userId}`,
        "PATCH",
        JSON.stringify({
            nom:nom,
            email: email,
            motdepasse: motdepasse,
            numTel:numTel
        }),
        {
            "Content-Type": "application/json",
        }
    );
      } else {
        reponseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +`employeur/${userId}`,
          "PATCH",
          JSON.stringify({
              nom:nom,
              nomEntreprise:nomEntreprise,
              adresseEntreprise:adresseEntreprise,
              email: email,
              motdepasse: motdepasse,
              numTel:numTel,
              posteTel:posteTel
          }),
          {
              "Content-Type": "application/json",
          }
      );
      }
    } catch (err) {
        console.log(err);
        alert("An error occurred while attempting to update the profile.");
    }
    
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, userId: userId, login: auth.login, logout: auth.logout }}>
      <div className="container">
        <h2>Mon Profile</h2>
        {etudiant && (
          <div>  
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                        <label htmlFor="Nom">Nom</label>
                        <input type="text" id="nom" name="nom" value={nom} onChange={(e) =>setNom(e.target.value)} required onInput={inputHandler}/>
              </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) =>setEmail(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Numero de telephone</label>
                        <input type="tel" id="numeroTelephone" name="numeroTelephone" value={numTel} onChange={(e) =>setNumTel(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={motdepasse} onChange={(e) =>setMotDePasse(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    </form>
          </div>
        )}
        {employeur && (
          <div>
            <form onSubmit={handleSubmit}>
             <div className="form-group">
                        <label htmlFor="Nom">Nom</label>
                        <input type="text" id="nom" name="nom" value={nom} onChange={(e) =>setNom(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) =>setEmail(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nomEntreprise">Nom de l'entreprise</label>
                        <input type="text" id="nomEntreprise" name="nomEntreprise" value={nomEntreprise} onChange={(e) =>setNomEntreprise(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="adresseEntreprise">Adresse de l'entreprise</label>
                        <input type="text" id="adresseEntreprise" name="adresseEntreprise" value={adresseEntreprise} onChange={(e) =>setAdresseEntreprise(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="numeroTelephone">Numero de telephone de l'employeur</label>
                        <input type="tel" id="numeroTelephone" name="numeroTelephone" value={numTel} onChange={(e) =>setNumTel(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="posteTel">Numero de telephone du poste</label>
                        <input type="tel" id="posteTel" name="posteTel" value={posteTel} onChange={(e) =>setPosteTel(e.target.value)} required onInput={inputHandler}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={motdepasse} onChange={(e) =>setMotDePasse(e.target.value)} required onInput={inputHandler}/>
                        </div>
                        </form>
          </div>
        )}

            <div className="form-group">
            <button type="submit">Modifier un compte</button>
            </div>
          
      </div>
    </AuthContext.Provider>
  );
}

export default MyProfile;
