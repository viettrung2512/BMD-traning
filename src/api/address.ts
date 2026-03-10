import api from "./api"; 


const getAllCities = async () => {
    const response = await api.get("/v1/customer/city");
    return response.data;
}

const getAllDistricts = async (cityId: number) => {
    const response = await api.get(`/v1/customer/district?parentCode=${cityId}`);
    return response.data;
}

const getAllWards = async (districtId: number) => {
    const response = await api.get(`/v1/customer/ward?parentCode=${districtId}`);
    return response.data;
}

export { getAllCities, getAllDistricts, getAllWards };