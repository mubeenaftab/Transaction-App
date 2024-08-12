import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateTransaction from './pages/createTransaction'
import ReadTransaction from './pages/readTransaction'
import UpdateTransaction from './pages/updateTransaction'
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/login';
import Register from './pages/register';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or any loading component
  }
  
  return user ? <Component {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-transaction" element={<PrivateRoute element={CreateTransaction} />} />
          <Route path="/read-transaction" element={<PrivateRoute element={ReadTransaction} />} />
          <Route path="/update-transaction/:id" element={<PrivateRoute element={UpdateTransaction} />} />
          <Route path="/" element={<Navigate to="/read-transaction" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;