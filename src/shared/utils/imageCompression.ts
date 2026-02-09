/**
 * Compress and resize image using Canvas
 * @param file - The original file
 * @param maxWidth - Max width/height (default 600px)
 * @param quality - JPEG quality 0-1 (default 0.7)
 * @returns Promise resolving to Base64 string
 */
export async function compressImage(
    file: File,
    maxWidth = 600,
    quality = 0.7
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const elem = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxWidth) {
                        width *= maxWidth / height;
                        height = maxWidth;
                    }
                }

                elem.width = width;
                elem.height = height;
                const ctx = elem.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas context not available"));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);

                // Output as JPEG with quality
                const dataUrl = elem.toDataURL("image/jpeg", quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}
