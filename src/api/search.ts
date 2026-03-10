import api from "./api";


const searchProducts = async (query: string) => {
    try {
    const response = await api.get(`/v1/customer/product`,
        {
            params: {
                search: query,
                page: 1,
                limit: 4
            }
        }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export default searchProducts