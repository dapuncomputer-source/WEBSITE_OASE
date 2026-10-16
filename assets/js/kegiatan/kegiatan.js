// Data detail delapan tahap kegiatan hafalan santri
const detailKegiatan = [
    {
        judul: "Perencanaan Hafalan",
        deskripsi: "Para santri membuat rencana hafalan mereka untuk satu pekan ke depan di dalam kertas perencanaan."
    },
    {
        judul: "Ta'aruf",
        deskripsi: "Setelah membuat perencanaan sepekan, santri membaca atau mengenali halaman yang akan dihafalkan pada malam hari sebelum menghafalkannya keesokan harinya."
    },
    {
        judul: "Kitabah",
        deskripsi: "Para santri diwajibkan menulis hafalan yang akan dihafalkan untuk esok hari dalam satu buku."
    },
    {
        judul: "Ziyadah",
        deskripsi: "Santri mulai menghafal dengan durasi waktu satu jam, kemudian menyetorkannya kepada pembimbing atau asatidz."
    },
    {
        judul: "MHB (Murajaah Hafalan Baru)",
        deskripsi: "Sesudah ziyadah disetorkan, santri menyetorkan kembali hafalan ziyadah kepada teman guna memperkuat hafalan baru."
    },
    {
        judul: "MHL (Murajaah Hafalan Lama)",
        deskripsi: "Di siang hari, para santri mengulang hafalan yang dimiliki dan menyetorkannya atau mengulang dengan metode 3M (maju, mundur, mutqin)."
    },
    {
        judul: "AHP (Apresiasi Hafalan Pekanan)",
        deskripsi: "Di hari Sabtu, para santri wajib mengujikan hafalan yang sudah dihafalkan dan diulang selama satu pekan kemarin."
    },
    {
        judul: "AHB (Apresiasi Hafalan Bulanan)",
        deskripsi: "Di akhir bulannya, para santri harus menyetorkan dari awal sampai akhir hafalan yang mereka miliki dengan tartil."
    }
];

// Mengambil elemen modal
const modalKegiatan = document.getElementById("modalKegiatan");
const modalJudul = document.getElementById("modalKegiatanJudul");
const modalDeskripsi = document.getElementById("modalKegiatanDeskripsi");
const tombolTutup = document.getElementById("tutupModalKegiatan");

// Membuka detail ketika tombol Selengkapnya diklik
document.querySelectorAll(".kegiatan_detail").forEach((tombol) => {
    tombol.addEventListener("click", () => {
        const nomorTahap = Number(tombol.dataset.tahap);
        const kegiatan = detailKegiatan[nomorTahap];

        if (!kegiatan || !modalKegiatan) return;

        modalJudul.textContent = kegiatan.judul;
        modalDeskripsi.textContent = kegiatan.deskripsi;

        modalKegiatan.hidden = false;
        document.body.style.overflow = "hidden";
        tombolTutup.focus();
    });
});

// Menutup modal
function tutupDetailKegiatan() {
    modalKegiatan.hidden = true;
    document.body.style.overflow = "";
}

tombolTutup.addEventListener("click", tutupDetailKegiatan);

// Menutup ketika area gelap di luar kotak diklik
modalKegiatan.addEventListener("click", (event) => {
    if (event.target === modalKegiatan) {
        tutupDetailKegiatan();
    }
});

// Menutup dengan tombol Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalKegiatan.hidden) {
        tutupDetailKegiatan();
    }
});