import multer from 'multer';
import { AppError } from '@/types';

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

const storage = multer.memoryStorage();

export const supportUpload = multer({
  storage,
  limits: { fileSize: MAX_ATTACHMENT_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(
        new AppError(
          400,
          `Unsupported file type. Allowed: PDF, images, plain text, Word, Excel.`,
        ),
      );
      return;
    }
    callback(null, true);
  },
}).single('attachment');

export const handleSupportUpload = (
  req: Parameters<typeof supportUpload>[0],
  res: Parameters<typeof supportUpload>[1],
  next: Parameters<typeof supportUpload>[2],
) => {
  supportUpload(req, res, (err) => {
    if (!err) {
      next();
      return;
    }
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        next(new AppError(400, 'Attachment must be 5 MB or smaller'));
        return;
      }
      next(new AppError(400, err.message));
      return;
    }
    next(err);
  });
};
