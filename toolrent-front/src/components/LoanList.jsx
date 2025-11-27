import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loanService from "../services/loan.service";
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
import ReturnIcon from "@mui/icons-material/Assignment";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const init = () => {
    setLoading(true);
    setError(null);
    loanService
      .getAll()
      .then((response) => {
        console.log("Mostrando listado de todos los préstamos.", response.data);
        setLoans(response.data);
      })
      .catch((error) => {
        console.log("Error al cargar préstamos.", error);
        setError("Error al cargar la lista de préstamos");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    init();
  }, []);

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "¿Está seguro que desea borrar este préstamo?"
    );
    if (confirm) {
      loanService
        .remove(id)
        .then(() => {
          console.log("Préstamo eliminado.");
          init();
        })
        .catch((error) => {
          console.log("Error al eliminar el préstamo.", error);
          alert("Error al eliminar el préstamo");
        });
    }
  };

  const handleReturn = (id) => {
    const confirm = window.confirm(
      "¿Confirma la devolución de este préstamo?"
    );
    if (confirm) {
      // Aquí iría la lógica para marcar como devuelto
      // Por ahora, solo navegamos a la edición
      navigate(`/loan/edit/${id}`);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      ACTIVO: { color: "success", label: "Activo" },
      DEVUELTO: { color: "info", label: "Devuelto" },
      VENCIDO: { color: "error", label: "Vencido" },
      PERDIDO: { color: "warning", label: "Perdido" }
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando préstamos...</Typography>
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
          Gestión de Préstamos
        </Typography>
        <Link to="/loan/add" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
          >
            Nuevo Préstamo
          </Button>
        </Link>
      </Box>

      {loans.length === 0 ? (
        <Alert severity="info">No hay préstamos registrados</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="loans table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Herramienta</TableCell>
                <TableCell>Fecha Préstamo</TableCell>
                <TableCell>Fecha Devolución</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Operaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow
                  key={loan.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{loan.id}</TableCell>
                  <TableCell>
                    {loan.client ? 
                      `${loan.client.name} ${loan.client.lastName}` : 
                      'Cliente no disponible'
                    }
                  </TableCell>
                  <TableCell>
                    {loan.tool ? loan.tool.name : 'Herramienta no disponible'}
                  </TableCell>
                  <TableCell>{formatDate(loan.loanDate)}</TableCell>
                  <TableCell>{formatDate(loan.returnDate)}</TableCell>
                  <TableCell>{getStatusChip(loan.status)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => navigate(`/loan/edit/${loan.id}`)}
                        startIcon={<EditIcon />}
                      >
                        Editar
                      </Button>
                      {loan.status === 'ACTIVO' && (
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          onClick={() => handleReturn(loan.id)}
                          startIcon={<ReturnIcon />}
                        >
                          Devolver
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(loan.id)}
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
    </Box>
  );
};

export default LoanList;