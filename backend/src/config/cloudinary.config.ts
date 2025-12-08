// Local file storage configuration
// No external API keys required!

export const uploadToLocalStorage = async (file: Express.Multer.File): Promise<string> => {
    // File is already saved by multer diskStorage
    // Return the server URL path to access it
    const filename = file.filename;
    const serverUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return `${serverUrl}/uploads/${filename}`;
};

export const deleteFromLocalStorage = async (filename: string): Promise<void> => {
    // Extract filename from URL path
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../../uploads');
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
