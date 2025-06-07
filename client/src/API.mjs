
const SERVER_URL = 'http://localhost:3001/api';
export const API = {};

API.login = async (credentials) => {
    const response = await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    })
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetails = await response.text();
        throw new Error(errDetails);
    }
};