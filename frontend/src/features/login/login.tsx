import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom"; 
import "./login.css";
import type { AxiosError, AxiosResponse } from "axios";
import { loginApi, registerApi } from "../../shared/config/api";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLogin) {
            loginApi({
                username: formData.username,
                password: formData.password
            })
            .then((res: AxiosResponse) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('currentuser', JSON.stringify(res.data.user));
                // Use window.location.href for immediate redirect
                window.location.href = "/home";
            })
            .catch((error: AxiosError) => {
                console.error(error);
                alert("Login failed. Please try again.");
            });

        } else {
            registerApi({
                username: formData.username,
                password: formData.password,
                email: formData.email
            })
            .then((res: AxiosResponse) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('currentuser', JSON.stringify({
                    username: formData.username
                }));
                // Use window.location.href for immediate redirect
                window.location.href = "/home";
            })
            .catch((error: AxiosError) => {
                console.error(error);
                alert("Registration failed. Please try again.");
            });
        }
    };

    return (
        <div>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>{isLogin ? "Login" : "Register"}</h2>

                <input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    value={formData.username}
                    type="text"
                    required
                />

                {!isLogin && (
                    <input
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={formData.email}
                        type="email"
                        required
                    />
                )}

                <input
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    type="password"
                    required
                />

                <button type="submit">{isLogin ? "Login" : "Register"}</button>

                <p
                    style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin
                        ? "Don't have an account? Register"
                        : "Already have an account? Login"}
                </p>
            </form>
        </div>
    );
}
