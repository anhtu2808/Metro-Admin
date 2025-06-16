import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const isAuthorized = useSelector(state => state.user.isAuthorized);
  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
