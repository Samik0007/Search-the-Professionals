import { useState } from "react";
 
import "./login.css";
import type { AxiosResponse } from "axios";
import { loginApi, registerApi } from "../../shared/config/api";
import { useForm } from "react-hook-form";

// TypeScript interfaces for form data
interface ILoginForm {
    username: string;
    password: string;
}

interface IRegisterForm {
    username: string;
    password: string;
    email: string;
}

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true); 

    // React Hook Form for login
    const loginForm = useForm<ILoginForm>({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    // React Hook Form for registration
    const registerForm = useForm<IRegisterForm>({
        defaultValues: {
            username: '',
            password: '',
            email: ''
        }
    });

    // Handle login submission
    const onLoginSubmit = async (data: ILoginForm) => {
        try {
            const response: AxiosResponse = await loginApi(data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('currentuser', JSON.stringify(response.data.user));
            window.location.href = "/home";
        } catch (error: any) {
            const serverMsg: string = error?.response?.data?.message || 'Login failed. Please try again.';
            // Map common messages to field errors when possible
            if (/user not found/i.test(serverMsg)) {
                loginForm.setError('username', { type: 'server', message: 'User not found' });
            } else if (/invalid credentials/i.test(serverMsg)) {
                loginForm.setError('password', { type: 'server', message: 'Invalid credentials' });
            } else {
                loginForm.setError('root', { type: 'server', message: serverMsg });
            }
        }
    };

    // Handle registration submission
    const onRegisterSubmit = async (data: IRegisterForm) => {
        try {
            await registerApi(data);
            // Don't store user data or redirect to home after registration
            // Just show success and stay on login page
            alert("Registration successful! Please login with your credentials.");
            setIsLogin(true);
            registerForm.reset();
        } catch (error: any) {
            const serverMsg: string = error?.response?.data?.message || 'Registration failed. Please try again.';
            // Map backend messages to specific fields for better UX
            if (/email.*exists/i.test(serverMsg)) {
                registerForm.setError('email', { type: 'server', message: 'Email already exists' });
            } else if (/username.*exists/i.test(serverMsg)) {
                registerForm.setError('username', { type: 'server', message: 'Username already exists' });
            } else if (/password.*6/i.test(serverMsg)) {
                registerForm.setError('password', { type: 'server', message: 'Password must be at least 6 characters' });
            } else {
                registerForm.setError('root', { type: 'server', message: serverMsg });
            }
        }
    };

    return (
        <div>
            {isLogin ? (
                // Login Form
                <form className="login-form" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <h2>Login</h2>

                    <div className="form-group">
                        <input
                            {...loginForm.register("username", { 
                                required: "Username is required",
                                minLength: { value: 3, message: "Username must be at least 3 characters" }
                            })}
                            placeholder="Username"
                            type="text"
                            className={loginForm.formState.errors.username ? 'error' : ''}
                        />
                        {loginForm.formState.errors.username && (
                            <span className="error-text">{loginForm.formState.errors.username.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            {...loginForm.register("password", { 
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            })}
                            placeholder="Password"
                            type="password"
                            className={loginForm.formState.errors.password ? 'error' : ''}
                        />
                        {loginForm.formState.errors.password && (
                            <span className="error-text">{loginForm.formState.errors.password.message}</span>
                        )}
                    </div>

                    {loginForm.formState.errors.root?.message && (
                        <div className="error-message" style={{ marginTop: 4 }}>
                            {loginForm.formState.errors.root.message}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loginForm.formState.isSubmitting}
                    >
                        {loginForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
                    </button>

                    <p
                        style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
                        onClick={() => {
                            setIsLogin(false);
                            loginForm.reset();
                        }}
                    >
                        Don't have an account? Register
                    </p>
                </form>
            ) : (
                // Registration Form
                <form className="login-form" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <h2>Register</h2>

                    <div className="form-group">
                        <input
                            {...registerForm.register("username", { 
                                required: "Username is required",
                                minLength: { value: 3, message: "Username must be at least 3 characters" }
                            })}
                            placeholder="Username"
                            type="text"
                            className={registerForm.formState.errors.username ? 'error' : ''}
                        />
                        {registerForm.formState.errors.username && (
                            <span className="error-text">{registerForm.formState.errors.username.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            {...registerForm.register("email", { 
                                required: "Email is required",
                                pattern: { 
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                                    message: "Please enter a valid email address" 
                                }
                            })}
                            placeholder="Email"
                            type="email"
                            className={registerForm.formState.errors.email ? 'error' : ''}
                        />
                        {registerForm.formState.errors.email && (
                            <span className="error-text">{registerForm.formState.errors.email.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            {...registerForm.register("password", { 
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            })}
                            placeholder="Password"
                            type="password"
                            className={registerForm.formState.errors.password ? 'error' : ''}
                        />
                        {registerForm.formState.errors.password && (
                            <span className="error-text">{registerForm.formState.errors.password.message}</span>
                        )}
                    </div>

                    {registerForm.formState.errors.root?.message && (
                        <div className="error-message" style={{ marginTop: 4 }}>
                            {registerForm.formState.errors.root.message}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={registerForm.formState.isSubmitting}
                    >
                        {registerForm.formState.isSubmitting ? 'Creating Account...' : 'Register'}
                    </button>

                    <p
                        style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
                        onClick={() => {
                            setIsLogin(true);
                            registerForm.reset();
                        }}
                    >
                        Already have an account? Login
                    </p>
                </form>
            )}
        </div>
    );
}
