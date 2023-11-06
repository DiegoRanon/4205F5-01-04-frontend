import React, { useEffect, useState, useContext} from 'react';
import './detailsStage.css';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../shared/context/auth-context';
import { useHttpClient } from "../shared/hooks/http-hook";

const StageDetails = () => {
  const location = useLocation();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const stage = location.state || {};
  const { error, sendRequest, clearError } = useHttpClient();
  const [userType, setUserType] = useState("");
  const [appliedStudents, setAppliedStudents] = useState([]);
  const currentDate = new Date();

  useEffect(() => {
    const fetchUtilisateur = async () => {
      try {
        const reponseData = await sendRequest(`http://localhost:5000/etudiant/${userId}`);
        if (reponseData.success) {
          setUserType(reponseData.etudiant.userType);
        } else {
          const reponseData = await sendRequest(`http://localhost:5000/employeur/${userId}`);
          if (reponseData.success) {
            setUserType(reponseData.employeur.userType); 
          }
        }
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };

    if (auth.isLoggedIn) {
      fetchUtilisateur();
    }
  }, [auth.isLoggedIn, userId, sendRequest]);

  useEffect(() => {
    if (userType === 'employeur') {
      checkingPostuler();
    }
  }, [userType]);
 
  const checkingPostuler = async function () {
    let reponseData = null;
    let etudiants = [];
    try {

      reponseData = await sendRequest(`http://localhost:5000/stage/getEtudiants/${stage.id}`);
      if (reponseData && reponseData.etudiants) {
        const studentDetails = reponseData.etudiants.map(etudiantId =>
          sendRequest(`http://localhost:5000/etudiant/${etudiantId}`)
        );
      const studentsDetails = await Promise.all(studentDetails);
      setAppliedStudents(studentsDetails.map(detail => detail.etudiant));
      }
     } catch (err) {
      console.log(err);
      alert("Erreur pour recuperer etudiants");
  }
  }
  const renderAppliedStudents = () => {
    return appliedStudents.map((student, index) => (
      <div key={index} className="student-details">
        
        <p>Name: {student.nom}</p>
        <p>Email: {student.email}</p>
        <p>Phone Number: {student.numTel}</p>
        <p>Date: {stage.dateEtudiants[index]}</p>
      </div>
    ));
  };
  


  const handleSubmit = async (event) => {
    event.preventDefault();
    let reponseData = null;
    try {

        reponseData = await sendRequest(
            `http://localhost:5000/stage/postulerStage/${stage.id}`,
            "POST",
            JSON.stringify({
                etudiantId: auth.userId,
                date:currentDate.toString()
            }),
            {
                "Content-Type": "application/json",
            }
        );
          alert("Vous avez postulé au stage de " + stage.nomEntreprise);
        
        
       } catch (err) {
        
        console.log(err);
        alert("An error noccurred while attempting to apply to the intership.");
        
    }
};


  return (
    <form onSubmit={handleSubmit}>
    <div className="stage-details">
      <h1>Stage Details</h1>
      <div className="detail-item">
        <label>Name:</label>
        <span>{stage.nom}</span>
      </div>
      <div className="detail-item">
        <label>Email:</label>
        <span>{stage.courriel}</span>
      </div>
      <div className="detail-item">
        <label>Phone Number:</label>
        <span>{stage.numeroTel}</span>
      </div>
      <div className="detail-item">
        <label>Company Name:</label>
        <span>{stage.nomEntreprise}</span>
      </div>
      <div className="detail-item">
        <label>Company Address:</label>
        <span>{stage.adresseEntreprise}</span>
      </div>
      <div className="detail-item">
        <label>Internship Type:</label>
        <span>{stage.typeStage}</span>
      </div>
      <div className="detail-item">
        <label>Description:</label>
        <span>{stage.descriptionStage}</span>
      </div>
      <div className="detail-item">
        <label>Remuneration:</label>
        <span>{stage.remuneration}</span>
      </div>
      {userType === 'etudiant' && <button type="submit">Postuler</button>}
      {userType === 'employeur' && (
          <div>
            <h2>Students Applied</h2>
            {renderAppliedStudents()}
          </div>
        )}
    </div>
    </form>
  );
}

export default StageDetails;
