import express from 'express'
import { getAllUser, login, isAdminMiddleware, signup, getUsers} from '../controllers/user-controller.js'

const router = express.Router()
router.get("/", isAdminMiddleware, getUsers )
router.post("/signup", signup)
router.post("/login", login)

export default router