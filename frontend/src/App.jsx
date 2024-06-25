import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Button, DatePicker } from 'antd';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './components/DashBoard';
import Header from './components/ui/Header';
import Footer from './components/Footer';
import UserDashBoard from './pages/UserDashBoard';
import HomePage from './components/HomePage';
import Home from './pages/Home';
import UserDetails from './components/Trash';
import AddProblem from './components/admin/AddProblem';

function App() {

  return (
    <>
      <Routes>
        <Route path="/user/signup/:referral_id?" element={<Signup />} />
        <Route path="/user/login" element={<Login/>} />
        <Route path="/user/DashBoard" element={<UserDashBoard/>} />
        <Route path="/" element={<Dashboard/>} />
        <Route path="/head" element={<Header/>} />
        <Route path="/f" element={<Footer/>} />
        <Route path="/h" element={<HomePage/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/details" element={<UserDetails/>} />
        <Route path="/admin/addproblem" element={<AddProblem/>} />
    </Routes>
    </>
  )
}

export default App
