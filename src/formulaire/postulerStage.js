import React, { useContext, useEffect, useState } from 'react';
import { useHttpClient } from "../shared/hooks/http-hook";
import { useForm } from "../shared/hooks/form-hook";
import { AuthContext } from '../shared/context/auth-context';
import { useHistory } from 'react-router-dom';
import style from './postulerStage.css';


const PostulerStage = ({ stageId }) => {
  const { sendRequest } = useHttpClient();
  const [loadedEtudiant, setLoadedEtudiant] = useState();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const CancelSubmit = () => {
    history.push('/listeStage');
  };
  
  useEffect(() => {
    const fetchEtudiant = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/etudiant/${auth.userId}`);
        setLoadedEtudiant(responseData.etudiant);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEtudiant();
  }, [sendRequest, auth.userId]);

  const postulerStageHandler = async (event) => {
    event.preventDefault();
    
  }

  return (
    <div className="PostulerStage-form">
      {loadedEtudiant && (
        <form onSubmit={postulerStageHandler}>
          <div>
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" id="lastname" value={loadedEtudiant.nom} readOnly />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input type="text" id="address" value={loadedEtudiant.addressEtu} readOnly />
          </div>
          <div>
            <label htmlFor="phone">Phone:</label>
            <input type="tel" id="phone" value={loadedEtudiant.numTel} readOnly />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={loadedEtudiant.email} readOnly />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => CancelSubmit()}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default PostulerStage;
