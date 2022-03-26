import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import singinImage from '../assets/signup.jpg';

const cookies = new Cookies();

const initialState = {
    fullName:'',
    username:'',
    password:'',
    confirmPassword:'',
    phoneNumber:'',
    avatarURL:'',
}

const Auth = () => {

    const [form, setForm] = useState(initialState);

    const [isSignup, setIsSignup] = useState(true);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});

        
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, phoneNumber, avatarURL} = form;

        const URL='http://localhost:8080/auth';

        const {data : {token, userId, hashedPassword, fullName}} = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {username, password, fullName: form.fullName, phoneNumber, avatarURL});
        
        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('fullName', fullName);
        cookies.set('userId', userId);

        if(isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);

        }

        window.location.reload();
    
    
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup)=> !prevIsSignup);
    }

  return (
    <div className='auth__form-container'>
        <div className='auth__form-container_fields'>
            <div className='auth__form-container_fields-content'>
                <p>{isSignup ? 'Creează cont' : 'Autentificare'}</p>
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='fullName'>Nume și Prenume</label>
                            <input
                                name="fullName"
                                type="text"
                                placeholder='Nume și Prenume'
                                onChange={handleChange}
                                required    
                            
                            />
                        
                        
                        </div>
                    )}
                    <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='username'>Username</label>
                            <input
                                name="username"
                                type="text"
                                placeholder='Username'
                                onChange={handleChange}
                                required    
                            
                            />
                        
                        
                    </div>
                    {isSignup && (
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='phoneNumber'>Nr. Telefon</label>
                            <input
                                name="phoneNumber"
                                type="text"
                                placeholder='Nr. Telefon'
                                onChange={handleChange}
                                required    
                            
                            />
                        
                        
                        </div>
                    )}

                    {isSignup && (
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='avatarURL'>Imagine Avatar (URL)</label>
                            <input
                                name="avatarURL"
                                type="text"
                                placeholder='Imagine Avatar (URL)'
                                onChange={handleChange}
                                required    
                            
                            />
                        
                        
                        </div>
                    )}
                    <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='password'>Parolă</label>
                            <input
                                name="password"
                                type="password"
                                placeholder='Parolă'
                                onChange={handleChange}
                                required    
                            
                            />
                        
                        
                    </div>

                    {isSignup && (
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='confirmPassword'>Confirmare parolă</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder='Confirmare parolă'
                                onChange={handleChange}
                                required    
                            
                            />
                        
                        
                        </div>
                    )}

                    <div className='auth__form-container_fields-content_button'>
                        <button>{isSignup ? "Creează Cont" : "Conectează-te"}</button>
                    
                    </div>

                </form>

                <div className='auth__form-container_fields-account'>
                        <p>
                            {isSignup
                            ? "Există deja un cont creat?"
                            : "Nu există un cont creat?"
                            }
                            <span onClick={switchMode}>
                                {isSignup ? 'Autentificare' : 'Creează Cont'}
                            </span>
                        </p>
                        
                
                </div>

            </div>

        </div>
        <div className='auth__form-container_image'>
            <img src={singinImage} alt="sign in"/>
        
        </div>


    </div>
  )
}

export default Auth