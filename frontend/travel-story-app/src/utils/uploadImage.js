import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    // append img file to form data
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post('/image-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', //set the header for file upload
            },
        });
        return response.data; // return the response data
    } 
    catch (error) {
        console.log("Error accured while uploading image:", error);
        return error;
}
};

export default uploadImage;