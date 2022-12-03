import React, { useState } from "react";
import axios from "axios";

export const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      name: name,
      email: email,
      password: password,
    };
    try {
      const result = await axios.post("http://127.0.0.1:7777/register", user);
      alert("Successfully signed up!");
      console.log(result);
    } catch (error) {
      throw new Error("Failed to register");
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create your account</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="name"
          placeholder="Bob"
          id="name"
          name="name"
        />

        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="abc@mail.com"
          id="email"
          name="email"
        />

        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="*****"
          id="password"
          name="password"
        />

        <button type="submit">Sign Up</button>
      </form>

      <button className="link-btn" onClick={() => props.onFormSwitch("login")}>
        Already Have an Account? Log In!
      </button>
    </div>
  );
};
