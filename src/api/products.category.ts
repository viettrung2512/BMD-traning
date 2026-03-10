import api from "./api";

const getAllCategories = async () => {
    const response = await api.get('/v1/customer/productCategory', {
        params: {
            page: 1,
            limit: 20,
        },
    });
    return response.data;
}

export { getAllCategories };
