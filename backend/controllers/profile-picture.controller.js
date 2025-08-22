import User from "../models/user.model.js";
import { uploadBufferToCloudinary } from "../middleware/image-uploader.midleware.js";
import cloudinary from "../config/cloudinary.config.js";
export async function uploadProfilePic(req, res) {
    try {
        if (!req.file) throw new Error('No file uploaded');


        const result = await uploadBufferToCloudinary(req.file,Buffer, {
            folder: 'profilepic'
            public_id: `user_${req.user.id}`,
            transformation: [
                {width: 1000, height: 1000, crop: 'fill', gravity: 'auto' },
                { quality: 'auto', fetch_format: 'auto' },
            ],
        });

        //Save image details to MongoDB
        const user = await user.findBYIDAndUpdate(
            req.user.id,
        )
    }
}