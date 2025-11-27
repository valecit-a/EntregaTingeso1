import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import HandymanIcon from "@mui/icons-material/Handyman";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import authService from "../services/auth.service";

export default function Sidemenu({ open, toggleDrawer }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

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
      case "USER": return "Cliente";
      default: return role;
    }
  };

  const getMenuItemsForRole = () => {
    if (!currentUser) return [];

    const isAdmin = currentUser.role === 'ADMIN';
    const isEmployee = currentUser.role === 'EMPLOYEE' || isAdmin;
    const isUser = currentUser.role === 'USER';

    const menuItems = [];

    // Dashboard siempre disponible
    menuItems.push({
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      available: true
    });

    // Home público
    menuItems.push({
      text: "Ir al Home Público",
      icon: <HomeIcon />,
      path: "/",
      available: true
    });

    menuItems.push({ divider: true });

    if (isUser) {
      // USUARIO/CLIENTE: Solo ver herramientas
      menuItems.push({
        text: "Ver Herramientas",
        icon: <HandymanIcon />,
        path: "/dashboard/tool/list",
        available: true
      });
    }

    if (isEmployee) {
      // EMPLEADO y ADMIN: Gestión de préstamos y herramientas
      menuItems.push({
        text: "Gestión de Préstamos",
        icon: <AssignmentIcon />,
        path: "/dashboard/loan/list",
        available: true
      });

      menuItems.push({
        text: "Inventario de Herramientas",
        icon: <HandymanIcon />,
        path: "/dashboard/tool/list",
        available: true
      });

      menuItems.push({
        text: "Movimientos",
        icon: <SwapHorizIcon />,
        path: "/dashboard/movement/list",
        available: true
      });

      menuItems.push({ divider: true });
    }

    if (isAdmin) {
      // ADMIN: Gestión completa
      menuItems.push({
        text: "Gestión de Clientes",
        icon: <PeopleIcon />,
        path: "/dashboard/client/list",
        available: true
      });

      menuItems.push({
        text: "Gestión de Usuarios",
        icon: <AdminPanelSettingsIcon />,
        path: "/dashboard/user/list",
        available: true
      });

      menuItems.push({
        text: "Tarifas del Sistema",
        icon: <AttachMoneyIcon />,
        path: "/dashboard/rate/list",
        available: true
      });
    }

    return menuItems.filter(item => item.available || item.divider);
  };

  const listOptions = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      {/* Header del usuario */}
      {currentUser && (
        <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ mr: 1 }} />
            <Typography variant="body1" fontWeight="bold">
              {currentUser.fullName || currentUser.username}
            </Typography>
          </Box>
          <Chip 
            label={getRoleLabel(currentUser.role)}
            color={getRoleColor(currentUser.role)}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
      )}

      {/* Menú de navegación */}
      <List>
        {getMenuItemsForRole().map((item, index) => {
          if (item.divider) {
            return <Divider key={index} />;
          }
          
          return (
            <ListItemButton 
              key={index} 
              onClick={() => navigate(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      {/* Información del rol */}
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: 'grey.50' }}>
        <Typography variant="caption" color="textSecondary">
          Sistema ToolRent
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          Versión 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
        {listOptions()}
      </Drawer>
    </div>
  );
}