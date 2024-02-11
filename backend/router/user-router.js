import express from 'express'
import { getAllUser, deleteUser,editUser, login, isAdminMiddleware, signup, getUsers} from '../controllers/user-controller.js'

const router = express.Router()
router.get("/", isAdminMiddleware, getUsers )
router.put('/admin/edit/:id', editUser);
router.post("/signup", signup)
router.post("/login", login)
router.delete('/admin/delete/:id', isAdminMiddleware, deleteUser);

export default router