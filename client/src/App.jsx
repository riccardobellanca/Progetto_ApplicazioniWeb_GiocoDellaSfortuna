import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProvider from "./contexts/UserContext";
import NotFoundPage from "./pages/NotFoundPage";
import ToastProvider from "./contexts/ToastContext";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import GamePage from './pages/GamePage';
import DemoPage from "./pages/DemoPage"

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/profile/:profileId" element={<ProfilePage />} />
            <Route path="/game" element={<GamePage/>}/>
            <Route path="/demo" element={<DemoPage/>}/>
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="/serverError" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </ToastProvider>
  );
}

export default App;
