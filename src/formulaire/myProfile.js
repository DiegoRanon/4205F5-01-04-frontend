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
    const [addressEtu, setAddressEtu] = useState('');



  
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
      },
      adressEtu: {
        value: '',
        isValid: false
      }
    },
    false
  );

    const fetchUtilisateur = async () => {
      access = true;
      try {
        const reponseData = await sendRequest(`https://backend-2h23.onrender.com/etudiant/${userId}`);
        if (reponseData.success) {
          setEtudiant(true);
          utilisateur = reponseData.etudiant;
          // Setup des variables
          setNom(utilisateur.nom);
          setEmail(utilisateur.email);
          setMotDePasse(utilisateur.motdepasse);
          setNumTel(utilisateur.numTel);
          setAddressEtu(utilisateur.addressEtu);
          
          
        } else {
          const reponseData = await sendRequest(`https://backend-2h23.onrender.com/employeur/${userId}`);
          if (reponseData.success) {
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

    if(access === false) {
    fetchUtilisateur();
    }
  
    
  const handleSubmit = async (event) => {
    event.preventDefault();
    let reponseData = null;
    try {
      if(etudiant) {
      
      reponseData = await sendRequest(`https://backend-2h23.onrender.com/etudiant/${userId}`,
        "PATCH",
        JSON.stringify({
            nom:nom,
            email: email,
            motdepasse: motdepasse,
            numTel:numTel,
            addressEtu:addressEtu
        }),
        {
            "Content-Type": "application/json",
        }
    );
    
      } else {
        reponseData = await sendRequest(`https://backend-2h23.onrender.com/employeur/${userId}`,
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
             <div>
            <p>Nom: <strong>{nom}</strong></p>
            <p>Email: <strong>{email}</strong></p>
            <p>Numero de telephone: <strong>{numTel}</strong> </p>
            <p>Adresse de l'étudiant: <strong>{addressEtu}</strong> </p>
              </div>
            </form>
          </div>
        )}
   
        {employeur && (
          <div>
            <form onSubmit={handleSubmit}>
            <div>
            <p>Nom: <strong>{nom}</strong> </p>
            <p>Email: <strong>{email}</strong> </p>
            <p>Numero de telephone: <strong>{numTel}</strong></p>
            <p>nomEntreprise: <strong>{nomEntreprise}</strong> </p>
            <p>adresseEntreprise: <strong>{adresseEntreprise}</strong> </p>
            <p>posteTel: <strong>{posteTel}</strong></p>
              </div>
           </form>
          </div>
        )}

            <div className="form-group">
            <Link to="/modifAccount" className="linkC" >
              Modifier le compte
            </Link>
            </div>
          
      </div>
    </AuthContext.Provider>
  );
}

export default MyProfile;
//<p>Nom:{utilisateur.nom}</p>
//<p>Adresse de lentreprise : {stage.adresseEntreprise}</p>