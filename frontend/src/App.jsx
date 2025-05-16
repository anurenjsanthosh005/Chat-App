import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import { UsersProvider } from "./contexts/UsersContext";

function App() {
  return (
    <AuthProvider>
      <UsersProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UsersProvider>
    </AuthProvider>
  );
}

export default App;
