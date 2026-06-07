import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import {
  getPortfolioCategoryList,
  getPortfolioProjectList,
  getPublicPortfolioProjects,
  patchPortfolioProject,
  postPortfolioImage,
  postPortfolioProject,
  removePortfolioProject,
} from '@/controllers/portfolio.controller';
import { PORTFOLIO_CATEGORIES } from '@/models/portfolio-project.model';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const categorySchema = z.enum(PORTFOLIO_CATEGORIES);

const createPortfolioSchema = {
  body: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().trim().max(5000).optional(),
    category: categorySchema,
    imageUrl: z.string().trim().url('Image URL must be valid'),
    imagePublicId: z.string().trim().optional(),
    techStack: z.array(z.string().trim().min(1)).optional(),
    clientName: z.string().trim().max(200).optional(),
    isPublished: z.boolean().optional(),
  }),
};

const updatePortfolioSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Project id is required'),
  }),
  body: z
    .object({
      title: z.string().trim().min(1).max(200).optional(),
      description: z.string().trim().max(5000).optional(),
      category: categorySchema.optional(),
      imageUrl: z.string().trim().url().optional(),
      imagePublicId: z.string().trim().optional(),
      techStack: z.array(z.string().trim().min(1)).optional(),
      clientName: z.string().trim().max(200).optional(),
      isPublished: z.boolean().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required',
    }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Project id is required'),
  }),
};

const listQuerySchema = {
  query: z.object({
    category: categorySchema.optional(),
    search: z.string().trim().optional(),
  }),
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.get('/public', getPublicPortfolioProjects);

router.use(authenticateAdmin);

router.get('/categories', getPortfolioCategoryList);
router.get('/', validate(listQuerySchema), getPortfolioProjectList);
router.post('/', validate(createPortfolioSchema), postPortfolioProject);
router.post('/upload-image', upload.single('image'), postPortfolioImage);
router.patch('/:id', validate(updatePortfolioSchema), patchPortfolioProject);
router.delete('/:id', validate(idParamSchema), removePortfolioProject);

export default router;
