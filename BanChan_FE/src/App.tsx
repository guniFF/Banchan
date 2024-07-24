import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SocialLoginPage from "./pages/SocialLoginPage";
import LoginPage from "./pages/LoginPage";
import Notice from "./components/Community/Notice";
import Board from "./components/Community/Board";
import Ask from "./components/Community/Ask";
import VoteManagePage from "./pages/VoteManagePage";
import MainLayout from "./components/MainLayout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SocialLoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/community/notice" element={<Notice />} />
        <Route path="/community/board" element={<Board />} />
        <Route path="/community/ask" element={<Ask />} />
        <Route path="/vote" element={<MainLayout><VoteManagePage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
