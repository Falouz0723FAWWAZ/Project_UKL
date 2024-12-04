import express from 'express'
import {
   getAllPeminjaman,
   getPeminjamanById,
   addPeminjaman,
   pengembalianBarang,
   getUsageReport,
} from '../controller/peminjaman_controller.js'


const app = express()


app.get('/borrow', getAllPeminjaman)
app.get('/borrow/:id', getPeminjamanById)
app.post('/borrow', addPeminjaman)
app.post('/return', pengembalianBarang)
app.post('/usage-report', getUsageReport)

export default app