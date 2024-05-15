const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: async function(req, file, img) {
        img(null, path.join(__dirname, '../public/images'));
    },
    filename: async function(req, file, name) {
        name(null, `image${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
});

module.exports = { storage }