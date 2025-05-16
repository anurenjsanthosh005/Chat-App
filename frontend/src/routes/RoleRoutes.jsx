import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function RoleRoutes({children, allowedRole}) {

    const{token,role} = useAuth()
    // const token = localStorage.getItem('token')
    
    if (!token || role !== allowedRole) {
        return <Navigate to="/page-not-found" />;
    }

    return children
}

export default RoleRoutes