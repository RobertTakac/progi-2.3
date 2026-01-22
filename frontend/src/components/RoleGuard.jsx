import { Navigate, Outlet } from 'react-router-dom';

const RoleGuard = ({ user, allowedRoles, redirectPath = '/' }) => {
  if (!user) {
    return <Navigate to="/?login=true" replace />;
  }

  if (!allowedRoles.includes(user.type)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default RoleGuard;