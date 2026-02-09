import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateSession from "./pages/CreateSession";
import Home from "./pages/Home";
import HostEvaluationPage from "./pages/HostEvaluationPage";
import Login from "./pages/Login";
import ManagePage from "./pages/ManagePage";
import MyPage from "./pages/MyPage";
import RunningDetailPage from "./pages/RunningDetailPage";
import SearchListPage from "./pages/SearchListPage";
import SearchPage from "./pages/SearchPage";
import SessionManagePage from "./pages/SessionManagePage";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/create-session"
          element={
            <ProtectedRoute>
              <CreateSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-page"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/list" element={<SearchListPage />} />
        <Route path="/search/:id" element={<RunningDetailPage />} />
        <Route path="/manage/:sessionId" element={<ManagePage />} />
        <Route
          path="/manage/:sessionId/attendance"
          element={<SessionManagePage />}
        />
        <Route
          path="/manage/:sessionId/hostevaluation"
          element={<HostEvaluationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
