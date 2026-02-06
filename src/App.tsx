import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import RunningDetailPage from "./pages/RunningDetailPage";
import SearchPage from "./pages/SearchPage";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/my-page" element={<MyPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/:id" element={<RunningDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
