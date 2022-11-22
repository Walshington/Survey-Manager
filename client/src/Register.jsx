import React, { useState } from "react";


//creating the Register component
//export const *name of component*
export const Register = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    //capturing the state when the user submits the form
    const handleSubmit = (e) => {
        e.preventDefaut();
        console.log(email);
    }


    return (
        //returning react fragment 
        <div className="auth-form-container">
            <h2>Sign Up!</h2>
            <form className="register-form" onSubmit={handleSubmit}>

                <label htmlFor="name" >Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="name" placeholder="Bob" id="name" name="name" />

                <label htmlFor="email" >Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="abc@mail.com" id="email" name="email" />

                <label htmlFor="password" >Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*****" id="password" name="password" />

                <button type="submit">Login</button>


            </form>

            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already Have an Account? Log In!</button>
        </div>
    )
}