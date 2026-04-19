import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.jpg";

function Upload() {
    const [file, setFile] = useState(null);
    const [subject, setSubject] = useState("");
    const [reg, setReg] = useState("");
    const navigate = useNavigate();

    const upload = async () => {
        if (!file || !subject || !reg) {
            toast.error("All fields are required");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject_code", subject);
        formData.append("regulation", reg);

        const res = await axios.post("http://localhost:5000/upload", formData);
        toast.success(res.data.message);
    };

    return (
        <div style={container}>
            <img src={logo} alt="logo" style={logoStyle} onClick={() => navigate("/")} />
            <h2>Upload Notes</h2>

            <div style={formBox}>
                <input style={input} placeholder="Subject Code" onChange={e => setSubject(e.target.value)} />
                <select style={input} onChange={e => setReg(e.target.value)}>
                    <option value="">Select Regulation</option>
                    <option value="2021">2021</option>
                    <option value="2026">2026</option>
                </select>
                <input style={input} type="file" onChange={e => setFile(e.target.files[0])} />
                <button style={btn} onClick={upload}>Upload</button>
            </div>

            <button style={backBtn} onClick={() => navigate("/")}>⬅ Back to Home</button>
        </div>
    );
}

/* STYLES (MATCH VIEW PAGE) */

const container = {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(to right, #000000, #1a1a1a)",
    color: "white",
    textAlign: "center",
    paddingTop: "40px"
};

const logoStyle = {
    width: "80px",
    cursor: "pointer",
    marginBottom: "10px"
};

const formBox = {
    margin: "20px auto",
    padding: "20px",
    width: "260px",   // 👈 same feel as view page cards
    background: "#222",
    borderRadius: "10px"
};

const input = {
    width: "100%",
    margin: "8px 0",
    padding: "8px",
    borderRadius: "8px",
    border: "none"
};

const btn = {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
    borderRadius: "15px",
    border: "none",
    background: "linear-gradient(to right, #ff00cc, #ff6600)",
    color: "white",
    cursor: "pointer"
};

const backBtn = {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "15px",
    border: "none",
    background: "#444",
    color: "white",
    cursor: "pointer"
};

export default Upload;