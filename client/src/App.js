import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/user/Landing";
import { ProtectedRoute } from "./util/ProtectedRoute";
import { AuthProvider } from "./util/AuthProvider";
import TopMenuBar from "./util/AppBar";
import CreateSurvey from "./pages/survey/CreateSurvey";
import SurveyCards from "./pages/survey";
import Responses from "./pages/survey/MySurvey";
import CompleteSurvey from "./pages/survey/CompleteSurvey";

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
              <SurveyCards />
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
        <Route
          path="/mysurveys"
          element={
            <ProtectedRoute>
              <TopMenuBar />
              <Responses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surveys/:id"
          element={
            <ProtectedRoute>
              <TopMenuBar />
              <CompleteSurvey />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
