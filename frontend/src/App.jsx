import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

const App = () => {
  let authUser = 0

  return (
    <>
      {/* <h1 className="flex items-center justify-center">Hello World</h1> */}
      <div className="flex justify-center items-center flex-col text-3xl font-extrabold">
        <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to = {"/login"}/>}
        />

        <Route 
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"}/>}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to = {"/"}/>}
        />
      </Routes>
      </div>
    </>
  )

}

export default App;