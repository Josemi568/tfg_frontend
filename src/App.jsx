import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UserList from './pages/UserList'
import PrivateRoute from './components/PrivateRoute'
import CrearPost from './pages/CrearPost'
import PostDetail from './pages/PostDetail'
import UserProfile from './pages/UserProfile'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crear-post" element={<PrivateRoute><CrearPost /></PrivateRoute>} />
        <Route path="/post/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UserList /></PrivateRoute>} />
        <Route path="/profile/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />

      </Routes>
      <Footer />
    </Router>
  )
}

export default App
