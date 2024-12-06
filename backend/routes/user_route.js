import express from 'express'
import {
    getAllUser,
    getUserById,
    addUser,
    updateUser,
    deleteUser

} from '../controller/user_controller.js'
import { authenticate, authorize } from '../controller/auth_controller.js'

const app = express()

app.get('/users', getAllUser)
app.get('/users:id',getUserById)
app.post('/user', addUser)
app.put('/:id', authorize, updateUser)
app.delete('/:id', deleteUser)


app.post('/login', authenticate)

export default app  