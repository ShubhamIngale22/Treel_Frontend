import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./Pages/Login";
import DashBoard from "./Pages/DashBoard";
import UserMaster from "./Pages/UserMaster";

const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return false;
        }
        return true;
    } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return false;
    }
};

// already logged in → skip login page → go to dashboard
const PublicRoute = ({ children }) => {
    return checkToken() ? <Navigate to="/dashboard" /> : children;
};

// not logged in → skip dashboard → go to login
const PrivateRoute = ({ children }) => {
    return checkToken() ? children : <Navigate to="/" />;
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <DashBoard />
                    </PrivateRoute>
                } />
                <Route path="/users" element={
                    <PrivateRoute>
                        <UserMaster />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}
