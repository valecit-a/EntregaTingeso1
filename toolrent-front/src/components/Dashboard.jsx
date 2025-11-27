import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import clientService from "../services/client.service";
import toolService from "../services/tool.service";
import loanService from "../services/loan.service";
import movementService from "../services/movement.service";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TimelineIcon from "@mui/icons-material/Timeline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTools: 0,
    totalLoans: 0,
    totalMovements: 0,
    activeLoans: 0,
    availableTools: 0,
    toolsInMaintenance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [clientsRes, toolsRes, loansRes, movementsRes] = await Promise.all([
        clientService.getAll(),
        toolService.getAll(),
        loanService.getAll(),
        movementService.getAll()
      ]);

      const tools = toolsRes.data;
      const loans = loansRes.data;

      setStats({
        totalClients: clientsRes.data.length,
        totalTools: tools.length,
        totalLoans: loans.length,
        totalMovements: movementsRes.data.length,
        activeLoans: loans.filter(loan => loan.status === 'ACTIVO').length,
        availableTools: tools.filter(tool => tool.status === 'DISPONIBLE').length,
        toolsInMaintenance: tools.filter(tool => tool.status === 'MANTENIMIENTO').length
      });
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
      setError("Error al cargar las estadísticas del sistema");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = "primary", subtitle, onClick }) => (
    <Card sx={{ 
      height: '100%', 
      transition: 'all 0.3s', 
      '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
      cursor: onClick ? 'pointer' : 'default'
    }}>
      <CardContent onClick={onClick}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" color={color} fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: '50%', 
            backgroundColor: `${color}.light`,
            color: `${color}.dark`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const ActionCard = ({ title, description, icon, color, actions }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            backgroundColor: `${color}.light`,
            color: `${color}.dark`,
            mr: 2
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        {actions.map((action, index) => (
          <Button
            key={index}
            size="small"
            variant={action.variant || "outlined"}
            color={action.color || color}
            startIcon={action.icon}
            onClick={action.onClick}
            sx={{ mr: 1 }}
          >
            {action.label}
          </Button>
        ))}
      </CardActions>
    </Card>
  );

  const getActionsForRole = () => {
    if (!currentUser) return [];

    const isAdmin = currentUser.role === 'ADMIN';
    const isEmployee = currentUser.role === 'EMPLOYEE' || isAdmin;

    const actions = [];

    if (currentUser.role === 'USER') {
      // CLIENTE: Ver herramientas y préstamos
      actions.push({
        title: "Ver Catálogo de Herramientas",
        description: "Explora las herramientas disponibles para préstamo",
        icon: <BuildIcon />,
        color: "primary",
        actions: [
          {
            label: "Ver Herramientas",
            icon: <VisibilityIcon />,
            onClick: () => navigate("/dashboard/tool/list"),
            variant: "contained"
          }
        ]
      });
    }

    if (isEmployee) {
      // EMPLEADO: Herramientas prestadas y realizar préstamos
      actions.push(
        {
          title: "Gestión de Préstamos",
          description: "Administrar préstamos activos y crear nuevos",
          icon: <AssignmentIcon />,
          color: "success",
          actions: [
            {
              label: "Ver Préstamos",
              icon: <VisibilityIcon />,
              onClick: () => navigate("/dashboard/loan/list")
            },
            {
              label: "Nuevo Préstamo",
              icon: <AddIcon />,
              onClick: () => navigate("/dashboard/loan/add"),
              variant: "contained"
            }
          ]
        },
        {
          title: "Inventario de Herramientas",
          description: "Gestionar el inventario y estado de herramientas",
          icon: <BuildIcon />,
          color: "secondary",
          actions: [
            {
              label: "Ver Inventario",
              icon: <VisibilityIcon />,
              onClick: () => navigate("/dashboard/tool/list")
            },
            {
              label: "Registrar Herramienta",
              icon: <AddIcon />,
              onClick: () => navigate("/dashboard/tool/add"),
              variant: "contained"
            }
          ]
        }
      );
    }

    if (isAdmin) {
      // ADMIN: Gestión completa
      actions.push(
        {
          title: "Gestión de Clientes",
          description: "Administrar registro de clientes del sistema",
          icon: <PeopleIcon />,
          color: "info",
          actions: [
            {
              label: "Ver Clientes",
              icon: <VisibilityIcon />,
              onClick: () => navigate("/dashboard/client/list")
            },
            {
              label: "Nuevo Cliente",
              icon: <AddIcon />,
              onClick: () => navigate("/dashboard/client/add"),
              variant: "contained"
            }
          ]
        },
        {
          title: "Gestión de Usuarios",
          description: "Administrar usuarios y permisos del sistema",
          icon: <PeopleIcon />,
          color: "warning",
          actions: [
            {
              label: "Ver Usuarios",
              icon: <VisibilityIcon />,
              onClick: () => navigate("/dashboard/user/list")
            },
            {
              label: "Nuevo Usuario",
              icon: <AddIcon />,
              onClick: () => navigate("/dashboard/user/add"),
              variant: "contained"
            }
          ]
        }
      );
    }

    return actions;
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Cargando dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Dashboard ToolRent
        </Typography>
        <Typography variant="h6" color="textSecondary">
          ¡Bienvenido, {currentUser?.fullName || currentUser?.username}! - {currentUser?.role}
        </Typography>
      </Box>

      {/* Estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clientes"
            value={stats.totalClients}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="primary"
            subtitle="Clientes registrados"
            onClick={authService.isEmployee() ? () => navigate("/dashboard/client/list") : undefined}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Herramientas"
            value={stats.totalTools}
            icon={<BuildIcon sx={{ fontSize: 40 }} />}
            color="secondary"
            subtitle="En el inventario"
            onClick={() => navigate("/dashboard/tool/list")}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Préstamos Activos"
            value={stats.activeLoans}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="success"
            subtitle="Herramientas prestadas"
            onClick={authService.isEmployee() ? () => navigate("/dashboard/loan/list") : undefined}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Herramientas Disponibles"
            value={stats.availableTools}
            icon={<BuildIcon sx={{ fontSize: 40 }} />}
            color="info"
            subtitle="Listas para préstamo"
          />
        </Grid>
      </Grid>

      {/* Acciones rápidas según rol */}
      <Typography variant="h4" gutterBottom>
        Acciones Disponibles
      </Typography>
      
      <Grid container spacing={3}>
        {getActionsForRole().map((action, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <ActionCard {...action} />
          </Grid>
        ))}
      </Grid>

      {/* Estado del sistema */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Estado del Sistema
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          <Chip 
            label={`${((stats.availableTools / stats.totalTools) * 100).toFixed(1)}% Herramientas Disponibles`} 
            color="success" 
            variant="outlined"
          />
          <Chip 
            label={`${stats.activeLoans} Préstamos Activos`} 
            color="info" 
            variant="outlined"
          />
          <Chip 
            label={`${((stats.toolsInMaintenance / stats.totalTools) * 100).toFixed(1)}% En Mantenimiento`} 
            color="warning" 
            variant="outlined"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;