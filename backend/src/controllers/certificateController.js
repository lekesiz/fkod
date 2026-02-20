import { Certificate } from '../models/Certificate.js';
import { UserProgress } from '../models/UserProgress.js';

export const getUserCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.getUserCertificates(req.user.id);
    res.json(certificates);
  } catch (err) {
    console.error('Get user certificates error:', err);
    res.status(500).json({ error: 'Failed to get certificates' });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.getCertificate(id);

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (err) {
    console.error('Get certificate error:', err);
    res.status(500).json({ error: 'Failed to get certificate' });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Certificate code required' });
    }

    const certificate = await Certificate.verifyCertificate(code);

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json({
      valid: true,
      certificate,
    });
  } catch (err) {
    console.error('Verify certificate error:', err);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
};

export const completeCourseAndIssueCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID required' });
    }

    // Check if user has completed the course
    const progress = await UserProgress.getProgress(req.user.id, courseId);

    if (!progress || !progress.is_completed) {
      return res.status(400).json({ error: 'Course not completed' });
    }

    // Check if certificate already exists
    const hasCert = await Certificate.hasCertificate(req.user.id, courseId);
    if (hasCert) {
      return res.status(400).json({ error: 'Certificate already issued' });
    }

    // Issue certificate
    const certificate = await Certificate.issueCertificate(req.user.id, courseId);

    res.status(201).json(certificate);
  } catch (err) {
    console.error('Issue certificate error:', err);
    res.status(500).json({ error: 'Failed to issue certificate' });
  }
};
