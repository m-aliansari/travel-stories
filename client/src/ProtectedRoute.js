import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

export default function ProtectedRoute(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            const decoded = jwt_decode(token);
            if (decoded.exp < Date.now() / 1000) {
                localStorage.removeItem("token");
                toast.error("session expired!")
                navigate("/login");
            }
        }
        setLoading(false)
    }, [navigate]);
    return loading ? <></> : props.children;
}
