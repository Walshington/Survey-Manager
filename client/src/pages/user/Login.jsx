import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../util/AuthProvider";

export const Login = (props) => {
  //creating a state, inside brackets you put the name of the state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();

  //capturing the state when the user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    try {
      const result = await axios.post("http://127.0.0.1:7777/login", user);
      console.log(result);
      if (result.status === 201) {
        alert("User not found!");
        throw new Error("User not found");
      }
      auth.login(user);
    } catch (error) {
      throw new Error("Failed to login");
    }
  };

  return (
    //returning react fragment
    <div className="auth-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>

      <button
        className="link-btn"
        onClick={() => props.onFormSwitch("register")}
      >
        Sign Up here!
      </button>
    </div>
  );
};
