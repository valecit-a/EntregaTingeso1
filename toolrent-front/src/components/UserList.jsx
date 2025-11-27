import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../services/user.service";
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
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const init = () => {
    setLoading(true);
    setError(null);
    userService
      .getAll()
      .then((response) => {
        console.log("Mostrando listado de todos los usuarios.", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.log("Error al cargar usuarios.", error);
        setError("Error al cargar la lista de usuarios");
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
      "¿Está seguro que desea borrar este usuario?"
    );
    if (confirm) {
      userService
        .remove(id)
        .then(() => {
          console.log("Usuario eliminado.");
          init();
        })
        .catch((error) => {
          console.log("Error al eliminar el usuario.", error);
          alert("Error al eliminar el usuario");
        });
    }
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      ADMIN: { color: "error", label: "Administrador", icon: <AdminPanelSettingsIcon /> },
      USER: { color: "primary", label: "Usuario", icon: <PersonIcon /> },
      EMPLOYEE: { color: "secondary", label: "Empleado", icon: <PersonIcon /> }
    };

    const config = roleConfig[role] || { color: "default", label: role, icon: <PersonIcon /> };
    return (
      <Chip 
        label={config.label} 
        color={config.color} 
        size="small"
        icon={config.icon}
      />
    );
  };

  const getInitials = (username) => {
    return username ? username.slice(0, 2).toUpperCase() : "??";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando usuarios...</Typography>
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
          Gestión de Usuarios
        </Typography>
        <Link to="/user/add" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
          >
            Nuevo Usuario
          </Button>
        </Link>
      </Box>

      {users.length === 0 ? (
        <Alert severity="info">No hay usuarios registrados</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="center">Operaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {getInitials(user.username)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {user.username}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => navigate(`/user/edit/${user.id}`)}
                        startIcon={<EditIcon />}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(user.id)}
                        startIcon={<DeleteIcon />}
                        disabled={user.role === 'ADMIN'}
                      >
                        {user.role === 'ADMIN' ? 'Protegido' : 'Eliminar'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Total de usuarios: {users.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserList;