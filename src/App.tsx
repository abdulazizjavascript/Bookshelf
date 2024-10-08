import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import useAuth from "./hooks/useAuth";

import Layout from "./components/Layout";
import BooksPage from "./pages/BooksPage";
import SearchBooksPage from "./pages/SearchBooks";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route
          index
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/register" />
          }
        />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected pages */}
        {user ? (
          <Route element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="search-books" element={<SearchBooksPage />} />
          </Route>
        ) : null}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
