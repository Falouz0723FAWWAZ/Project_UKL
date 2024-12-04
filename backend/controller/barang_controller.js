import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Menambahkan Barang Baru
export const addInventory = async (req, res) => {
  const { nama_barang, category, location, quantity } = req.body;

  try {
    const result = await prisma.barang.create({
      data: {
        nama_barang: nama_barang,
        category: category,
        location: location,
        quantity: Number(quantity),
      },
    });
    res.status(201).json({
      status: "success",
      message: "Barang berhasil ditambahkan",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Memperbarui Barang
export const updateInventory = async (req, res) => {
  const { nama_barang, category, location, quantity } = req.body;

  try {
    const result = await prisma.barang.update({
      where: {
        id_barang: Number(req.params.id),
      },
      data: {
        nama_barang: nama_barang,
        category: category,
        location: location,
        quantity: Number(quantity),
      },
    });
    res.status(200).json({
      status: "success",
      message: "Barang berhasil diubah",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Mengambil Data Barang Berdasarkan ID
export const getInventoryById = async (req, res) => {
  try {
    const result = await prisma.barang.findUnique({
      where: {
        id_barang: Number(req.params.id),
      },
    });
    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Data tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
