import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toolService from "../services/tool.service";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import BuildIcon from "@mui/icons-material/Build";
import ConstructionIcon from "@mui/icons-material/Construction";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import WarningIcon from "@mui/icons-material/Warning";

const Home = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPublicTools();
  }, []);

  const loadPublicTools = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await toolService.getAll();
      // Solo mostrar herramientas disponibles al público
      const availableTools = response.data.filter(tool => 
        tool.status === 'DISPONIBLE' || tool.status === 'PRESTADA'
      );
      setTools(availableTools.slice(0, 12)); // Limitamos a 12 herramientas para la vista pública
    } catch (error) {
      console.error("Error al cargar herramientas:", error);
      setError("Error al cargar el catálogo de herramientas");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'DISPONIBLE':
        return {
          label: 'Disponible',
          color: 'success',
          icon: <CheckCircleIcon fontSize="small" />
        };
      case 'PRESTADA':
        return {
          label: 'No disponible',
          color: 'warning',
          icon: <PendingIcon fontSize="small" />
        };
      default:
        return {
          label: 'No disponible',
          color: 'error',
          icon: <WarningIcon fontSize="small" />
        };
    }
  };

  const ToolCard = ({ tool }) => {
    const statusInfo = getStatusInfo(tool.status);
    
    return (
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
      }}>
        <CardMedia
          sx={{ 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'grey.100',
            position: 'relative'
          }}
        >
          <ConstructionIcon sx={{ fontSize: 80, color: 'grey.500' }} />
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
            icon={statusInfo.icon}
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8,
              fontWeight: 'bold'
            }}
          />
        </CardMedia>
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h3" fontWeight="bold">
            {tool.name}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
            {tool.description || 'Herramienta de alta calidad para tus proyectos'}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textPrimary">
              <strong>Marca:</strong> {tool.brand || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              <strong>Modelo:</strong> {tool.model || 'N/A'}
            </Typography>
          </Box>
          
          {tool.acquisitionDate && (
            <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
              Adquirida: {new Date(tool.acquisitionDate).toLocaleDateString()}
            </Typography>
          )}
        </CardContent>

        <CardActions>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión para Solicitar
          </Button>
        </CardActions>
      </Card>
    );
  };

  const HeroSection = () => (
    <Paper 
      sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        p: 6,
        mb: 4,
        textAlign: 'center',
        borderRadius: 3
      }}
    >
      <Avatar sx={{ 
        width: 80, 
        height: 80, 
        bgcolor: 'rgba(255, 255, 255, 0.2)',
        mx: 'auto',
        mb: 2
      }}>
        <BuildIcon sx={{ fontSize: 40 }} />
      </Avatar>
      
      <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
        ToolRent
      </Typography>
      
      <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
        Sistema de Préstamos de Herramientas
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        Explora nuestro catálogo de herramientas de alta calidad. 
        Registrate o inicia sesión para solicitar préstamos y gestionar tu inventario.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button 
          variant="contained"
          size="large"
          startIcon={<LoginIcon />}
          onClick={() => navigate('/login')}
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main',
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          Iniciar Sesión
        </Button>
        
        <Button 
          variant="outlined"
          size="large"
          startIcon={<PersonAddIcon />}
          onClick={() => navigate('/register')}
          sx={{ 
            borderColor: 'white', 
            color: 'white',
            '&:hover': { 
              borderColor: 'white', 
              bgcolor: 'rgba(255, 255, 255, 0.1)' 
            }
          }}
        >
          Registrarse
        </Button>
      </Box>
    </Paper>
  );

  const FeaturesSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="bold">
        ¿Por qué elegir ToolRent?
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'success.light',
              mx: 'auto',
              mb: 2
            }}>
              <CheckCircleIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Herramientas de Calidad
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Todas nuestras herramientas son inspeccionadas y mantenidas 
              regularmente para garantizar su óptimo funcionamiento.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'info.light',
              mx: 'auto',
              mb: 2
            }}>
              <BuildIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Amplio Inventario
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Contamos con una gran variedad de herramientas para 
              diferentes tipos de proyectos y necesidades.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'warning.light',
              mx: 'auto',
              mb: 2
            }}>
              <PendingIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Proceso Fácil
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sistema simple y eficiente para solicitar préstamos 
              y gestionar devoluciones de herramientas.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      <Divider sx={{ my: 4 }} />
      
      {/* Catálogo de herramientas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Catálogo de Herramientas
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Explora algunas de las herramientas disponibles en nuestro inventario. 
          Inicia sesión para solicitar préstamos y ver la disponibilidad completa.
        </Typography>
        
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress size={60} />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {tools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id || index}>
              <ToolCard tool={tool} />
            </Grid>
          ))}
        </Grid>
        
        {tools.length === 0 && !loading && !error && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              No hay herramientas disponibles en este momento
            </Typography>
          </Box>
        )}
        
        {tools.length > 0 && (
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Mostrando {tools.length} herramientas. Inicia sesión para ver el catálogo completo.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
            >
              Ver Catálogo Completo
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home;