import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function Profile() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const userProfile = {
        name: "Samik Bhandari",
        email: "samik.bhandari@islingtoncollege.edu.np",
        role: "IT Manager",
        location: "Boudha, Kathmandu",
        about: "Experienced IT professional with expertise in managing technology infrastructure and leading technical teams. Passionate about implementing innovative solutions and driving digital transformation initiatives."
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentuser');
        navigate('/');
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <button className="back-button" onClick={handleBackToHome}>
                    ← Back to Home
                </button>
                <button className="close-button" onClick={handleBackToHome}>
                    ×
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-picture">
                    <div className="avatar">
                        <span>{userProfile.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="name-section">
                        <h1 className="user-name">{userProfile.name}</h1>
                        <div className="dropdown-container">
                            <button 
                                className="dropdown-toggle"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                ⋮
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <button className="dropdown-item">My Account</button>
                                    <button className="dropdown-item">Edit</button>
                                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="user-details">
                        <div className="detail-item">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{userProfile.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Role:</span>
                            <span className="detail-value">{userProfile.role}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">{userProfile.location}</span>
                        </div>
                    </div>

                    <div className="about-section">
                        <h2>About</h2>
                        <p className="about-text">{userProfile.about}</p>
                    </div>

                    <div className="profile-actions">
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 