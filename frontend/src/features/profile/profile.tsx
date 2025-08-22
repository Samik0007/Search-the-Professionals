import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

interface UserProfile {
    username: string;
    email: string;
    designation: string;
    address: string;
    bio: string;
}

export default function Profile() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Original profile data
    const [originalProfile, setOriginalProfile] = useState<UserProfile>({
        username: "Samik Bhandari",
        email: "samik.bhandari@islingtoncollege.edu.np",
        designation: "Frontend Developer",
        address: "Boudha, Kathmandu",
        bio: "Experienced IT professional with expertise in managing technology infrastructure and leading technical teams. Passionate about implementing innovative solutions and driving digital transformation initiatives."
    });

    // Editable profile data
    const [profile, setProfile] = useState<UserProfile>(originalProfile);
    const [errors, setErrors] = useState<Partial<UserProfile>>({});

    useEffect(() => {
        // Load user data from localStorage if available
        const currentUser = localStorage.getItem('currentuser');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                if (userData.username) {
                    setOriginalProfile(prev => ({
                        ...prev,
                        username: userData.username
                    }));
                    setProfile(prev => ({
                        ...prev,
                        username: userData.username
                    }));
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Partial<UserProfile> = {};

        if (!profile.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (profile.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!profile.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(profile.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!profile.designation.trim()) {
            newErrors.designation = 'Designation is required';
        }

        if (!profile.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!profile.bio.trim()) {
            newErrors.bio = 'Bio is required';
        } else if (profile.bio.length < 10) {
            newErrors.bio = 'Bio must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update original profile and localStorage
            setOriginalProfile(profile);
            
            const currentUser = localStorage.getItem('currentuser');
            if (currentUser) {
                const userData = JSON.parse(currentUser);
                userData.username = profile.username;
                localStorage.setItem('currentuser', JSON.stringify(userData));
            }
            
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setErrors({});
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsDropdownOpen(false);
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
                        <span>{profile.username.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="name-section">
                        {isEditing ? (
                            <div className="edit-name-section">
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className={`edit-username-input ${errors.username ? 'error' : ''}`}
                                    placeholder="Enter username"
                                />
                                {errors.username && <span className="error-text">{errors.username}</span>}
                            </div>
                        ) : (
                            <h1 className="user-name">{profile.username}</h1>
                        )}
                        
                        {!isEditing && (
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
                                        <button className="dropdown-item" onClick={handleEdit}>Edit</button>
                                        <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="user-details">
                        <div className="detail-item">
                            <span className="detail-label">Email:</span>
                            {isEditing ? (
                                <div className="detail-edit-section">
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`detail-input ${errors.email ? 'error' : ''}`}
                                        placeholder="Enter email"
                                    />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>
                            ) : (
                                <span className="detail-value">{profile.email}</span>
                            )}
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">Designation:</span>
                            {isEditing ? (
                                <div className="detail-edit-section">
                                    <input
                                        type="text"
                                        value={profile.designation}
                                        onChange={(e) => handleInputChange('designation', e.target.value)}
                                        className={`detail-input ${errors.designation ? 'error' : ''}`}
                                        placeholder="Enter designation"
                                    />
                                    {errors.designation && <span className="error-text">{errors.designation}</span>}
                                </div>
                            ) : (
                                <span className="detail-value">{profile.designation}</span>
                            )}
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">Address:</span>
                            {isEditing ? (
                                <div className="detail-edit-section">
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className={`detail-input ${errors.address ? 'error' : ''}`}
                                        placeholder="Enter address"
                                    />
                                    {errors.address && <span className="error-text">{errors.address}</span>}
                                </div>
                            ) : (
                                <span className="detail-value">{profile.address}</span>
                            )}
                        </div>
                    </div>

                    <div className="about-section">
                        <h2>Bio</h2>
                        {isEditing ? (
                            <div className="bio-edit-section">
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className={`bio-textarea ${errors.bio ? 'error' : ''}`}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                                {errors.bio && <span className="error-text">{errors.bio}</span>}
                            </div>
                        ) : (
                            <p className="about-text">{profile.bio}</p>
                        )}
                    </div>

                    <div className="profile-actions">
                        {isEditing ? (
                            <div className="edit-actions">
                                <button 
                                    className="save-button" 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    className="cancel-button" 
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <button className="edit-profile-button" onClick={handleEdit}>
                                    Edit Profile
                                </button>
                                <button className="logout-button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}