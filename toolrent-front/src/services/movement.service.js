import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/movements');
}

const create = data => {
    return httpClient.post("/api/movements", data);
}

const get = id => {
    return httpClient.get(`/api/movements/${id}`);
}

const getByLoan = loanId => {
    return httpClient.get(`/api/movements/loan/${loanId}`);
}

export default { getAll, create, get, getByLoan };