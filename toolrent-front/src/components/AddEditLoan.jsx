import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import loanService from "../services/loan.service";
import clientService from "../services/client.service";
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
import Grid from "@mui/material/Grid";

const AddEditLoan = () => {
  const [clientId, setClientId] = useState("");
  const [toolId, setToolId] = useState("");
  const [loanDate, setLoanDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [status, setStatus] = useState("ACTIVO");
  const [clients, setClients] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "DEVUELTO", label: "Devuelto" },
    { value: "VENCIDO", label: "Vencido" },
    { value: "PERDIDO", label: "Perdido" }
  ];

  // Cargar clientes y herramientas disponibles
  useEffect(() => {
    clientService
      .getAll()
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.log("Error al cargar clientes.", error);
      });

    toolService
      .getAll()
      .then((response) => {
        // Filtrar solo herramientas disponibles para nuevo préstamo
        const availableTools = isEdit ? response.data : 
          response.data.filter(tool => tool.status === "DISPONIBLE");
        setTools(availableTools);
      })
      .catch((error) => {
        console.log("Error al cargar herramientas.", error);
      });
  }, [isEdit]);

  // Cargar datos del préstamo si es edición
  useEffect(() => {
    if (isEdit) {
      loanService
        .get(id)
        .then((response) => {
          const loan = response.data;
          setClientId(loan.client?.id || "");
          setToolId(loan.tool?.id || "");
          setLoanDate(loan.loanDate ? loan.loanDate.split('T')[0] : "");
          setReturnDate(loan.returnDate ? loan.returnDate.split('T')[0] : "");
          setStatus(loan.status || "ACTIVO");
        })
        .catch((error) => {
          console.log("Error al cargar el préstamo.", error);
          alert("Error al cargar el préstamo");
        });
    } else {
      // Para nuevo préstamo, establecer fecha actual
      const today = new Date().toISOString().split('T')[0];
      setLoanDate(today);
    }
  }, [id, isEdit]);

  const saveLoan = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!clientId || !toolId || !loanDate) {
      alert("Por favor, complete todos los campos obligatorios");
      setLoading(false);
      return;
    }

    const loan = {
      client: { id: clientId },
      tool: { id: toolId },
      loanDate: loanDate,
      returnDate: returnDate || null,
      status,
      id: isEdit ? id : undefined
    };

    if (isEdit) {
      loanService
        .update(loan)
        .then((response) => {
          console.log("Préstamo ha sido actualizado.", response.data);
          navigate("/loan/list");
        })
        .catch((error) => {
          console.log("Error al actualizar el préstamo.", error);
          alert("Error al actualizar el préstamo");
          setLoading(false);
        });
    } else {
      loanService
        .create(loan)
        .then((response) => {
          console.log("Préstamo ha sido creado.", response.data);
          navigate("/loan/list");
        })
        .catch((error) => {
          console.log("Error al crear el préstamo.", error);
          alert("Error al crear el préstamo");
          setLoading(false);
        });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? "Editar Préstamo" : "Nuevo Préstamo"}
      </Typography>

      <Paper sx={{ padding: 3, maxWidth: 800 }}>
        <Box component="form" onSubmit={saveLoan}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="client-label">Cliente</InputLabel>
                <Select
                  labelId="client-label"
                  id="client"
                  value={clientId}
                  label="Cliente"
                  onChange={(e) => setClientId(e.target.value)}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {`${client.name} ${client.lastName} - ${client.email}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="tool-label">Herramienta</InputLabel>
                <Select
                  labelId="tool-label"
                  id="tool"
                  value={toolId}
                  label="Herramienta"
                  onChange={(e) => setToolId(e.target.value)}
                >
                  {tools.map((tool) => (
                    <MenuItem key={tool.id} value={tool.id}>
                      {`${tool.name} - ${tool.brand} (${tool.status})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="loanDate"
                  label="Fecha de Préstamo"
                  type="date"
                  value={loanDate}
                  onChange={(e) => setLoanDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="returnDate"
                  label="Fecha de Devolución"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="Opcional - Dejar vacío si aún no se ha devuelto"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="status-label">Estado</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={status}
                  label="Estado"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
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

                <Link to="/loan/list" style={{ textDecoration: "none" }}>
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

export default AddEditLoan;