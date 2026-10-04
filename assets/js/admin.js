/* =================================
   DATA SANTRI
================================= */

const dataSantri =
    JSON.parse(localStorage.getItem("dataSantri")) || [];


/* =================================
   STATISTIK
================================= */

const totalSantri =
    dataSantri.length;

const santriPutra =
    dataSantri.filter(
        santri => santri.jenisKelamin === "Laki-laki"
    ).length;

const santriPutri =
    dataSantri.filter(
        santri => santri.jenisKelamin === "Perempuan"
    ).length;


/* =================================
   TAMPILKAN STATISTIK
================================= */

document.getElementById("totalSantri").textContent =
    totalSantri;

document.getElementById("santriPutra").textContent =
    santriPutra;

document.getElementById("santriPutri").textContent =
    santriPutri;