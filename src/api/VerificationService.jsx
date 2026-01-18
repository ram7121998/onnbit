import { axiosInstance } from "./axiosInstance"

export const idVerification = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.post("/address/id-verification", data);
        return response?.data;
    }
    catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}
export const AddressVerification = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.post("/address/address-verification", data);
        return response?.data;
    }
    catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}
export const GetIdVerificationDetail = async () => {
    try {
        const response = await axiosInstance.get("/address/get-id-verification-details");
        return response?.data;
    }
    catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}
export const GetAddressVerificationDetail = async () => {
    try {
        const response = await axiosInstance.get("/address/get-address-verification");
        return response?.data;
    }
    catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const PreferredCurrencyUpdate = async (data) => {
    try {
            const payload = { preferred_currency: data }; // correct key

        const response = await axiosInstance.post("/preferred-currency", payload);
        return response?.data;
    }
    catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}
export const UpdateBio = async (data) => {
    try {
            const payload = { bio : data }; 

        const response = await axiosInstance.post("/update-bio", payload);
        return response?.data;
    }
    catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const UpdatePreferredTimezone = async (data) => {
    try {
            const payload = { preferred_timezone : data }; 
        const response = await axiosInstance.post("/preferred-timezone", payload);
        return response?.data;
    }
    catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}