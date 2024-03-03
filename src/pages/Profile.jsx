import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Profile(props) {
    const arrow = "->";
    const [match, setMatch] = useState(null);
    const [weakPassword, setWeakPassword] = useState(null);
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/.netlify/functions/profile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: props.userEmail })
                });
                if (response.status === 200) {
                    const data = await response.json();
                    setUserData(data.user);
                } else {
                    console.log("Error while fetching data");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchUserData();
    }, [props.userEmail])

    const isWeakPassword = (password) => {
        if (password.length < 8) return true;
        if (/^[a-z]+$/.test(password)) return true;
        if (/^\d+$/.test(password)) return true;
        if (/^[^a-zA-Z0-9]+$/.test(password)) return true;
        const commonPasswords = ["password", "123456", "qwerty", "abc123"];
        if (commonPasswords.includes(password.toLowerCase())) return true;
        return false;
    }

    const handleChangePassword = async (e) => {
        // e.preventDefault();
        let newPassword = document.getElementById('newPassword').value;
        let reNewPassword = document.getElementById('reNewPassword').value;
        if (newPassword !== reNewPassword || newPassword === "") {
            setMatch(false);
            return;
        }
        if (isWeakPassword(newPassword)){
            setWeakPassword(true);
            return;
        }
        setMatch(true);
        try {
            const response = await fetch("/.netlify/functions/password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newPassword, email: props.userEmail })
            });
            if (response.status === 200) {
                setMatch(null);
                setWeakPassword(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Password changed successfully!',
                });
                console.log("Password changed successfully");
            } 
            else if (response.status === 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'New password must be different from the old password!',
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error while changing password!',
                });
                console.log("Error while changing password");
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Internal server error!',
            });
            console.error("Error:", error);
        }
    };
    

    const showPassword = (id) => {
        const passwordInput = document.getElementById(id);
        const togglePasswordButton = id === "newPassword" ? document.getElementById("togglePassword1") : document.getElementById("togglePassword2");
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePasswordButton.textContent = type === "password" ? "👁️‍🗨️" : "👁️";
    }

    return (
        <div className="mt-36 lg:mt-32 max-w-lg mx-auto rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">{props.userName || "-"}</h1>
                    <p className="text-gray-600">{props.userEmail || "-"}</p>
                </div>
            </div>
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Quiz History</h2>
                {userData && userData.solvedQuizzes && (
                    <ul className="list-disc pl-4">
                        {userData.solvedQuizzes.map(item => (
                            <li key={item.id} className="text-gray-600 mb-2">
                                <span className="text-lg text-blue-600">{item.title}  {arrow}</span>
                                <span className="ml-2 text-lg text-green-600">Last Score: {item.score}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-2">Password Settings</h2>
                <div className="flex flex-col">
                    <div className="text-center">
                        <input type="password" id="newPassword" className="m-2 border p-2 text-center" placeholder="Enter New Password"></input>
                        <button id="togglePassword1" onClick={() => showPassword("newPassword")}>👁️‍🗨️</button>
                    </div>
                    <div className="text-center">
                        <input type="password" id="reNewPassword" className="m-2 mb-2 border p-2 text-center" placeholder="Re-Enter New Password"></input>
                        <button id="togglePassword2" onClick={() => showPassword("reNewPassword")}>👁️‍🗨️</button>
                    </div>
                    {match !== null && !match && <p className="text-red-500 text-center m-2">❌Passwords do not match</p>}
                    {weakPassword !== null && weakPassword && (<p className="text-blue-500 text-center m-2">❗Password is weak. It should be at least 8 characters long and contain a combination of letters, numbers, and special characters.</p>)}
                    {match && <p className="text-green-600 text-center m-2">✅Passwords match</p>}
                    <button onClick={handleChangePassword} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Reset Password</button>
                </div>
            </div>
        </div>
    );
}