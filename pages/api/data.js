import db from "@/db/db";

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({
            msg: "Unsupported request method"
        })
    }
    try {
        const { option } = req.body
        let result;
        let optionData;
        let optionDataKecamatan;
        let optionDataKelurahan;

        if (option.category == 0) {
            result = [{ suara_paslon1: 884349, suara_paslon2: 573215, suara_sah: 1457564 }]
            optionData = await db.kabupaten_kota.findMany({
                select: { nama_kabupaten_kota: true, id: true, suara_paslon1: true, suara_paslon2: true, suara_sah: true }
            })
        } else if (option.category == 1) {
            result = await db.kabupaten_kota.findMany({ where: { id: option.id } })
            // optionData = await db.kabupaten_kota.findMany({ select: { nama_kabupaten_kota: true, id: true } })
            optionDataKecamatan = await db.kecamatan.findMany({
                where: { id_kabupaten_kota: option.id },
                select: { nama_kecamatan: true, id: true, suara_paslon1: true, suara_paslon2: true, suara_sah: true }
            })
        } else if (option.category == 2) {
            result = await db.kecamatan.findMany({ where: { id: option.idKecamatan } })
            // optionData = await db.kabupaten_kota.findMany({ select: { nama_kabupaten_kota: true, id: true } })
            // optionDataKecamatan = await db.kecamatan.findMany({ where: { id_kabupaten_kota: option.id }, select: { nama_kecamatan: true, id: true } })
            optionDataKelurahan = await db.kelurahan.findMany({
                where: { id_kecamatan: option.idKecamatan },
                select: { nama_kelurahan: true, id: true, suara_paslon1: true, suara_paslon2: true, suara_sah: true }
            })
        } else if (option.category == 3) {
            result = await db.kelurahan.findMany({ where: { id: option.idKelurahan } })
            // optionData = await db.kabupaten_kota.findMany({ select: { nama_kabupaten_kota: true, id: true } })
            // optionDataKecamatan = await db.kecamatan.findMany({ where: { id_kabupaten_kota: option.id }, select: { nama_kecamatan: true, id: true } })
        }
        res.status(200).json({
            msg: "Success",
            result,
            optionData,
            optionDataKecamatan,
            optionDataKelurahan
        })
    } catch (error) {
        res.status(500).json({
            msg: error,
        })
        console.log(error)
    }
};

export default handler;