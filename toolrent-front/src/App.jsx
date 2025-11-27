import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import AddEditClient from './components/AddEditClient';
import ToolList from './components/ToolList';
import AddEditTool from './components/AddEditTool';
import LoanList from './components/LoanList';
import AddEditLoan from './components/AddEditLoan';
import MovementList from './components/MovementList';
import AddEditMovement from './components/AddEditMovement';
import UserList from './components/UserList';
import AddEditUser from './components/AddEditUser';
import RateList from './components/RateList';
import NotFound from './components/NotFound';

function App() {
  return (
      <Router>
          <div className="container">
            <Routes>
              {/* Rutas públicas (sin autenticación) */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <Home />
                </>
              } />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              
              {/* Rutas protegidas (requieren autenticación) */}
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/client/list" element={<ClientList/>} />
                    <Route path="/client/add" element={<AddEditClient/>} />
                    <Route path="/client/edit/:id" element={<AddEditClient/>} />
                    <Route path="/tool/list" element={<ToolList/>} />
                    <Route path="/tool/add" element={<AddEditTool/>} />
                    <Route path="/tool/edit/:id" element={<AddEditTool/>} />
                    <Route path="/loan/list" element={<LoanList/>} />
                    <Route path="/loan/add" element={<AddEditLoan/>} />
                    <Route path="/loan/edit/:id" element={<AddEditLoan/>} />
                    <Route path="/movement/list" element={<MovementList/>} />
                    <Route path="/movement/add" element={<AddEditMovement/>} />
                    <Route path="/movement/edit/:id" element={<AddEditMovement/>} />
                    <Route path="/user/list" element={<UserList/>} />
                    <Route path="/user/add" element={<AddEditUser/>} />
                    <Route path="/user/edit/:id" element={<AddEditUser/>} />
                    <Route path="/rate/list" element={<RateList/>} />
                    <Route path="*" element={<NotFound/>} />
                  </Routes>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
      </Router>
  );
}

export default App
