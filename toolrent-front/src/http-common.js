import axios from "axios";

const toolrentBackendServer = import.meta.env.VITE_TOOLRENT_BACKEND_SERVER || 'localhost';
const toolrentBackendPort = import.meta.env.VITE_TOOLRENT_BACKEND_PORT || '8090';

console.log(toolrentBackendServer)
console.log(toolrentBackendPort)

export default axios.create({
    baseURL: `http://${toolrentBackendServer}:${toolrentBackendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});