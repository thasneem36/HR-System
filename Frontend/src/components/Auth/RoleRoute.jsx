import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../store/authSlice';

const RoleRoute = ({ roles }) => {
  const userRole = useSelector(selectUserRole);

  if (!roles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
