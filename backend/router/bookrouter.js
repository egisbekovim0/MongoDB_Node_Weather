import express from 'express'
import { getBookInfo } from '../controllers/bookController.js';

const router = express.Router();
router.get("/", getBookInfo)

export default router