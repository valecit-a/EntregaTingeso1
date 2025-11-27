import * as React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeIcon from "@mui/icons-material/Home";
import Chip from "@mui/material/Chip";
import Sidemenu from "./Sidemenu";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    const loggedIn = authService.isLoggedIn();
    setCurrentUser(user);
    setIsLoggedIn(loggedIn);
  }, []);

  const toggleDrawer = (open) => (event) => {
    setOpen(open);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN": return "error";
      case "EMPLOYEE": return "warning";
      case "USER": return "primary";
      default: return "default";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN": return "Administrador";
      case "EMPLOYEE": return "Empleado";
      case "USER": return "Usuario";
      default: return role;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Botón de menú solo para usuarios logueados */}
          {isLoggedIn && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo clickeable al home */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
          >
            🔧 ToolRent: Sistema de Gestión de Herramientas
          </Typography>
          
          {/* Botones para usuarios logueados */}
          {isLoggedIn && currentUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                <Typography variant="body2">
                  {currentUser.fullName || currentUser.username}
                </Typography>
                <Chip 
                  label={getRoleLabel(currentUser.role)}
                  color={getRoleColor(currentUser.role)}
                  size="small"
                />
              </Box>
              
              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Salir
              </Button>
            </Box>
          )}
          
          {/* Botones para visitantes no logueados */}
          {!isLoggedIn && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                color="inherit"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
              >
                Inicio
              </Button>
              
              <Button 
                color="inherit"
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </Button>
              
              <Button 
                variant="outlined"
                color="inherit"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate("/register")}
                sx={{ 
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Registrarse
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidemenu solo para usuarios logueados */}
      {isLoggedIn && (
        <Sidemenu open={open} toggleDrawer={toggleDrawer}></Sidemenu>
      )}
    </Box>
  );
}