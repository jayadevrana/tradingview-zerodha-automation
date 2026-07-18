import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';

// Protected Route Component
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

// Public Route - redirects to dashboard if already logged in
function PublicRoute({ children }) {
    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Landing />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Semi-Public Routes */}
                <Route path="/donations" element={<Donations />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
