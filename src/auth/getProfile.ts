
const getProfile = async (token: string)=>{
    const API_URL = 'https://shop.staging.bmdapp.store:3249/v1/customer/auth/profile';

    if (!token) {
        throw new Error("No token found");
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'namespace': 'viettrung',
                'token': token,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Profile data:', data);
        return data.data;
    } catch (error) {
        console.error('Get profile failed:', error);
        throw error;
    }
}

export default getProfile;
