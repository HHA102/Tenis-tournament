const fs = require('fs');

const fileController = {
    uploadFile: async (req, res) => {
        const file = req.file;
        res.status(200).json({ file });
    },
    deleteFile: async (req, res) => {
        const filePath = req.body.filePath;
        res.status(200).json({ filePath });
    },
    getFileStream: async (req, res) => {
        const filePath = req.query.filePath;
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
}

module.exports = fileController;

