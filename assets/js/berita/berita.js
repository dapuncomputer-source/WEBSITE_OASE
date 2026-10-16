
/* =================================
   HALAMAN BERITA PUBLIK OASE
================================= */

// Mengambil data berita yang disimpan admin
const dataBerita = JSON.parse(
    localStorage.getItem("dataBerita")
) || [];

// Mengambil elemen HTML
const artikelKategori = document.getElementById("artikelKategori");
const artikelJudul = document.getElementById("artikelJudul");
const artikelTanggal = document.getElementById("artikelTanggal");
const artikelPenulis = document.getElementById("artikelPenulis");
const artikelGambarUtama = document.getElementById("artikelGambarUtama");
const artikelIsi = document.getElementById("artikelIsi");
const beritaTerbaruList = document.getElementById("beritaTerbaruList");
const tahunFooter = document.getElementById("tahunFooter");

// Tahun pada footer
tahunFooter.textContent = new Date().getFullYear();

/* =================================
   FORMAT TANGGAL
================================= */

function formatTanggal(tanggal) {
    if (!tanggal) return "-";

    const hasil = new Date(tanggal + "T00:00:00");

    if (Number.isNaN(hasil.getTime())) {
        return tanggal;
    }

    return hasil.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

/* =================================
   URUTKAN BERITA TERBARU
================================= */

function urutkanBerita() {
    return [...dataBerita].sort((a, b) => {
        return (b.tanggal || "").localeCompare(a.tanggal || "");
    });
}

/* =================================
   TAMPILKAN BERITA TERBARU
================================= */

function tampilkanBeritaTerbaru(idAktif) {
    beritaTerbaruList.innerHTML = "";

    const daftarBerita = urutkanBerita();

    if (daftarBerita.length === 0) {
        const pesan = document.createElement("p");
        pesan.className = "berita-kosong";
        pesan.textContent = "Belum ada berita yang diterbitkan.";

        beritaTerbaruList.appendChild(pesan);
        return;
    }

    daftarBerita.forEach(berita => {
        const link = document.createElement("a");

        link.className = "berita-terbaru-item";
        link.href = `index.html?id=${encodeURIComponent(berita.id)}`;

        if (String(berita.id) === String(idAktif)) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }

        const judul = document.createElement("h3");
        judul.textContent = berita.judul;

        const tanggal = document.createElement("time");
        tanggal.textContent = formatTanggal(berita.tanggal);
        tanggal.dateTime = berita.tanggal || "";

        link.append(judul, tanggal);
        beritaTerbaruList.appendChild(link);
    });
}

/* =================================
   TAMPILKAN ISI ARTIKEL
================================= */

function tampilkanIsiArtikel(isi) {
    artikelIsi.innerHTML = "";

    if (!Array.isArray(isi) || isi.length === 0) {
        const pesan = document.createElement("p");
        pesan.textContent = "Isi berita belum tersedia.";

        artikelIsi.appendChild(pesan);
        return;
    }

    isi.forEach(item => {
        if (item.tipe === "teks") {
            const paragraf = document.createElement("p");

            // textContent menjaga isi berita tampil sebagai teks biasa
            paragraf.textContent = item.isi || "";

            artikelIsi.appendChild(paragraf);
        }

        if (item.tipe === "gambar" && item.src) {
            const gambar = document.createElement("img");

            gambar.src = item.src;
            gambar.alt = "Gambar isi berita";
            gambar.loading = "lazy";

            artikelIsi.appendChild(gambar);
        }
    });
}

/* =================================
   TAMPILKAN SATU ARTIKEL
================================= */

function tampilkanArtikel(berita) {
    artikelKategori.textContent = berita.kategori || "Berita";
    artikelJudul.textContent = berita.judul || "Tanpa judul";

    artikelTanggal.textContent = formatTanggal(berita.tanggal);
    artikelTanggal.dateTime = berita.tanggal || "";

    artikelPenulis.textContent = berita.penulis || "Redaksi Oase";

    if (berita.gambarUtama) {
        artikelGambarUtama.src = berita.gambarUtama;
        artikelGambarUtama.alt = berita.judul || "Gambar utama berita";
        artikelGambarUtama.hidden = false;
    } else {
        artikelGambarUtama.removeAttribute("src");
        artikelGambarUtama.hidden = true;
    }

    tampilkanIsiArtikel(berita.isi);

    // Judul tab browser mengikuti artikel yang dibuka
    document.title = `${berita.judul || "Berita"} | Oase`;
}

/* =================================
   PESAN JIKA BELUM ADA BERITA
================================= */

function tampilkanPesanKosong() {
    artikelKategori.textContent = "Informasi";
    artikelJudul.textContent = "Belum Ada Berita";
    artikelTanggal.textContent = "-";
    artikelPenulis.textContent = "Redaksi Oase";

    artikelGambarUtama.removeAttribute("src");
    artikelGambarUtama.hidden = true;

    artikelIsi.innerHTML = "";

    const paragraf = document.createElement("p");
    paragraf.textContent =
        "Berita belum tersedia. Silakan kembali lagi nanti untuk mendapatkan informasi terbaru dari Pesantren Oase Al-Qur'an.";

    artikelIsi.appendChild(paragraf);

    document.title = "Berita | Oase";
}

/* =================================
   PILIH ARTIKEL YANG DIBUKA
================================= */

function jalankanHalamanBerita() {
    const daftarBerita = urutkanBerita();

    // Membaca ID dari URL, misalnya index.html?id=12345
    const parameterURL = new URLSearchParams(window.location.search);
    const idDipilih = parameterURL.get("id");

    let beritaAktif;

    if (idDipilih) {
        beritaAktif = daftarBerita.find(
            berita => String(berita.id) === idDipilih
        );
    } else {
        // Jika tidak ada ID, buka berita terbaru
        beritaAktif = daftarBerita[0];
    }

    if (beritaAktif) {
        tampilkanArtikel(beritaAktif);
        tampilkanBeritaTerbaru(beritaAktif.id);
    } else if (daftarBerita.length > 0) {
        // Jika ID URL tidak ditemukan, tampilkan berita terbaru
        tampilkanArtikel(daftarBerita[0]);
        tampilkanBeritaTerbaru(daftarBerita[0].id);
    } else {
        tampilkanPesanKosong();
        tampilkanBeritaTerbaru(null);
    }
}

/* =================================
   JALANKAN SAAT HALAMAN DIBUKA
================================= */

jalankanHalamanBerita();
