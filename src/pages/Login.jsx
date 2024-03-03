import React, { useState } from "react";
import Swal from 'sweetalert2';
import { Link, useNavigate } from "react-router-dom";

function Button({ value, onClick }) {
    return (
        <button onClick={onClick} className="mt-4 transition transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg">{value}</button>
    );
}

function Input({ type, id, name, label, placeholder, value, onChange, autofocus }) {
    return (
        <label className="text-gray-500 block mt-3">{label}
            <input autoFocus={autofocus} type={type} id={id} name={name} placeholder={placeholder} value={value} onChange={onChange} className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100" />
        </label>
    );
}

export default function Login(props) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    
    const [isSubmitting, setSubmitting] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch("/.netlify/functions/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.status === 400) {
                setInvalid(true);
            } else if (response.status === 500) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Internal Server Error! Try Again",
                });
            } else {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                props.LogIn();
                setFormData({
                    email: "",
                    password: ""
                });
                Swal.fire({
                    icon: "success",
                    title: "Success...",
                    text: "You have been successfully logged in!",
                });
                props.setName(data.user.userName);
                navigate("/");
            }
        } catch (error) {
            console.error("Error:", error);
        }
        setSubmitting(false);
    };

    return (
        <div className="mt-32 lg:mt-24 bg-gray-200 flex justify-center items-center h-screen w-screen">
            <div className="border-t-8 rounded-sm border-indigo-600 bg-white p-12 shadow-2xl w-96">
                <h1 className="font-bold text-center block text-2xl">Log In</h1>
                <form onSubmit={handleSubmit}>
                    <Input type="email" id="email" name="email" label="Email Address" placeholder="me@example.com" value={formData.email} onChange={handleChange} autofocus={true} />
                    <Input type="password" id="password" name="password" label="Password" placeholder="••••••••••" value={formData.password} onChange={handleChange} />
                    <p className="text-center mt-2">Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link></p>
                    {invalid ? <p className="text-center mt-2 text-red-400">Invalid Email or Password. Try Again</p> : null}
                    <Button value={isSubmitting ? "Logging In . . ." : "Log In"} />
                </form>
            </div>
        </div>
    );
}