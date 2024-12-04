import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllPeminjaman = async (req, res) => {
  try {
    const result = await prisma.peminjaman.findMany();
    const formattedData = result.map((record) => {
      const formattedBorrowDate = new Date(record.borrow_date)
        .toISOString()
        .split("T")[0];
      const formattedReturnDate = new Date(record.return_date)
        .toISOString()
        .split("T")[0];
      return {
        ...record,
        borrow_date: formattedBorrowDate,
        return_date: formattedReturnDate,
      };
    });

    res.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      msg: error,
    });
  }
};
export const getPeminjamanById = async (req, res) => {
  try {
    const result = await prisma.presensi.findMany({
      where: {
        id_user: Number(req.params.id),
      },
    });
    const formattedData = result.map((record) => {
      const formattedBorrowDate = new Date(record.borrow_date)
        .toISOString()
        .split("T")[0];
      const formattedReturnDate = new Date(record.return_date)
        .toISOString()
        .split("T")[0];
      return {
        ...record,
        borrow_date: formattedBorrowDate,
        return_date: formattedReturnDate,
      };
    });
    if (formattedData) {
      res.json({
        success: true,
        data: formattedData,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "data not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
    });
  }
};
export const addPeminjaman = async (req, res) => {
  const { id_user, item_id, borrow_date, return_date, qty } = req.body;

  const formattedBorrowDate = new Date(borrow_date).toISOString();
  const formattedReturnDate = new Date(return_date).toISOString();

  const [getUserId, getBarangId] = await Promise.all([
    prisma.user.findUnique({ where: { id_user: Number(id_user) } }),
    prisma.barang.findUnique({ where: { id_barang: Number(item_id) } }),
  ]);

  if (getUserId && getBarangId) {
    try {
      const result = await prisma.peminjaman.create({
        data: {
          user: {
            connect: {
              id_user: Number(id_user),
            },
          },
          barang: {
            connect: {
              id_barang: Number(item_id),
            },
          },
          qty: qty,
          borrow_date: formattedBorrowDate,
          return_date: formattedReturnDate,
        },
      });
      if (result) {
        const item = await prisma.barang.findUnique({
          where: { id_barang: Number(item_id) },
        });

        if (!item) {
          throw new Error(
            `barang dengan id_barang ${id_barang} tidak ditemukan`
          );
        } else {
          const minQty = item.quantity - qty;
          const result = await prisma.barang.update({
            where: {
              id_barang: Number(item_id),
            },
            data: {
              quantity: minQty,
            },
          });
        }
      }
      res.status(201).json({
        success: true,
        message: "Peminjaman Berhasil Dicatat",
        data: {
          id_user: result.id_user,
          id_barang: result.id_barang,
          qty: result.qty,
          borrow_date: result.borrow_date.toISOString().split("T")[0], // Format tanggal (YYYY-MM-DD)
          return_date: result.return_date.toISOString().split("T")[0], // Format tanggal (YYYY-MM-DD)
          status: result.status,
        },
      });
    } catch (error) {
      console.log(error);
      res.json({
        msg: error,
      });
    }
  } else {
    res.json({ msg: "user dan barangh belum ada" });
  }
};
export const pengembalianBarang = async (req, res) => {
  const { borrow_id, return_date } = req.body;

  const formattedReturnDate = new Date(return_date).toISOString();

  const cekBorrow = await prisma.peminjaman.findUnique({
    where: { id_peminjaman: Number(borrow_id) },
  });

  if (cekBorrow.status == "dipinjam") {
    try {
      const result = await prisma.peminjaman.update({
        where: {
          id_peminjaman: borrow_id,
        },
        data: {
          return_date: formattedReturnDate,
          status: "kembali",
        },
      });
      if (result) {
        const item = await prisma.barang.findUnique({
          where: { id_barang: Number(cekBorrow.id_barang) },
        });

        if (!item) {
          throw new Error(
            `barang dengan id_barang ${id_barang} tidak ditemukan`
          );
        } else {
          const restoreQty = cekBorrow.qty + item.quantity;
          const result = await prisma.barang.update({
            where: {
              id_barang: Number(cekBorrow.id_barang),
            },
            data: {
              quantity: restoreQty,
            },
          });
        }
      }
      res.status(201).json({
        success: true,
        message: "Pengembalian Berhasil Dicatat",
        data: {
          id_peminjaman: result.id_peminjaman,
          id_user: result.id_user,
          id_barang: result.id_barang,
          qty: result.qty,
          return_date: result.return_date.toISOString().split("T")[0], // Format tanggal (YYYY-MM-DD)
          status: result.status,
        },
      });
    } catch (error) {
      console.log(error);
      res.json({
        msg: error,
      });
    }
  } else {
    res.json({ msg: "user dan barang belum ada" });
  }
};
export const getUsageReport = async (req, res) => {
  const { start_date, end_date, group_by } = req.body;

  if (!start_date || !end_date || !group_by) {
    return res.status(400).json({
      status: "error",
      message: "start_date, end_date, dan group_by wajib diisi.",
    });
  }

  if (!["category", "location"].includes(group_by)) {
    return res.status(400).json({
      status: "error",
      message: "group_by hanya dapat berupa 'category' atau 'location'.",
    });
  }

  try {
    // Query database untuk analisis penggunaan barang
    const usageAnalysis = await prisma.barang.groupBy({
      by: [group_by],
      where: {
        created_at: {
          gte: new Date(start_date),
          lte: new Date(end_date),
        },
      },
      _sum: {
        quantity: true, // Total quantity barang
      },
    });

    // Simulasi analisis tambahan untuk borrowed, returned, dan in-use
    const usageData = usageAnalysis.map((item) => ({
      group: item[group_by],
      total_borrowed: item._sum.quantity, // Simulasi jumlah barang dipinjam
      total_returned: Math.floor(item._sum.quantity * 0.7), // Contoh: 70% barang dikembalikan
      items_in_use: item._sum.quantity - Math.floor(item._sum.quantity * 0.7), // Sisa barang yang masih dipakai
    }));

    res.status(200).json({
      status: "success",
      data: {
        analysis_period: {
          start_date: start_date,
          end_date: end_date,
        },
        usage_analysis: usageData,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};