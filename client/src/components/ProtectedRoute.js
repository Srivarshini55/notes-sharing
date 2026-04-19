import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const user = localStorage.getItem("name");

    if (!user) {
        alert("Please login to access this page");
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;