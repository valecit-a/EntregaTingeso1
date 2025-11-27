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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import BuildIcon from "@mui/icons-material/Build";
import Grid from "@mui/material/Grid";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: "",
    rut: "",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("El nombre de usuario es obligatorio");
      return false;
    }

    if (formData.username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      return false;
    }

    if (!formData.rut.trim()) {
      setError("El RUT es obligatorio");
      return false;
    }

    if (!/^\d{7,8}-[\dkK]$/.test(formData.rut)) {
      setError("El formato del RUT debe ser: 12345678-9");
      return false;
    }

    if (!formData.email.trim()) {
      setError("El email es obligatorio");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("El formato del email no es válido");
      return false;
    }

    if (!formData.password) {
      setError("La contraseña es obligatoria");
      return false;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const userData = {
        username: formData.username.trim(),
        password: formData.password,
        email: formData.email.trim(),
        fullName: formData.fullName.trim() || formData.username.trim(),
        rut: formData.rut.trim(),
        phone: formData.phone.trim()
      };

      const response = await authService.register(userData);
      
      if (response.data.success) {
        setSuccess("Usuario registrado exitosamente. Redirigiendo al login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error de registro:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Error al registrar usuario");
      } else {
        setError("Error de conexión. Verifique que el servidor esté funcionando.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Container component="main" maxWidth="md">
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
            Únete a nuestro sistema de gestión
          </Typography>
        </Box>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 600,
            borderRadius: 2
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Crear Cuenta
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Complete el formulario para registrarse en el sistema
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Nombre de Usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  helperText="Mínimo 3 caracteres"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="fullName"
                  name="fullName"
                  label="Nombre Completo"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  helperText="Opcional"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="rut"
                  name="rut"
                  label="RUT"
                  value={formData.rut}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  helperText="Formato: 12345678-9"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  helperText="Opcional: +56912345678"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Correo Electrónico"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  helperText="Ejemplo: usuario@email.com"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  helperText="Mínimo 6 caracteres"
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  helperText="Debe coincidir con la contraseña"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                          disabled={loading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
              startIcon={<PersonAddIcon />}
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                ¿Ya tienes una cuenta?{" "}
                <Link 
                  to="/login" 
                  style={{ 
                    textDecoration: "none", 
                    color: "primary.main",
                    fontWeight: "bold"
                  }}
                >
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Información adicional */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            Al registrarte, aceptas formar parte del sistema ToolRent
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;