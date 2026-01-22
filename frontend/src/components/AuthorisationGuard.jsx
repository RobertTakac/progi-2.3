import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from "../utils/constants";
import { useEffect } from "react";

const AuthorisationGuard = ({ handleSignOut, openLoginModal }) => {
    const isAuthenticated = isTokenValid().isValid;

    useEffect(() => {
        if (!isAuthenticated) {
            handleSignOut();
            openLoginModal('login');
        }
    }, [isAuthenticated, handleSignOut, openLoginModal]);

    if (isAuthenticated) {
        return <Outlet />;
    } else {
        return <Navigate to="/" replace/>;
    }
}

export default AuthorisationGuard;