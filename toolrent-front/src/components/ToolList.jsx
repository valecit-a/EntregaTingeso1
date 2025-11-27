import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toolService from "../services/tool.service";
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
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const ToolList = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const init = () => {
    setLoading(true);
    setError(null);
    toolService
      .getAll()
      .then((response) => {
        console.log("Mostrando listado de todas las herramientas.", response.data);
        setTools(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(
          "Se ha producido un error al intentar mostrar listado de todas las herramientas.",
          error
        );
        setError("Error al cargar las herramientas");
        setLoading(false);
      });
  };

  useEffect(() => {
    init();
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "¿Esta seguro que desea borrar esta herramienta?"
    );
    if (confirmDelete) {
      toolService
        .remove(id)
        .then((response) => {
          console.log("Herramienta ha sido eliminada.", response.data);
          init();
        })
        .catch((error) => {
          console.log(
            "Se ha producido un error al intentar eliminar la herramienta",
            error
          );
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/tool/edit/${id}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'disponible':
        return 'success';
      case 'prestada':
        return 'warning';
      case 'mantenimiento':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Cargando herramientas...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Inventario de Herramientas
        </Typography>
        <Link to="/tool/add" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Añadir Herramienta
          </Button>
        </Link>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Nombre
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Descripción
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Marca
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Estado
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Operaciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay herramientas registradas
                </TableCell>
              </TableRow>
            ) : (
              tools.map((tool) => (
                <TableRow
                  key={tool.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{tool.name}</TableCell>
                  <TableCell align="left">{tool.description}</TableCell>
                  <TableCell align="left">{tool.brand}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={tool.status}
                      color={getStatusColor(tool.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => handleEdit(tool.id)}
                      sx={{ mr: 1 }}
                      startIcon={<EditIcon />}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(tool.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ToolList;