import express from 'express'
import {getOpenCage} from '../controllers/OpenCageController.js'

const router = express.Router()
router.get("/", getOpenCage)

export default router