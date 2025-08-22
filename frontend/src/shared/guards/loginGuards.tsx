// src/shared/guards/loginGuards.tsx
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface LoginGuardProps {
  children: JSX.Element;
}

const LoginGuard = ({ children }: LoginGuardProps): JSX.Element => {
  const user = localStorage.getItem('currentuser');
  console.log("LoginGuard → currentuser:", user); // optional debug

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default LoginGuard;

