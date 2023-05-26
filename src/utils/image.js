const toDataURL = (url) =>
  fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    )
    .catch((err) => {
      return "";
    });
function dataURLtoFile(dataurl, filename) {
  if (!dataurl) {
    return "";
  }
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  if (mime === "application/octet-stream") {
    mime = "image/webp";
  }
  return new File([u8arr], filename, { type: mime });
}
async function imgToFile(image) {
  let file;
  if (image.includes("/images")) {
    const start = image.lastIndexOf("Z_");
    const dataUrl = await toDataURL(image);
    file = dataURLtoFile(dataUrl, image.slice(start || 0 + 1));
  } else {
    const dataUrl = await toDataURL(image);
    file = dataURLtoFile(dataUrl, image);
  }
  return file;
}
export { toDataURL, dataURLtoFile, imgToFile };
