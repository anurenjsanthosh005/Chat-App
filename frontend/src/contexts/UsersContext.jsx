// ActiveUsersContext.js
import React, { createContext, useState, useContext } from "react";
import mockusers from "../mock-datas/mockUsers";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {

      const [activeUsers, setActiveUsers] = useState(mockusers);

  return (
    <UsersContext.Provider value={{ activeUsers, setActiveUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useActiveUsers = () => useContext(UsersContext);
