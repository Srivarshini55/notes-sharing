import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function SignupModal({ setShow }) {
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const signup = async () => {
        const res = await axios.post("https://notes-backend-3mph.onrender.com/signup", form);

        if (res.data.message === "Signup successful") {
            toast.success(res.data.message);
            setShow(false);
        } else {
            toast.error(res.data.message);
        }
    };

    return (
        <div style={overlay}>
            <div style={modal}>
                <h2>Signup</h2>
                <input style={input} placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
                <input style={input} placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
                <input style={input} type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
                <button style={btn} onClick={signup}>Signup</button>
                <button style={closeBtn} onClick={() => setShow(false)}>Close</button>
            </div>
        </div>
    );
}

/* SAME STYLES */

const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.8)",
};

const modal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    padding: "30px",
    borderRadius: "20px",
    color: "white",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 0 20px rgba(0,0,0,0.7)"
};

const input = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none"
};

const btn = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "20px",
    border: "none",
    background: "linear-gradient(to right, #ff6600, #ff00cc)",
    color: "white",
    cursor: "pointer",
    transition: "0.3s",
};

const closeBtn = {
    marginTop: "10px",
    padding: "8px",
    borderRadius: "15px",
    border: "none",
    background: "#444",
    color: "white",
    cursor: "pointer"
};

export default SignupModal;