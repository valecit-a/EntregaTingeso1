import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/tools');
}

const create = data => {
    return httpClient.post("/api/tools", data);
}

const get = id => {
    return httpClient.get(`/api/tools/${id}`);
}

const update = data => {
    return httpClient.put('/api/tools', data);
}

const remove = id => {
    return httpClient.delete(`/api/tools/${id}`);
}

const getAvailable = () => {
    return httpClient.get('/api/tools/available');
}

export default { getAll, create, get, update, remove, getAvailable };