import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clientService from "../services/client.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const init = () => {
    setLoading(true);
    setError(null);
    clientService
      .getAll()
      .then((response) => {
        console.log("Mostrando listado de todos los clientes.", response.data);
        setClients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(
          "Se ha producido un error al intentar mostrar listado de todos los clientes.",
          error
        );
        setError("Error al cargar los clientes");
        setLoading(false);
      });
  };

  useEffect(() => {
    init();
  }, []);

  const handleDelete = (id) => {
    console.log("Printing id", id);
    const confirmDelete = window.confirm(
      "¿Esta seguro que desea borrar este cliente?"
    );
    if (confirmDelete) {
      clientService
        .remove(id)
        .then((response) => {
          console.log("Cliente ha sido eliminado.", response.data);
          init();
        })
        .catch((error) => {
          console.log(
            "Se ha producido un error al intentar eliminar al cliente",
            error
          );
        });
    }
  };

  const handleEdit = (id) => {
    console.log("Printing id", id);
    navigate(`/client/edit/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Cargando clientes...</Typography>
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
          Lista de Clientes
        </Typography>
        <Link to="/client/add" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
          >
            Añadir Cliente
          </Button>
        </Link>
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                RUT
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Nombre
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Teléfono
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Dirección
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Operaciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow
                  key={client.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{client.rut}</TableCell>
                  <TableCell align="left">{client.name}</TableCell>
                  <TableCell align="left">{client.email}</TableCell>
                  <TableCell align="left">{client.phone}</TableCell>
                  <TableCell align="left">{client.address}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => handleEdit(client.id)}
                      sx={{ mr: 1 }}
                      startIcon={<EditIcon />}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(client.id)}
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
};export default ClientList;