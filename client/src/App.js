import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/user/Landing";
import Survey from "./pages/survey";
import { ProtectedRoute } from "./util/ProtectedRoute";
import { AuthProvider } from "./util/AuthProvider";
import TopMenuBar from "./util/AppBar";
import CreateSurvey from "./pages/survey/Survey";
import SurveyCreater from "./pages/survey/CreateSurvey";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/surveys"
          element={
            <ProtectedRoute>
              <TopMenuBar />
              <Survey />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <TopMenuBar />
              <CreateSurvey />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
