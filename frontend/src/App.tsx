// src/App.tsx
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './features/login/login';
import Homepage from './features/home/homepage';
import LoginGuard from './shared/guards/loginGuards';
import Register from './features/register/register'; 
import Profile from './features/profile/profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoginGuard>
              <Login />
            </LoginGuard>
          }
        />
        <Route
          path="/register"
          element={
            <LoginGuard>
              <Register />
            </LoginGuard>
          }
        />
        <Route
          path="/home"
          element={
            localStorage.getItem('currentuser') ? <Homepage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/profile"
          element={
            localStorage.getItem('currentuser') ? <Profile /> : <Navigate to="/" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
