import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import logoSdt from "../public/img/logo_sdt.jpg";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import PieChart from "@/components/PieChart";
import BarChart from "@/components/BarChart";

export default function Home() {
  const [option, setOption] = useState({
    category: 0,
    id: 0,
    idKecamatan: 0,
    idKelurahan: 0,
  });
  const [data, setData] = useState({
    hasil: [],
    opsi: [],
    opsiKecamatan: [],
    opsiKelurahan: [],
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{}],
  });

  function calculateChartData() {
    setChartData({
      labels: [
        "(01) Ir. H. JOKO WIDODO - Prof. Dr. (H.C) KH. MA'RUF AMIN",
        "(02) H. PRABOWO SUBIANTO - H. SANDIAGA SALAHUDIN UNO",
        "Golput",
      ],
      datasets: [
        {
          label: "Perolehan suara",
          data: [
            data.hasil.map((val) => val.suara_paslon1),
            data.hasil.map((val) => val.suara_paslon2),
            data.hasil.map((val) => {
              return val.suara_paslon2 + val.suara_paslon1 - val.suara_sah;
            }),
          ],
        },
      ],
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post("/api/data/", { option });
      setData((prevData) => {
        return {
          ...prevData,
          hasil: response.data.result,
          opsi: response.data.optionData || prevData.opsi,
          opsiKecamatan:
            response.data.optionDataKecamatan || prevData.opsiKecamatan,
          opsiKelurahan:
            response.data.optionDataKelurahan || prevData.opsiKelurahan,
        };
      });
    };
    fetchData();
  }, [option]);

  useEffect(() => {
    calculateChartData();
  }, [data]);

  function handleChangeKota(e) {
    setOption({
      category: parseInt(e.target.value) === 0 ? 0 : 1,
      id: parseInt(e.target.value),
      idKecamatan: 0,
      idKelurahan: 0,
    });
  }
  function handleChangeKecamatan(e) {
    setOption({
      category: parseInt(e.target.value) === 0 ? 1 : 2,
      id: parseInt(option.id),
      idKecamatan: parseInt(e.target.value),
      idKelurahan: 0,
    });
  }
  function handleChangeKelurahan(e) {
    setOption({
      category: parseInt(e.target.value) === 0 ? 2 : 3,
      id: parseInt(option.id),
      idKecamatan: parseInt(option.idKecamatan),
      idKelurahan: parseInt(e.target.value),
    });
  }

  function handleResetFilter() {
    setOption({ category: 0, id: 0, idKecamatan: 0, idKelurahan: 0 });
    setData({ hasil: [], opsi: [], opsiKecamatan: [], opsiKelurahan: [] });
  }

  return (
    <>
      <section style={{ marginBottom: "80px" }} id="#navbar">
        <nav className="navbar bg-primary navbar-dark fixed-top text-dark shadow-lg">
          <div className="container col-10">
            <a className="navbar-brand" href="#">
              <Image
                alt="logo"
                src={logoSdt}
                width={36}
                height={36}
                className="rounded-5 me-2"
              />
              SDT PENS
            </a>
            <button
              className="btn btn-outline-secondary text-light"
              onClick={handleResetFilter}
            >
              Reset Filter
            </button>
          </div>
        </nav>
      </section>

      <section
        id="#body"
        className="card col-10 mx-auto rounded-2 border-dark bg-light shadow-lg"
      >
        <div className="card-header text-center bg-primary mb-3 py-2 text-white">
          <h3>HASIL HITUNG SUARA PEMILU PRESIDEN & WAKIL PRESIDEN RI 2019</h3>
        </div>
        <div className="container card-body">
          <div className="row col-12 mb-4 text-center justify-content-center align-items-center bg-light d-flex">
            <h4> Wilayah Pemilihan Prov. Kalimantan Tengah</h4>
            {option.category === 1 &&
              data.hasil &&
              data.hasil.length > 0 &&
              data.hasil.map((kota, index) => (
                <h4 key={index}>Kota {kota.nama_kabupaten_kota}</h4>
              ))}
            {option.category === 2 &&
              data.hasil &&
              data.hasil.length > 0 &&
              data.hasil.map((kecamatan, index) => (
                <h4 key={index}>Kecamatan {kecamatan.nama_kecamatan}</h4>
              ))}
            {option.category === 3 &&
              data.hasil &&
              data.hasil.length > 0 &&
              data.hasil.map((kelurahan, index) => (
                <h4 key={index}>Kelurahan {kelurahan.nama_kelurahan}</h4>
              ))}
          </div>
          <div className="row mx-auto col-6 mb-5 text-center justify-content-center align-items-center bg-light d-flex">
            <PieChart chartData={chartData} />
          </div>
          <div className="row col-11 mb-4 mx-auto justify-content-center align-items-center bg-primary rounded-2 d-flex">
            <div className="col-12">
              <div className="p-3">
                <select
                  defaultValue={0}
                  onChange={handleChangeKota}
                  className="form-select text-black"
                >
                  <option value={0}>Pilih Kota</option>
                  {data.opsi.map((kota, index) => (
                    <option key={index} value={kota.id}>
                      {kota.nama_kabupaten_kota}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12">
              <div className="p-3">
                <select
                  value={option.idKecamatan}
                  onChange={handleChangeKecamatan}
                  disabled={
                    data.opsiKecamatan.length === 0 || option.category < 1
                  }
                  className="form-select text-black"
                >
                  <option value={0}>Pilih Kecamatan</option>
                  {data.opsiKecamatan.map((kecamatan, index) => (
                    <option key={index} value={kecamatan.id}>
                      {kecamatan.nama_kecamatan}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12">
              <div className="p-3">
                <select
                  value={option.idKelurahan}
                  onChange={handleChangeKelurahan}
                  disabled={
                    data.opsiKelurahan.length === 0 ||
                    data.opsiKecamatan.length === 0 ||
                    option.category < 2
                  }
                  className="form-select text-black"
                >
                  <option value={0}>Pilih Kelurahan</option>
                  {data.opsiKelurahan.map((kelurahan, index) => (
                    <option key={index} value={kelurahan.id}>
                      {kelurahan.nama_kelurahan}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row col-12 mx-auto mb-4 justify-content-center align-items-center rounded-4 d-flex">
            <table className="table table-striped border-dark">
              <thead>
                <tr>
                  <th scope="col">Wilayah</th>
                  <th scope="col">
                    (01) Ir. H. JOKO WIDODO - Prof. Dr. (H.C) KH. MA&#39;RUF
                    AMIN
                  </th>
                  <th scope="col">
                    (02) H. PRABOWO SUBIANTO - H. SANDIAGA SALAHUDIN UNO
                  </th>
                  <th scope="col">Suara Sah</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {option.category == 0 &&
                  data.opsi.map((kota, index) => (
                    <tr key={index}>
                      <th scope="row">{kota.nama_kabupaten_kota}</th>
                      <td>{kota.suara_paslon1}</td>
                      <td>{kota.suara_paslon2}</td>
                      <td>{kota.suara_sah}</td>
                    </tr>
                  ))}
                {option.category == 1 &&
                  data.opsiKecamatan.map((kecamatan, index) => (
                    <tr key={index}>
                      <th scope="row">{kecamatan.nama_kecamatan}</th>
                      <td>{kecamatan.suara_paslon1}</td>
                      <td>{kecamatan.suara_paslon2}</td>
                      <td>{kecamatan.suara_sah}</td>
                    </tr>
                  ))}
                {option.category == 2 &&
                  data.opsiKelurahan.map((kelurahan, index) => (
                    <tr key={index}>
                      <th scope="row">{kelurahan.nama_kelurahan}</th>
                      <td>{kelurahan.suara_paslon1}</td>
                      <td>{kelurahan.suara_paslon2}</td>
                      <td>{kelurahan.suara_sah}</td>
                    </tr>
                  ))}
                {option.category == 3 &&
                  data.hasil.map((kelurahan, index) => (
                    <tr key={index}>
                      <th scope="row">{kelurahan.nama_kelurahan}</th>
                      <td>{kelurahan.suara_paslon1}</td>
                      <td>{kelurahan.suara_paslon2}</td>
                      <td>{kelurahan.suara_sah}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="row mx-auto col-10 mb-5 text-center justify-content-center align-items-center bg-light d-flex">
            <BarChart
              chartData={{
                labels: ["Perolehan Suara"],
                datasets: [
                  {
                    label: chartData.labels[0],
                    backgroundColor: "rgba(255, 99, 132, 0.6)", // Red color
                    data: data.hasil.map((val) => val.suara_paslon1),
                  },
                  {
                    label: chartData.labels[1],
                    backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue color
                    data: data.hasil.map((val) => val.suara_paslon2),
                  },
                  {
                    label: chartData.labels[2],
                    backgroundColor: "rgba(54, 80, 800, 0.6)", // Violet color
                    data: data.hasil.map((val) => {
                      return (
                        val.suara_paslon2 + val.suara_paslon1 - val.suara_sah
                      );
                    }),
                  },
                ],
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
