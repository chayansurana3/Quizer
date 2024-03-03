import React, { useState } from "react"
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function Button({ value, onClick }) {
    return (
        <button onClick={onClick} className="mt-6 transition transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg">{value}</button>
    );
}

function Input({ type, id, name, label, placeholder, value, onChange, autofocus }) {
    return (
        <label className="text-gray-500 block mt-3">{label}
            <input autoFocus={autofocus} onChange={onChange} type={type} id={id} name={name} placeholder={placeholder} value={value} className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100" />
        </label>
    );
}

export default function SignUp(props) {

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: ""
    });

    const [isSubmitting, setSubmitting] = useState(false);
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
            const response = await fetch("/.netlify/functions/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "User Already Exists! Try Logging In",
                }).then(() => navigate("/login"));
            }
            else if (response.status === 500) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Internal Server Error! Try Again",
                });
            }
            else{
                const data = await response.json();
                props.LogIn();
                props.setName(formData.userName);
                console.log(data); 
                setFormData({
                    userName: "",
                    email: "",
                    password: ""
                });
                Swal.fire({
                    icon: "success",
                    title: "Success...",
                    text: "You have been successfully logged in!",
                }).then(() => navigate("/"));
            }
        } catch (error) {
            console.error("Error:", error); 
        }
        setSubmitting(false);
    };

    return (
        <div className="mt-32 lg:mt-24 bg-gray-200 flex justify-center items-center h-screen w-screen">
            <div className="border-t-8 rounded-sm border-indigo-600 bg-white p-12 shadow-2xl w-96">
                <h1 className="font-bold text-center block text-2xl">Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <Input type="name" id="userName" name="userName" label="Name" placeholder="Adam Brown" autofocus={true} onChange={handleChange} />
                    <Input type="email" id="email" name="email" label="Email Address" placeholder="me@example.com" onChange={handleChange} />
                    <Input type="password" id="password" name="password" label="Password" placeholder="••••••••••" onChange={handleChange} />
                    <Button value={isSubmitting ? "Signing Up . . ." : "Sign Up"} />
                </form>
            </div>
        </div>
    );
}