import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import clientService from "../services/client.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const AddEditClient = () => {
  const [rut, setRut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const saveClient = (e) => {
    e.preventDefault();
    setLoading(true);

    const client = {
      rut,
      name,
      email,
      phone,
      address,
      id: isEdit ? id : undefined
    };

    if (isEdit) {
      clientService
        .update(client)
        .then((response) => {
          console.log("Cliente ha sido actualizado.", response.data);
          navigate("/client/list");
        })
        .catch((error) => {
          console.log("Se ha producido un error al actualizar el cliente.", error);
          alert("Error al actualizar el cliente");
          setLoading(false);
        });
    } else {
      clientService
        .create(client)
        .then((response) => {
          console.log("Cliente ha sido añadido.", response.data);
          navigate("/client/list");
        })
        .catch((error) => {
          console.log("Se ha producido un error al crear el cliente.", error);
          alert("Error al crear el cliente");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (isEdit) {
      clientService
        .get(id)
        .then((response) => {
          const client = response.data;
          setRut(client.rut);
          setName(client.name);
          setEmail(client.email);
          setPhone(client.phone);
          setAddress(client.address);
        })
        .catch((error) => {
          console.log("Se ha producido un error al obtener el cliente.", error);
          alert("Error al cargar el cliente");
        });
    }
  }, [id]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? "Editar Cliente" : "Añadir Cliente"}
      </Typography>

      <Paper sx={{ padding: 3, maxWidth: 600 }}>
        <Box component="form" onSubmit={saveClient}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="rut"
              label="RUT"
              value={rut}
              variant="outlined"
              onChange={(e) => setRut(e.target.value)}
              helperText="Ej: 12345678-9"
              required
              disabled={isEdit} // RUT no se puede editar
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="name"
              label="Nombre Completo"
              value={name}
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="email"
              label="Correo Electrónico"
              type="email"
              value={email}
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="phone"
              label="Teléfono"
              value={phone}
              variant="outlined"
              onChange={(e) => setPhone(e.target.value)}
              helperText="Ej: +56 9 1234 5678"
              required
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              id="address"
              label="Dirección"
              value={address}
              variant="outlined"
              multiline
              rows={3}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? "Guardando..." : (isEdit ? "Actualizar" : "Guardar")}
            </Button>

            <Link to="/client/list" style={{ textDecoration: "none" }}>
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
        </Box>
      </Paper>
    </Box>
  );
};

export default AddEditClient;