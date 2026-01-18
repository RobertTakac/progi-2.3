import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Redirect({ setCurrentUser }) {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);

            setCurrentUser({ loggedIn: true });

            setTimeout(() => {
                navigate("/");
            }, 50);
        } else {
            navigate("/login"); // fallback
        }
    }, [navigate, setCurrentUser]);

    return <div>Signing you in...</div>;
}
