import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/user/Landing";
import Survey from "./pages/survey";
import { ProtectedRoute } from "./util/ProtectedRoute";
import { AuthProvider } from "./util/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/surveys"
          element={
            <ProtectedRoute>
              <Survey />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
