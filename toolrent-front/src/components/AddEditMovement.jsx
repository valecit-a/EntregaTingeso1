import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import movementService from "../services/movement.service";
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

const AddEditMovement = () => {
  const [movementType, setMovementType] = useState("ENTRADA");
  const [description, setDescription] = useState("");
  const [movementDate, setMovementDate] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const movementTypeOptions = [
    { value: "ENTRADA", label: "Entrada", description: "Ingreso de herramienta al inventario" },
    { value: "SALIDA", label: "Salida", description: "Préstamo de herramienta" },
    { value: "DEVOLUCION", label: "Devolución", description: "Retorno de herramienta prestada" },
    { value: "MANTENIMIENTO", label: "Mantenimiento", description: "Envío a mantenimiento" },
    { value: "REPARACION", label: "Reparación", description: "Reparación de herramienta" }
  ];

  // Cargar usuarios
  useEffect(() => {
    userService
      .getAll()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log("Error al cargar usuarios.", error);
      });
  }, []);

  // Cargar datos del movimiento si es edición
  useEffect(() => {
    if (isEdit) {
      movementService
        .get(id)
        .then((response) => {
          const movement = response.data;
          setMovementType(movement.movementType || "ENTRADA");
          setDescription(movement.description || "");
          setUserId(movement.user?.id || "");
          setMovementDate(movement.movementDate ? 
            movement.movementDate.split('T')[0] : "");
        })
        .catch((error) => {
          console.log("Error al cargar el movimiento.", error);
          alert("Error al cargar el movimiento");
        });
    } else {
      // Para nuevo movimiento, establecer fecha y hora actual
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      setMovementDate(today);
    }
  }, [id, isEdit]);

  const saveMovement = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!movementType || !description || !userId || !movementDate) {
      alert("Por favor, complete todos los campos obligatorios");
      setLoading(false);
      return;
    }

    const movement = {
      movementType,
      description,
      movementDate: movementDate + "T" + new Date().toISOString().split('T')[1],
      user: { id: userId },
      id: isEdit ? id : undefined
    };

    if (isEdit) {
      movementService
        .update(movement)
        .then((response) => {
          console.log("Movimiento ha sido actualizado.", response.data);
          navigate("/movement/list");
        })
        .catch((error) => {
          console.log("Error al actualizar el movimiento.", error);
          alert("Error al actualizar el movimiento");
          setLoading(false);
        });
    } else {
      movementService
        .create(movement)
        .then((response) => {
          console.log("Movimiento ha sido creado.", response.data);
          navigate("/movement/list");
        })
        .catch((error) => {
          console.log("Error al crear el movimiento.", error);
          alert("Error al crear el movimiento");
          setLoading(false);
        });
    }
  };

  const getMovementTypeHelperText = (type) => {
    const option = movementTypeOptions.find(opt => opt.value === type);
    return option ? option.description : "";
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? "Editar Movimiento" : "Nuevo Movimiento"}
      </Typography>

      <Paper sx={{ padding: 3, maxWidth: 800 }}>
        <Box component="form" onSubmit={saveMovement}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="movementType-label">Tipo de Movimiento</InputLabel>
                <Select
                  labelId="movementType-label"
                  id="movementType"
                  value={movementType}
                  label="Tipo de Movimiento"
                  onChange={(e) => setMovementType(e.target.value)}
                >
                  {movementTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  {getMovementTypeHelperText(movementType)}
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="user-label">Usuario Responsable</InputLabel>
                <Select
                  labelId="user-label"
                  id="user"
                  value={userId}
                  label="Usuario Responsable"
                  onChange={(e) => setUserId(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {`${user.username} - ${user.email}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="movementDate"
                  label="Fecha del Movimiento"
                  type="date"
                  value={movementDate}
                  onChange={(e) => setMovementDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  id="description"
                  label="Descripción del Movimiento"
                  value={description}
                  variant="outlined"
                  multiline
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                  helperText="Describa detalladamente el movimiento realizado"
                  required
                  placeholder="Ej: Préstamo de taladro eléctrico a cliente Juan Pérez para trabajo de carpintería..."
                />
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
                  {loading ? "Guardando..." : (isEdit ? "Actualizar" : "Registrar")}
                </Button>

                <Link to="/movement/list" style={{ textDecoration: "none" }}>
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

export default AddEditMovement;