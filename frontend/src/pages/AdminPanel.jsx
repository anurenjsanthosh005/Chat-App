import React from 'react'
import NavBar from '../components/main/NavBar'
import UserList from '../components/users/UserList'

const AdminPanel = () => {
  return (
    <div>
      <NavBar/>
      <UserList/>
    </div>
  )
}

export default AdminPanel