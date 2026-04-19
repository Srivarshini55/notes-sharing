import { useState } from "react";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg.jpg";
import logo from "../assets/logo.jpg";
import { toast } from "react-toastify";

function Home() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [user, setUser] = useState(localStorage.getItem("name"));
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        setUser(null);
        toast.success("Logged out successfully");
    };

    const goUpload = () => {
        if (!user) {
            toast.error("Please login to upload notes");
            return;
        }
        navigate("/upload");
    };

    const goView = () => {
        if (!user) {
            toast.error("Please login to view notes");
            return;
        }
        navigate("/view");
    };

    return (
        <div style={{ ...container, backgroundImage: `url(${bg})` }}>
            <div style={topBar}>
                {!user ? (
                    <>
                        <button style={btn} onClick={() => setShowLogin(true)}>Login</button>
                        <button style={btn} onClick={() => setShowSignup(true)}>Signup</button>
                    </>
                ) : (
                    <>
                        <span style={{ marginRight: "10px" }}>Welcome, {user}</span>
                        <button style={btn} onClick={logout}>Logout</button>
                    </>
                )}
            </div>

            <div style={logoContainer}>
                <img src={logo} alt="logo" style={logoStyle} onClick={() => navigate("/")} />
            </div>

            <div style={center}>
                <h1 style={title}>From Students For Students</h1>

                <p style={desc}>
                    Share your notes, explore high-quality study materials, and help fellow students succeed in their academic journey.
                    Upload subject-wise notes, search using subject codes and regulations, and learn collaboratively.
                </p>

                <div>
                    <button style={bigBtn} onClick={goView}>View Notes</button>
                    <button style={bigBtn} onClick={goUpload}>Upload Notes</button>
                </div>
            </div>

            {showLogin && <LoginModal setShow={setShowLogin} setUser={setUser} />}
            {showSignup && <SignupModal setShow={setShowSignup} />}
        </div>
    );
}

/* styles unchanged */

const container = {
    minHeight: "100vh",
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "white"
};

const topBar = { display: "flex", justifyContent: "flex-end", padding: "15px" };
const logoContainer = { display: "flex", justifyContent: "center", marginTop: "10px" };
const logoStyle = { width: "100px", cursor: "pointer" };
const center = { textAlign: "center", marginTop: "30px" };
const title = {
    fontSize: "45px",
    background: "linear-gradient(to right, #00c6ff, #ff00cc)",
    WebkitBackgroundClip: "text",
    color: "transparent"
};
const desc = { width: "60%", margin: "20px auto", color: "#ddd" };

const btn = {
    margin: "5px",
    padding: "8px 15px",
    borderRadius: "20px",
    border: "none",
    background: "linear-gradient(to right, #ff00cc, #3333ff)",
    color: "white",
    cursor: "pointer"
};

const bigBtn = {
    margin: "10px",
    padding: "12px 25px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(to right, #ff00cc, #ff6600)",
    color: "white",
    cursor: "pointer"
};

export default Home;