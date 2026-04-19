import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.jpg";

function ViewNotes() {
    const [subject, setSubject] = useState("");
    const [reg, setReg] = useState("");
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    const search = async () => {
        if (!subject || !reg) {
            toast.error("Please fill all fields");
            return;
        }

        const res = await axios.get(
            `https://notes-backend-3mph.onrender.com/notes?subject_code=${subject}&regulation=${reg}`
        );

        if (res.data.length === 0) {
            toast.error("No notes found");
        }

        setNotes(res.data);
    };

    return (
        <div style={container}>
            <img src={logo} alt="logo" style={logoStyle} onClick={() => navigate("/")} />
            <h2>View Notes</h2>

            <input style={input} placeholder="Subject Code" onChange={e => setSubject(e.target.value)} />
            <select style={input} onChange={e => setReg(e.target.value)}>
                <option value="">Select Regulation</option>
                <option value="2021">2021</option>
                <option value="2026">2026</option>
            </select>

            <button style={btn} onClick={search}>Search</button>

            {notes.map(n => (
                <div key={n.id} style={card}>
                    <h4>Notes {n.note_number}</h4>
                    <a href={`https://notes-backend-3mph.onrender.com/uploads/${n.file_path}`} target="_blank">
                        <button style={btn}>View</button>
                    </a>
                    <a href={`https://notes-backend-3mph.onrender.com/download/${n.file_path}`}>
                        <button style={btn}>Download</button>
                    </a>
                </div>
            ))}

            <button style={backBtn} onClick={() => navigate("/")}>Back to Home</button>
        </div>
    );
}

/* STYLES */

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
    cursor: "pointer"
};

const input = {
    margin: "10px",
    padding: "8px",
    borderRadius: "8px",
    border: "none"
};

const btn = {
    margin: "5px",
    padding: "8px 15px",
    borderRadius: "15px",
    border: "none",
    background: "linear-gradient(to right, #ff00cc, #3333ff)",
    color: "white",
    cursor: "pointer"
};

const card = {
    margin: "10px auto",
    padding: "15px",
    width: "250px",
    background: "#222",
    borderRadius: "10px"
};

const backBtn = {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "15px",
    border: "none",
    background: "#444",
    color: "white"
};

export default ViewNotes;