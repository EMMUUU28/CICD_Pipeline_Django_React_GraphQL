import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Will add other pages later
import Dashboard from './pages/Dashboard'; // Placeholder
import AddProductCategory from './pages/AddProductCategory';
// Placeholder components for future pages
const ProductsPage = () => <div className="p-6">Products Page Content</div>;
const CategoriesPage = () => <div className="p-6">Categories Page Content</div>;
const OrdersPage = () => <div className="p-6">Orders Page Content</div>;
const CustomersPage = () => <div className="p-6">Customers Page Content</div>;

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Root path redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/add-items" element={<AddProductCategory />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;