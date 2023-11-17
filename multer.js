const multer = require('multer');
const path = require('path');

const useMulter = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  return multer({ storage });
};

module.exports = {
  useMulter,
};
