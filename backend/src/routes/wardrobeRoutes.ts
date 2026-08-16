import { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware';
import wardrobeController from '../controllers/wardrobeController';

const router = Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log('File mimetype:', file.mimetype);
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// GET /api/wardrobe - Get all items
router.get('/', authMiddleware, (req, res) => wardrobeController.getItems(req, res));

// GET /api/wardrobe/:id - Get single item
router.get('/:id', authMiddleware, (req, res) => wardrobeController.getItemById(req, res));

// POST /api/wardrobe - Create item
router.post('/', authMiddleware, upload.single('image'), (req, res) =>
  wardrobeController.createItem(req, res)
);

// PATCH /api/wardrobe/:id - Update item
router.patch('/:id', authMiddleware, (req, res) => wardrobeController.updateItem(req, res));

// DELETE /api/wardrobe/:id - Delete item
router.delete('/:id', authMiddleware, (req, res) => wardrobeController.deleteItem(req, res));

export default router;
