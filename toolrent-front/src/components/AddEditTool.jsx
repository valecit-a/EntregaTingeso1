import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toolService from "../services/tool.service";
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

const AddEditTool = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("DISPONIBLE");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const statusOptions = [
    { value: "DISPONIBLE", label: "Disponible" },
    { value: "PRESTADA", label: "Prestada" },
    { value: "MANTENIMIENTO", label: "En Mantenimiento" },
    { value: "DAÑADA", label: "Dañada" }
  ];

  const saveTool = (e) => {
    e.preventDefault();
    setLoading(true);

    const tool = {
      name,
      description,
      brand,
      status,
      id: isEdit ? id : undefined
    };

    if (isEdit) {
      toolService
        .update(tool)
        .then((response) => {
          console.log("Herramienta ha sido actualizada.", response.data);
          navigate("/tool/list");
        })
        .catch((error) => {
          console.log("Error al actualizar la herramienta.", error);
          alert("Error al actualizar la herramienta");
          setLoading(false);
        });
    } else {
      toolService
        .create(tool)
        .then((response) => {
          console.log("Herramienta ha sido añadida.", response.data);
          navigate("/tool/list");
        })
        .catch((error) => {
          console.log("Error al crear la herramienta.", error);
          alert("Error al crear la herramienta");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (isEdit) {
      toolService
        .get(id)
        .then((response) => {
          const tool = response.data;
          setName(tool.name);
          setDescription(tool.description);
          setBrand(tool.brand);
          setStatus(tool.status);
        })
        .catch((error) => {
          console.log("Error al cargar la herramienta.", error);
          alert("Error al cargar la herramienta");
        });
    }
  }, [id]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? "Editar Herramienta" : "Añadir Herramienta"}
      </Typography>

      <Paper sx={{ padding: 3, maxWidth: 600 }}>
        <Box component="form" onSubmit={saveTool}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="name"
              label="Nombre de la Herramienta"
              value={name}
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              helperText="Ej: Taladro Eléctrico, Martillo, etc."
              required
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="description"
              label="Descripción"
              value={description}
              variant="outlined"
              multiline
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              helperText="Descripción detallada de la herramienta"
              required
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="brand"
              label="Marca"
              value={brand}
              variant="outlined"
              onChange={(e) => setBrand(e.target.value)}
              helperText="Ej: Bosch, DeWalt, Makita"
              required
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="status-label">Estado</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={status}
              label="Estado"
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
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

            <Link to="/tool/list" style={{ textDecoration: "none" }}>
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

export default AddEditTool;