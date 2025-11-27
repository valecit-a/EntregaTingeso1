import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import movementService from "../services/movement.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const MovementList = () => {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const init = () => {
    setLoading(true);
    setError(null);
    movementService
      .getAll()
      .then((response) => {
        console.log("Mostrando listado de todos los movimientos.", response.data);
        setMovements(response.data);
        setFilteredMovements(response.data);
      })
      .catch((error) => {
        console.log("Error al cargar movimientos.", error);
        setError("Error al cargar la lista de movimientos");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const filtered = movements.filter(movement => 
      movement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.movementType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovements(filtered);
  }, [searchTerm, movements]);

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "¿Está seguro que desea borrar este movimiento?"
    );
    if (confirm) {
      movementService
        .remove(id)
        .then(() => {
          console.log("Movimiento eliminado.");
          init();
        })
        .catch((error) => {
          console.log("Error al eliminar el movimiento.", error);
          alert("Error al eliminar el movimiento");
        });
    }
  };

  const getMovementTypeChip = (type) => {
    const typeConfig = {
      ENTRADA: { color: "success", label: "Entrada" },
      SALIDA: { color: "error", label: "Salida" },
      DEVOLUCION: { color: "info", label: "Devolución" },
      MANTENIMIENTO: { color: "warning", label: "Mantenimiento" },
      REPARACION: { color: "secondary", label: "Reparación" }
    };

    const config = typeConfig[type] || { color: "default", label: type };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    return new Date(dateTimeString).toLocaleString('es-ES');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando movimientos...</Typography>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Historial de Movimientos
        </Typography>
        <Link to="/movement/add" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Nuevo Movimiento
          </Button>
        </Link>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por descripción, tipo o usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredMovements.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? "No se encontraron movimientos que coincidan con la búsqueda" : "No hay movimientos registrados"}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="movements table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell align="center">Operaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow
                  key={movement.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{movement.id}</TableCell>
                  <TableCell>{getMovementTypeChip(movement.movementType)}</TableCell>
                  <TableCell>{movement.description}</TableCell>
                  <TableCell>
                    {movement.user ? movement.user.username : 'Usuario no disponible'}
                  </TableCell>
                  <TableCell>{formatDateTime(movement.movementDate)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => navigate(`/movement/edit/${movement.id}`)}
                        startIcon={<EditIcon />}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(movement.id)}
                        startIcon={<DeleteIcon />}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {movements.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Mostrando {filteredMovements.length} de {movements.length} movimientos
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MovementList;