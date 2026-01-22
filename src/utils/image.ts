export async function getImageSize(
  blob: Blob,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = URL.createObjectURL(blob);
  });
}
