/* =================================
   DATA SANTRI PUBLIC
================================= */


/* =================================
   AMBIL DATA
================================= */

const dataSantri = JSON.parse(
    localStorage.getItem("dataSantri")
) || [];


/* =================================
   HITUNG TOTAL
================================= */

const totalSantri = dataSantri.length;


/* =================================
   HITUNG PUTRA
================================= */

const santriPutra = dataSantri.filter(
    santri => santri.jenisKelamin === "Laki-laki"
).length;


/* =================================
   HITUNG PUTRI
================================= */

const santriPutri = dataSantri.filter(
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


/* =================================
   TAMPILKAN ANGKATAN OTOMATIS
================================= */

const angkatanList = document.getElementById("angkatanList");


/* Ambil semua tahun angkatan */

const daftarAngkatan = [
    ...new Set(
        dataSantri.map(
            santri => santri.angkatan
        )
    )
];


/* Urutkan dari tahun terkecil */

daftarAngkatan.sort(
    (a, b) => Number(a) - Number(b)
);


/* Tampilkan */

daftarAngkatan.forEach(tahun => {

    const jumlah = dataSantri.filter(
        santri => santri.angkatan === tahun
    ).length;


    const card = document.createElement("div");

    card.className = "angkatan-card";


    card.innerHTML = `

        <i class='bx bx-calendar'></i>

        <div>
            <span>Angkatan</span>
            <h3>${tahun}</h3>
        </div>

        <strong>
            ${jumlah} Santri
        </strong>

    `;


    angkatanList.appendChild(card);

});