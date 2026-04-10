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
import SearchResults from './pages/SearchResults'
import ContactUs from './pages/ContactUs'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crear-post" element={<PrivateRoute><CrearPost /></PrivateRoute>} />
            <Route path="/post/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><UserList /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/contact" element={<PrivateRoute><ContactUs /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
