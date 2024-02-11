import express from 'express'
import {getApiHistory} from '../controllers/historyController.js'

const router = express.Router()
router.get("/", getApiHistory)


export default router