import React, { useState, useContext,useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import './Login.css';
import Logo from './assets/logo.png';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext } from './App';
const Login = () => {
    const url1= 'http://localhost:8000/Login';
    const url2= 'http://localhost:8000/Register';
    const [action, setAction] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUserId, setToken,token } = useContext(UserContext);
    useEffect(() => {
        const checkJWT = async () => {
            try {
              const response = await fetch('http://localhost:8000/User', {
                method: 'GET',
                credentials: 'include',  // Include cookies with the request
              });
          
              const data = await response.json();
          
              if (response.ok && data.success) {
                console.log('User authenticated:', data.user);
                // Set the user state or handle successful authentication
                navigate('/Homepage');
              } else {
                console.error('User not authenticated:', data.message);
              }
            } catch (error) {
              console.error('Error checking JWT:', error);
            }
          };
    
        checkJWT(); // Call the async function
    }, []);
    const registerLink = () => {
        setAction(' active');
    };
    const handleRemember = () => {
        
    };
    const loginLink = () => {
        setAction('');
    };
    
    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch(url1, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                const storedUsername = localStorage.getItem('userlocal');
                if (storedUsername && storedUsername !== username) {
                    localStorage.removeItem('searchItems'); // Clear the search array
                }
                setUserId(username);  
                setToken( data.token); 
                localStorage.setItem('userlocal', username);
                
                navigate('/Homepage');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegister = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch(url2, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userlocal', username);
                setUserId(username);                
                navigate('/Homepage');
            } else {
                console.error(data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div className={`wrapper${action}`}>
                <div className="form-box login">
                    <form onSubmit={handleLogin}>
                        <img src={Logo} className="form-logo" alt="Logo" />
                        <h1>Login</h1>
                        <div className="input-box">
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <FaLock className="icon" />
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox" onClick={handleRemember}/>Remember me</label>
                            <a href="#" onClick={registerLink}>Forgot Password?</a>
                        </div>
                        <button type="submit">Login</button>
                        <div className="register-link">
                            <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                        </div>
                    </form>
                </div>

                <div className="form-box register">
                    <form onSubmit={handleRegister}>
                        <img src={Logo} className="form-logo" alt="Logo" />
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                            <FaEnvelope className="icon" />
                        </div>
                        <div className="input-box">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <FaLock className="icon" />
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox" />I agree to Terms & Conditions</label>
                        </div>
                        <button type="submit">Register</button>
                        <div className="register-link">
                            <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
