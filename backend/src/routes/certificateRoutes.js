import express from 'express';
import {
  getUserCertificates,
  getCertificate,
  verifyCertificate,
  completeCourseAndIssueCertificate,
} from '../controllers/certificateController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getUserCertificates);
router.get('/verify', verifyCertificate);
router.get('/:id', verifyToken, getCertificate);
router.post('/issue', verifyToken, completeCourseAndIssueCertificate);

export default router;
