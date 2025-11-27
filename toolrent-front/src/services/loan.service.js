import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/loans');
}

const create = data => {
    return httpClient.post("/api/loans", data);
}

const get = id => {
    return httpClient.get(`/api/loans/${id}`);
}

const update = data => {
    return httpClient.put('/api/loans', data);
}

const remove = id => {
    return httpClient.delete(`/api/loans/${id}`);
}

const getByClient = clientId => {
    return httpClient.get(`/api/loans/client/${clientId}`);
}

export default { getAll, create, get, update, remove, getByClient };