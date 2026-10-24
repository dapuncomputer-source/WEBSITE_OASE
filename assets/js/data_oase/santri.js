
/* =================================
   DATA SANTRI PUBLIC
================================= */

// Ambil data dari Local Storage
const dataSantri = JSON.parse(
    localStorage.getItem("dataSantri")
) || [];

// Elemen statistik
const totalSantriEl = document.getElementById("totalSantri");
const santriPutraEl = document.getElementById("santriPutra");
const santriPutriEl = document.getElementById("santriPutri");
const angkatanList = document.getElementById("angkatanList");

// Hitung statistik
const totalSantri = dataSantri.length;

const santriPutra = dataSantri.filter(
    santri => santri.jenisKelamin === "Laki-laki"
).length;

const santriPutri = dataSantri.filter(
    santri => santri.jenisKelamin === "Perempuan"
).length;

// Tampilkan hanya jika elemennya tersedia
if (totalSantriEl) {
    totalSantriEl.textContent = totalSantri;
}

if (santriPutraEl) {
    santriPutraEl.textContent = santriPutra;
}

if (santriPutriEl) {
    santriPutriEl.textContent = santriPutri;
}

// Tampilkan data angkatan jika elemennya tersedia
if (angkatanList) {
    angkatanList.replaceChildren();

    const daftarAngkatan = [
        ...new Set(
            dataSantri.map(santri => santri.angkatan)
        )
    ];

    daftarAngkatan.sort(
        (a, b) => Number(a) - Number(b)
    );

    daftarAngkatan.forEach(tahun => {
        const jumlah = dataSantri.filter(
            santri => santri.angkatan === tahun
        ).length;

        const card = document.createElement("div");
        card.className = "angkatan-card";

        const icon = document.createElement("i");
        icon.className = "bx bx-calendar";

        const info = document.createElement("div");

        const label = document.createElement("span");
        label.textContent = "Angkatan";

        const heading = document.createElement("h3");
        heading.textContent = tahun;

        const jumlahEl = document.createElement("strong");
        jumlahEl.textContent = `${jumlah} Santri`;

        info.append(label, heading);
        card.append(icon, info, jumlahEl);
        angkatanList.appendChild(card);
    });
}
