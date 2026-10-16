
/* =================================
   BERITA LANDING PAGE OASE
================================= */

// Mengambil berita dari penyimpanan admin
const dataBeritaLanding = JSON.parse(
    localStorage.getItem("dataBerita")
) || [];

// Mengambil tempat kartu berita
const beritaUtama = document.getElementById("beritaUtama");
const beritaList = document.getElementById("beritaList");
const pesanBeritaKosong = document.getElementById("pesanBeritaKosong");

// Mengurutkan berita dari tanggal terbaru
function urutkanBeritaLanding() {
    return [...dataBeritaLanding].sort((a, b) => {
        return (b.tanggal || "").localeCompare(a.tanggal || "");
    });
}

// Mengubah tanggal menjadi format Indonesia
function tanggalBeritaLanding(tanggal) {
    if (!tanggal) return "";

    const tanggalObjek = new Date(tanggal + "T00:00:00");

    if (Number.isNaN(tanggalObjek.getTime())) {
        return tanggal;
    }

    return tanggalObjek.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// Membuat satu kartu berita
function buatKartuBerita(berita, ukuran) {
    const artikel = document.createElement("article");
    artikel.className = `berita_card berita_card_${ukuran}`;

    const link = document.createElement("a");
    link.href = `berita/index.html?id=${encodeURIComponent(berita.id)}`;

    // Gambar utama
    const gambar = document.createElement("img");
    gambar.src = berita.gambarUtama || "";
    gambar.alt = berita.judul || "Berita Pesantren Oase";
    gambar.loading = "lazy";

    // Lapisan teks di atas gambar
    const overlay = document.createElement("div");
    overlay.className = "berita_overlay";

    const kategori = document.createElement("span");
    kategori.className = "berita_kategori";
    kategori.textContent = berita.kategori || "Informasi";

    const judul = document.createElement("h3");
    judul.textContent = berita.judul || "Tanpa judul";

    overlay.append(kategori, judul);

    // Tanggal ditampilkan pada kartu besar
    if (ukuran === "besar") {
        const tanggal = document.createElement("p");
        tanggal.textContent = tanggalBeritaLanding(berita.tanggal);
        overlay.appendChild(tanggal);
    }

    link.append(gambar, overlay);
    artikel.appendChild(link);

    return artikel;
}

// Menampilkan berita
function tampilkanBeritaLanding() {
    beritaUtama.innerHTML = "";
    beritaList.innerHTML = "";

    const daftarBerita = urutkanBeritaLanding();

    // Jika belum ada berita
    if (daftarBerita.length === 0) {
        pesanBeritaKosong.hidden = false;
        return;
    }

    pesanBeritaKosong.hidden = true;

    // Dua berita pertama menjadi kartu besar
    daftarBerita.slice(0, 2).forEach(berita => {
        beritaUtama.appendChild(
            buatKartuBerita(berita, "besar")
        );
    });

    // Berita ke-3 dan seterusnya menjadi kartu kecil
    daftarBerita.slice(2).forEach(berita => {
        beritaList.appendChild(
            buatKartuBerita(berita, "kecil")
        );
    });
}

// Jalankan ketika halaman dibuka
tampilkanBeritaLanding();
