import api from "./api";

const getCouponCampaign = async () => {
    try {
        const response = await api.get("/v1/customer/couponCampaign/available"); 
        return response.data;
    } catch (error) {
        console.error("Error fetching coupon:", error);
        throw error;
    }
};

const getCustomerCoupon = async () => {
    try {
        const response = await api.get("/v1/customer/customerCoupon", );
        return response.data;
    } catch (error) {
        console.error("Error fetching coupon:", error);
        throw error;
    }
}

const getCustomerCouponId = async (id: string) => {
    try {
        const response = await api.get(`/v1/customer/customerCoupon/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching coupon:", error);
        throw error;
    }
}

const getCouponCampaignExist = async () => {
    try {
        const response = await api.get(`/v1/customer/couponCampaign/exist`);
        return response.data;
    } catch (error) {
        console.error("Error fetching coupon:", error);
        throw error;
    }
}

const getCouponCampaignById = async (id: string) => {
    try{
        const response = await api.get(`/v1/customer/couponCampaign/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching coupon:", error);
        throw error;
    }
}



export { getCouponCampaign, getCustomerCoupon, getCouponCampaignExist, getCouponCampaignById, getCustomerCouponId };