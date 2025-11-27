import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";

const AddEditUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const roleOptions = [
    { value: "USER", label: "Usuario", description: "Usuario básico del sistema" },
    { value: "EMPLOYEE", label: "Empleado", description: "Empleado con permisos extendidos" },
    { value: "ADMIN", label: "Administrador", description: "Administrador con todos los permisos" }
  ];

  // Cargar datos del usuario si es edición
  useEffect(() => {
    if (isEdit) {
      userService
        .get(id)
        .then((response) => {
          const user = response.data;
          setUsername(user.username || "");
          setEmail(user.email || "");
          setRole(user.role || "USER");
          // No cargamos la contraseña por seguridad
        })
        .catch((error) => {
          console.log("Error al cargar el usuario.", error);
          alert("Error al cargar el usuario");
        });
    }
  }, [id, isEdit]);

  const validateForm = () => {
    if (!username.trim()) {
      alert("El nombre de usuario es obligatorio");
      return false;
    }

    if (!email.trim()) {
      alert("El email es obligatorio");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("El formato del email no es válido");
      return false;
    }

    if (!isEdit) {
      if (!password) {
        alert("La contraseña es obligatoria");
        return false;
      }

      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return false;
      }

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return false;
      }
    } else if (password && password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const saveUser = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const user = {
      username: username.trim(),
      email: email.trim(),
      role,
      id: isEdit ? id : undefined
    };

    // Solo incluir contraseña si se proporcionó
    if (password) {
      user.password = password;
    }

    if (isEdit) {
      userService
        .update(user)
        .then((response) => {
          console.log("Usuario ha sido actualizado.", response.data);
          navigate("/user/list");
        })
        .catch((error) => {
          console.log("Error al actualizar el usuario.", error);
          alert("Error al actualizar el usuario. Verifique que el email y nombre de usuario no estén en uso.");
          setLoading(false);
        });
    } else {
      userService
        .create(user)
        .then((response) => {
          console.log("Usuario ha sido creado.", response.data);
          navigate("/user/list");
        })
        .catch((error) => {
          console.log("Error al crear el usuario.", error);
          alert("Error al crear el usuario. Verifique que el email y nombre de usuario no estén en uso.");
          setLoading(false);
        });
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const getRoleDescription = (roleValue) => {
    const option = roleOptions.find(opt => opt.value === roleValue);
    return option ? option.description : "";
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
      </Typography>

      <Paper sx={{ padding: 3, maxWidth: 600 }}>
        {isEdit && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Para cambiar la contraseña, complete los campos de contraseña. 
            Déjelos vacíos si no desea cambiarla.
          </Alert>
        )}

        <Box component="form" onSubmit={saveUser}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="username"
                  label="Nombre de Usuario"
                  value={username}
                  variant="outlined"
                  onChange={(e) => setUsername(e.target.value)}
                  helperText="Identificador único del usuario"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="email"
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  helperText="Email válido para notificaciones"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="password"
                  label={isEdit ? "Nueva Contraseña (opcional)" : "Contraseña"}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isEdit}
                  helperText="Mínimo 6 caracteres"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="confirmPassword"
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  variant="outlined"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isEdit || password}
                  helperText="Debe coincidir con la contraseña"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="role-label">Rol del Usuario</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Rol del Usuario"
                  onChange={(e) => setRole(e.target.value)}
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  {getRoleDescription(role)}
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? "Guardando..." : (isEdit ? "Actualizar" : "Crear")}
                </Button>

                <Link to="/user/list" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    sx={{ minWidth: 120 }}
                  >
                    Cancelar
                  </Button>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddEditUser;