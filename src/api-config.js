import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8000/"
});

axiosClient.interceptors.request.use((requestConfig) => {
    const access_token = JSON.parse(localStorage.getItem("userDetails"))?.access_token;
    if (access_token) {
        requestConfig.headers["Authorization"] = "Bearer " + access_token;
    }
    return requestConfig;
}, (error) => {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use((res) => {
    return res;
}, async (err) => {
    // console.log('refresh')
    const originalConfig = err.config;
    const statusCode = err.response.status;
    const data = JSON.parse(localStorage.getItem("userDetails"));
    if (statusCode === 403 && originalConfig.url === "auth/token") {
        return Promise.reject(err);
    }
    if (statusCode === 403) {
        const tokenResponse = await axiosClient.post("auth/token", data);
        const access_token = tokenResponse.data.access_token;
        localStorage.setItem("userDetails", JSON.stringify({ ...data, access_token }));
        return axiosClient(originalConfig);
    }
})

export default axiosClient;