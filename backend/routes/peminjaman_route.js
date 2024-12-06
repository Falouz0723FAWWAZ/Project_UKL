import express from 'express'
import {
   getAllPeminjaman,
   getPeminjamanById,
   addPeminjaman,
   pengembalianBarang,
} from '../controller/peminjaman_controller.js'
import { authorize } from '../controller/auth_controller.js'
import { IsAdmin } from '../middleware/role_validation.js'
import { getUsageAnalysis,analyzeItems } from '../controller/peminjaman_controller.js'


const app = express()


app.get('/borrow', getAllPeminjaman)
app.get('/borrow/:id', getPeminjamanById)
app.post('/borrow', addPeminjaman)
app.post('/return', pengembalianBarang)
app.post('/usage-report',authorize,IsAdmin, getUsageAnalysis)
app.post('/borrow-analysis', authorize,IsAdmin,analyzeItems)

export default app