import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/auth.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BuildIcon from "@mui/icons-material/Build";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError("Por favor, complete todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.login(username, password);
      
      if (response.data.success) {
        // Guardar datos de usuario y token
        authService.saveUserData(response.data.token, response.data.user);
        
        // Llamar callback de éxito si existe
        if (onLoginSuccess) {
          onLoginSuccess(response.data.user);
        }
        
        // Redirigir al dashboard
        navigate("/");
      } else {
        setError(response.data.error || "Error de autenticación");
      }
    } catch (error) {
      console.error("Error de login:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Credenciales inválidas");
      } else {
        setError("Error de conexión. Verifique que el servidor esté funcionando.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 3
        }}
      >
        {/* Header con logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <BuildIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            ToolRent
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Sistema de Gestión de Herramientas
          </Typography>
        </Box>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 2
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Ingresa tus credenciales para acceder
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="username"
              label="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoComplete="username"
              autoFocus
              disabled={loading}
            />

            <TextField
              fullWidth
              id="password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
              startIcon={<LoginIcon />}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                ¿No tienes una cuenta?{" "}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: "none", 
                    color: "primary.main",
                    fontWeight: "bold"
                  }}
                >
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Información adicional */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            Sistema desarrollado para la gestión eficiente de herramientas
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;