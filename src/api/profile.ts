import api from "./api";

const getProfile = async()=>{
    try {
        const response = await api.get("/v1/customer/auth/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}

export const updateProfile = async (data: {
  fullName: string;
  email: string;
  address: string;
  phone: string;
}) => {
  try {
    const response = await api.patch("/v1/customer/auth/profile", {
      customer: {
        fullName: data.fullName,
        email: data.email,
        address: data.address,
        phone: data.phone
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export default getProfile