import api from "../api/api";

const logout = async () => {
    const API_URL = 'https://shop.staging.bmdapp.store:3249/v1/customer/auth/logout';
    try {
        const response = await api.post(API_URL, {}, {
            headers: {
                'namespace': 'viettrung'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

export default logout;