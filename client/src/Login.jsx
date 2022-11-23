import React, { useState } from "react";



//creating the Register component
//export const *name of component*
export const Login = (props) => {

    //creating a state, inside brackets you put the name of the state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //capturing the state when the user submits the form
    const handleSubmit = (e) => {
        e.preventDefaut();
        console.log(email);
    }

    return (
        //returning react fragment
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email" >Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="abc@mail.com" id="email" name="email" />

                <label htmlFor="password" >Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*****" id="password" name="password" />

                <button type="submit">Login</button>


            </form>

            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Sign Up here!</button>
        </div>
    )
}