import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/users');
}

const create = data => {
    return httpClient.post("/api/users", data);
}

const get = id => {
    return httpClient.get(`/api/users/${id}`);
}

const update = data => {
    return httpClient.put('/api/users', data);
}

const remove = id => {
    return httpClient.delete(`/api/users/${id}`);
}

export default { getAll, create, get, update, remove };