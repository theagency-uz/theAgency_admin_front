// const apiBaseUrl = "http://192.168.0.127:9000";
// const imageBaseUrl = "http://192.168.0.127:9000/uploads";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.theagency.uz/api";
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://admin.theagency.uz/api/uploads";
export default apiBaseUrl;

export { imageBaseUrl };


