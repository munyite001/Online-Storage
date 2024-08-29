import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Authenticate() {

    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [loginUser, setLoginUser] = useState({
        login_email: '',
        login_password: ''
    })

    //  Register user
    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/register`, user);
            if (response.status === 201) {
                alertError('✔ User created successfully', 'success');
                window.location.reload();
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const { status, data } = error.response;
    
                if (status === 400) {
                    alertError('* ' + data.message || '* User already exists', 'error');
                } else if (status === 412) {
                    alertError('* ' + data.message || '* A user with that Email already exists', 'error');
                } else {
                    alertError('* An unexpected error occurred.', 'error');
                }
            } else if (error.request) {
                // The request was made but no response was received
                alertError('* No response received from server.', 'error');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error Message:', error.message);
                alertError('* An unexpected error occurred.', 'error');
            }
        }
    }
    
    //  Login user
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/login`, loginUser);
            if (response.status === 200) {
                alertError('✔ Login successful', 'success');
                localStorage.setItem('token', response.data.token);
                navigate(`/dashboard/${response.data.id}`);
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const { status, data } = error.response;
    
                if (status === 404) {
                    alertError('* ' + data.message || '* User not found', 'error');
                } else if (status === 401) {
                    alertError('* ' + data.message || '* Invalid password', 'error');
                } else {
                    alertError('* An unexpected error occurred.', error);
                }
            }
        }
    }

    const alertError = (message, type) => {
        const errorBox = document.querySelector('.error-box');
        if (type === 'success') {
            errorBox.style.backgroundColor = '#d4edda';
            errorBox.style.color = 'green';
        } else {
            errorBox.style.color = '#721c24';
        }
        errorBox.innerHTML = message;
        errorBox.style.display = 'block';
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 3000);
    }

    return (
        <div className={isSignUp ? "right-panel-active container" : "container"} id="main">
            <div className="error-box"></div>
            <div className="sign-up">
                <form action="#">
                    <h1>Create account</h1>
                    <div className="social-container">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-google-plus-g"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <p>Or use your email for registration</p>
                    <input 
                        type="text" 
                        name="userName" 
                        placeholder="username" 
                        value={user.username} 
                        onChange={(e) => setUser({...user, username: e.target.value})}
                        required
                    />

                    <input 
                        type="email" 
                        name="txt" 
                        placeholder="Email" 
                        value={user.email} 
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        required
                    />

                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={user.password} 
                        onChange={(e) => setUser({...user, password: e.target.value})}
                        required
                    />

                    <button type="submit" onClick={handleRegistration}>Sign Up</button>
                
                </form>
            </div>
            <div className="sign-in">
                <form action="#">
                    <h1>Sign In</h1>
                    <div className="social-container">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-google-plus-g"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <p>Or login using your account</p>

                    <input 
                        type="email" 
                        name="login_email" 
                        placeholder="Email" 
                        value={loginUser.login_email} 
                        onChange={(e) => setLoginUser({...loginUser, login_email: e.target.value})}
                        required 
                    />
                    
                    <input 
                        type="password" 
                        name="login_password" 
                        placeholder="Password" 
                        value={loginUser.login_password} 
                        onChange={(e) => setLoginUser({...loginUser, login_password: e.target.value})}
                        required 
                    />
                    
                    <a href="#">Forget Your password?</a>

                    <button type="submit" onClick={handleLogin}>Sign In</button>
                </form>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-left">
                        <h1>Welcome Back</h1>
                        <p>To keep connected with us, please login with your personal info</p>
                        <button type="button" id="signIn" onClick={() => setIsSignUp(false)}>Sign In</button>
                    </div>
                    <div className="overlay-right">
                        <h1>Hello, Friend</h1>
                        <p>Enter your personal details and start your journey with us</p>
                        <button type="button" id="signUp" onClick={() => setIsSignUp(true)}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
