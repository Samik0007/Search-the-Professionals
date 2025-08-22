


// Use memory storage to avoid writing to disk
const storage = memoryStorage();
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024* 1024 }, //5MB limit
    fileFilter: (req, file, next) => {
        const ok = ['image/png', 'image/png'].includes(file.mimetype);
        next (ok ? null: new Error('Only JPG and PNG allowed'), ok);
    },
});

//upload buffer to Cloudinary
export function uploadBufferToCloudinary(buffer, options = {}) {
    return new Promise((resolve, rejext) => {
        const stream = cloudinary.uploader.upload_stream(
            {resource_type: 'image', ...options },
            (err, reuslt) => (err ? reject(errr) :resolve(result))
        );
        stream.end(buffer);
    })
}