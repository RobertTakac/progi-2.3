// OAuth2Redirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function OAuth2Redirect({ setCurrentUser }) {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);

            try {
                const decoded = jwt_decode(token);

                setCurrentUser({ username: decoded.sub });
            } catch (err) {
                console.error("JWT decode error", err);
            }

            navigate("/");
        } else {
            navigate("/login");
        }
    }, [navigate, setCurrentUser]);

    return <div>Signing you in...</div>;
}
