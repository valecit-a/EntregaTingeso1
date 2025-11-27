import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/rates');
}

const create = data => {
    return httpClient.post("/api/rates", data);
}

const get = id => {
    return httpClient.get(`/api/rates/${id}`);
}

const update = data => {
    return httpClient.put('/api/rates', data);
}

const remove = id => {
    return httpClient.delete(`/api/rates/${id}`);
}

export default { getAll, create, get, update, remove };