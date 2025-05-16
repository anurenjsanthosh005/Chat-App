import { Navigate } from 'react-router-dom'

function RoleRoutes({children, allowedRole}) {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if(!token){
       return <Navigate to='/page-not-found' />
    }

    if (role !== allowedRole){
        return <Navigate to='/page-not-found' />
    }

    return children
}
    
export default RoleRoutes