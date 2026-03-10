import api from "./api";


const getAllProductsByCategory = async (idCategory: number) => {
  try {
    const response = await api.get('/v1/customer/product', {
      params: {
        page: 1,
        limit: 20,
        ...(idCategory === 0 ? {} : { productCategoryId: idCategory }),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}


const getSearchProducts = async (keyword: string) => {
  try {
    const response = await api.get('/v1/customer/product', {
      params: {
        search: keyword,
        page: 1,
        limit: 20
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching search products:", error);
    throw error;
  }
}

export { getAllProductsByCategory, getSearchProducts };
