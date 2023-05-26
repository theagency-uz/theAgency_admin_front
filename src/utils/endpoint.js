// const apiBaseUrl = "http://192.168.0.122:9000/api";
// const imageBaseUrl = "http://192.168.0.116:9000";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.parfumgallery.uz/api";
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://spaces.parfumgallery.uz";
export default apiBaseUrl;

export { imageBaseUrl };


