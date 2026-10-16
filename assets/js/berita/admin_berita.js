
/* =================================
   CEK LOGIN ADMIN
================================= */

if (localStorage.getItem("adminLogin") !== "true") {
    window.location.href = "../admin/login.html";
}

/* =================================
   AMBIL ELEMEN HTML
================================= */

const beritaForm = document.getElementById("beritaForm");
const beritaId = document.getElementById("beritaId");
const judul = document.getElementById("judul");
const kategori = document.getElementById("kategori");
const penulis = document.getElementById("penulis");
const tanggal = document.getElementById("tanggal");
const gambarUtama = document.getElementById("gambarUtama");

const beritaContent = document.getElementById("beritaContent");
const btnTambahTeks = document.getElementById("btnTambahTeks");
const btnTambahGambar = document.getElementById("btnTambahGambar");

const btnBatal = document.getElementById("btnBatal");
const btnSimpan = document.getElementById("btnSimpan");
const formTitle = document.getElementById("formTitle");

const beritaTableBody = document.getElementById("beritaTableBody");
const emptyData = document.getElementById("emptyData");

const searchBerita = document.getElementById("searchBerita");
const filterKategori = document.getElementById("filterKategori");
const btnLogout = document.getElementById("btnLogout");

/* =================================
   PENYIMPANAN DATA
================================= */
let dataBerita = JSON.parse(localStorage.getItem("dataBerita")) || [];
let isiBerita = [];
let gambarUtamaData = "";

/* =================================
   SIMPAN DATA KE LOCAL STORAGE
================================= */
function simpanPenyimpanan() {
    localStorage.setItem("dataBerita", JSON.stringify(dataBerita));
}



/* =================================
   MEMBACA FILE GAMBAR
================================= */
// function bacaGambar(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();

//         reader.onload = () => resolve(reader.result);
//         reader.onerror = () => reject(new Error("Gambar gagal dibaca."));

//         reader.readAsDataURL(file);
//     });
// }


/* =================================
   KOMPRES GAMBAR OTOMATIS
================================= */

// Mengompres gambar menjadi JPEG
function kompresDataGambar(sumberGambar) {
    return new Promise((resolve, reject) => {
        const gambar = new Image();

        gambar.onload = function () {
            const batasLebar = 1200;
            const batasTinggi = 1200;

            const skala = Math.min(
                1,
                batasLebar / gambar.width,
                batasTinggi / gambar.height
            );

            const canvas = document.createElement("canvas");

            canvas.width = Math.max(
                1,
                Math.round(gambar.width * skala)
            );

            canvas.height = Math.max(
                1,
                Math.round(gambar.height * skala)
            );

            const konteks = canvas.getContext("2d");

            if (!konteks) {
                reject(new Error("Gagal memproses gambar."));
                return;
            }

            konteks.drawImage(
                gambar,
                0,
                0,
                canvas.width,
                canvas.height
            );

            try {
                const hasil = canvas.toDataURL(
                    "image/jpeg",
                    0.72
                );

                resolve(hasil);
            } catch (error) {
                reject(new Error("Gagal mengompres gambar."));
            }
        };

        gambar.onerror = function () {
            reject(new Error("File gambar tidak dapat diproses."));
        };

        gambar.src = sumberGambar;
    });
}

// Membaca file lalu langsung mengompresnya
async function bacaGambar(file) {
    const sumberGambar = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => {
            reject(new Error("Gambar gagal dibaca."));
        };

        reader.readAsDataURL(file);
    });

    return await kompresDataGambar(sumberGambar);
}





/* =================================
   TAMBAH BLOK TEKS
================================= */
btnTambahTeks.addEventListener("click", function () {
    isiBerita.push({
        tipe: "teks",
        isi: ""
    });

    tampilkanEditor();
});



/* =================================
   TAMBAH BLOK GAMBAR
================================= */
btnTambahGambar.addEventListener("click", function () {
    isiBerita.push({
        tipe: "gambar",
        src: ""
    });

    tampilkanEditor();
});



/* =================================
   TAMPILKAN EDITOR ISI BERITA
================================= */
function tampilkanEditor() {
    beritaContent.innerHTML = "";

    isiBerita.forEach((item, index) => {
        const blok = document.createElement("div");
        blok.className = "content-item";

        const header = document.createElement("div");
        header.className = "content-item-header";

        const label = document.createElement("span");
        label.className = "content-item-type";
        label.textContent = item.tipe === "teks"
            ? `Blok Teks ${index + 1}`
            : `Blok Gambar ${index + 1}`;

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.className = "btn-hapus-content";
        tombolHapus.innerHTML = "<i class='bx bx-trash'></i> Hapus";

        tombolHapus.addEventListener("click", function () {
            hapusContent(index);
        });

        header.append(label, tombolHapus);
        blok.appendChild(header);

        if (item.tipe === "teks") {
            const textarea = document.createElement("textarea");

            textarea.className = "content-textarea";
            textarea.placeholder = "Tuliskan isi paragraf berita...";
            textarea.value = item.isi;
            textarea.rows = 5;

            textarea.addEventListener("input", function () {
                isiBerita[index].isi = textarea.value;
            });

            blok.appendChild(textarea);
        } else {
            const input = document.createElement("input");

            input.type = "file";
            input.accept = "image/*";
            input.className = "content-image-upload";

            const preview = document.createElement("img");
            preview.className = "image-preview";
            preview.alt = "Pratinjau gambar isi berita";

            if (item.src) {
                preview.src = item.src;
                preview.classList.add("show");
            }

            input.addEventListener("change", async function () {
                const file = input.files[0];

                if (!file) return;

                if (!file.type.startsWith("image/")) {
                    alert("Silakan pilih file gambar.");
                    input.value = "";
                    return;
                }

                try {
                    isiBerita[index].src = await bacaGambar(file);
                    preview.src = isiBerita[index].src;
                    preview.classList.add("show");
                } catch (error) {
                    alert(error.message);
                }
            });

            blok.append(input, preview);
        }

        beritaContent.appendChild(blok);
    });
}



/* =================================
   HAPUS BLOK ISI BERITA
================================= */
function hapusContent(index) {
    isiBerita.splice(index, 1);
    tampilkanEditor();
}



/* =================================
   GAMBAR UTAMA
================================= */
gambarUtama.addEventListener("change", async function () {
    const file = gambarUtama.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Silakan pilih file gambar.");
        gambarUtama.value = "";
        return;
    }

    try {
        gambarUtamaData = await bacaGambar(file);
    } catch (error) {
        alert(error.message);
    }
});



/* =================================
   SIMPAN BERITA
================================= */
beritaForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const sedangEdit = Boolean(beritaId.value);

    if (!gambarUtamaData) {
        alert("Silakan pilih gambar utama berita.");
        return;
    }

    if (isiBerita.length === 0) {
        alert("Tambahkan minimal satu blok isi berita.");
        return;
    }

    const isiTidakLengkap = isiBerita.some(item => {
        if (item.tipe === "teks") {
            return !item.isi.trim();
        }

        return !item.src;
    });

    if (isiTidakLengkap) {
        alert("Pastikan semua blok teks dan gambar sudah diisi.");
        return;
    }

    const berita = {
        id: beritaId.value || String(Date.now()),
        judul: judul.value.trim(),
        kategori: kategori.value,
        penulis: penulis.value.trim(),
        tanggal: tanggal.value,
        gambarUtama: gambarUtamaData,
        isi: isiBerita.map(item => ({ ...item }))
    };

    if (sedangEdit) {
        const index = dataBerita.findIndex(item => item.id === berita.id);

        if (index !== -1) {
            dataBerita[index] = berita;
        } else {
            alert("Berita yang ingin diedit tidak ditemukan.");
            return;
        }
    } else {
        dataBerita.push(berita);
    }

    try {
        simpanPenyimpanan();
    } catch (error) {
        alert("Penyimpanan gagal. Ukuran gambar mungkin terlalu besar.");
        return;
    }

    tampilkanData();
    buatFilter();
    resetForm();

    alert(
        sedangEdit
            ? "Berita berhasil diperbarui."
            : "Berita berhasil ditambahkan."
    );
});



/* =================================
   FORMAT TANGGAL
================================= */
function formatTanggal(nilai) {
    if (!nilai) return "-";

    const tanggalBerita = new Date(nilai + "T00:00:00");

    if (Number.isNaN(tanggalBerita.getTime())) return nilai;

    return tanggalBerita.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}



/* =================================
   TAMPILKAN DAFTAR BERITA
================================= */
function tampilkanData() {
    const kataKunci = searchBerita.value.trim().toLowerCase();
    const kategoriDipilih = filterKategori.value;

    const hasil = dataBerita
        .filter(berita => {
            const cocokKata =
                berita.judul.toLowerCase().includes(kataKunci) ||
                berita.penulis.toLowerCase().includes(kataKunci);

            const cocokKategori =
                !kategoriDipilih || berita.kategori === kategoriDipilih;

            return cocokKata && cocokKategori;
        })
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

    beritaTableBody.innerHTML = "";

    emptyData.style.display = hasil.length ? "none" : "block";

    hasil.forEach((berita, index) => {
        const baris = document.createElement("tr");

        const nomor = document.createElement("td");
        nomor.textContent = index + 1;

        const kolomJudul = document.createElement("td");
        kolomJudul.textContent = berita.judul;

        const kolomKategori = document.createElement("td");
        kolomKategori.textContent = berita.kategori;

        const kolomPenulis = document.createElement("td");
        kolomPenulis.textContent = berita.penulis;

        const kolomTanggal = document.createElement("td");
        kolomTanggal.textContent = formatTanggal(berita.tanggal);

        const kolomAksi = document.createElement("td");

        const tombolEdit = document.createElement("button");
        tombolEdit.type = "button";
        tombolEdit.className = "btn-edit";
        tombolEdit.textContent = "Edit";
        tombolEdit.addEventListener("click", () => editBerita(berita.id));

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.className = "btn-hapus";
        tombolHapus.textContent = "Hapus";
        tombolHapus.addEventListener("click", () => hapusBerita(berita.id));

        kolomAksi.append(tombolEdit, tombolHapus);
        baris.append(
            nomor,
            kolomJudul,
            kolomKategori,
            kolomPenulis,
            kolomTanggal,
            kolomAksi
        );

        beritaTableBody.appendChild(baris);
    });
}



/* =================================
   EDIT BERITA
================================= */
function editBerita(id) {
    const berita = dataBerita.find(item => item.id === id);

    if (!berita) return;

    beritaId.value = berita.id;
    judul.value = berita.judul;
    kategori.value = berita.kategori;
    penulis.value = berita.penulis;
    tanggal.value = berita.tanggal;

    gambarUtamaData = berita.gambarUtama;
    isiBerita = berita.isi.map(item => ({ ...item }));

    formTitle.textContent = "Edit Berita";
    btnSimpan.innerHTML = "<i class='bx bx-save'></i><span>Perbarui Berita</span>";

    tampilkanEditor();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



/* =================================
   HAPUS BERITA
================================= */
function hapusBerita(id) {
    const yakin = confirm("Yakin ingin menghapus berita ini?");

    if (!yakin) return;

    dataBerita = dataBerita.filter(item => item.id !== id);

    simpanPenyimpanan();
    tampilkanData();
    buatFilter();

    alert("Berita berhasil dihapus.");
}



/* =================================
   RESET FORM
================================= */

function resetForm() {
    beritaForm.reset();

    beritaId.value = "";
    gambarUtamaData = "";
    isiBerita = [];

    beritaContent.innerHTML = "";
    formTitle.textContent = "Tambah Berita";

    btnSimpan.innerHTML = "<i class='bx bx-save'></i><span>Simpan Berita</span>";
}

/* =================================
   BATAL EDIT / TAMBAH
================================= */

btnBatal.addEventListener("click", resetForm);

/* =================================
   FILTER KATEGORI
================================= */

function buatFilter() {
    const kategoriSebelumnya = filterKategori.value;

    const daftarKategori = [
        ...new Set(dataBerita.map(berita => berita.kategori))
    ].sort();

    filterKategori.innerHTML = '<option value="">Semua Kategori</option>';

    daftarKategori.forEach(namaKategori => {
        const opsi = document.createElement("option");
        opsi.value = namaKategori;
        opsi.textContent = namaKategori;

        filterKategori.appendChild(opsi);
    });

    filterKategori.value = daftarKategori.includes(kategoriSebelumnya)
        ? kategoriSebelumnya
        : "";
}

/* =================================
   EVENT SEARCH DAN FILTER
================================= */

searchBerita.addEventListener("input", tampilkanData);
filterKategori.addEventListener("change", tampilkanData);

/* =================================
   EKSPOR CSV
================================= */

function eksporBerita() {
    if (!dataBerita.length) {
        alert("Belum ada berita untuk diekspor.");
        return;
    }

    const kolom = ["id", "judul", "kategori", "penulis", "tanggal", "gambarUtama", "isi"];

    const escapeCSV = nilai => {
        const teks = String(nilai ?? "");
        return '"' + teks.replace(/"/g, '""') + '"';
    };

    const baris = [
        kolom.map(escapeCSV).join(","),
        ...dataBerita.map(berita =>
            kolom.map(kunci => {
                const nilai = kunci === "isi"
                    ? JSON.stringify(berita.isi)
                    : berita[kunci];

                return escapeCSV(nilai);
            }).join(",")
        )
    ];

    const file = new Blob(
        ["\uFEFF" + baris.join("\r\n")],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "data-berita.csv";
    link.click();

    URL.revokeObjectURL(url);
}

/* =================================
   IMPOR CSV
================================= */

function imporBerita(file) {
    const reader = new FileReader();

    reader.onload = function () {
        try {
            const teks = reader.result.replace(/^\uFEFF/, "");
            const baris = teks.split(/\r?\n/).filter(item => item.trim());

            if (baris.length < 2) {
                throw new Error("File CSV tidak berisi data.");
            }

            // Membaca CSV termasuk tanda koma di dalam tanda kutip.
            function pecahCSV(teksBaris) {
                const hasil = [];
                let nilai = "";
                let dalamKutip = false;

                for (let i = 0; i < teksBaris.length; i++) {
                    const karakter = teksBaris[i];

                    if (karakter === '"') {
                        if (dalamKutip && teksBaris[i + 1] === '"') {
                            nilai += '"';
                            i++;
                        } else {
                            dalamKutip = !dalamKutip;
                        }
                    } else if (karakter === "," && !dalamKutip) {
                        hasil.push(nilai);
                        nilai = "";
                    } else {
                        nilai += karakter;
                    }
                }

                hasil.push(nilai);
                return hasil;
            }

            const header = pecahCSV(baris[0]).map(nilai =>
                nilai.trim().replace(/^"|"$/g, "")
            );

            const kolomWajib = [
                "id", "judul", "kategori", "penulis",
                "tanggal", "gambarUtama", "isi"
            ];

            if (!kolomWajib.every(kolom => header.includes(kolom))) {
                throw new Error("Format kolom CSV tidak sesuai.");
            }

            const beritaImpor = baris.slice(1).map(teksBaris => {
                const nilai = pecahCSV(teksBaris);
                const hasil = {};

                header.forEach((kolom, index) => {
                    hasil[kolom] = nilai[index] ?? "";
                });

                hasil.isi = JSON.parse(hasil.isi);

                if (
                    !hasil.id ||
                    !hasil.judul ||
                    !Array.isArray(hasil.isi)
                ) {
                    throw new Error("Ada data berita yang tidak valid.");
                }

                return hasil;
            });

            const gabungan = [...dataBerita];

            beritaImpor.forEach(berita => {
                const index = gabungan.findIndex(item => item.id === berita.id);

                if (index >= 0) {
                    gabungan[index] = berita;
                } else {
                    gabungan.push(berita);
                }
            });

            const dataLama = dataBerita;
            dataBerita = gabungan;

            try {
                simpanPenyimpanan();
            } catch (error) {
                dataBerita = dataLama;
                simpanPenyimpanan();
                throw new Error("Penyimpanan penuh atau ukuran data terlalu besar.");
            }

            buatFilter();
            tampilkanData();

            alert(`${beritaImpor.length} berita berhasil diimpor.`);
        } catch (error) {
            alert("Gagal mengimpor berita: " + error.message);
        }
    };

    reader.onerror = () => alert("File CSV gagal dibaca.");
    reader.readAsText(file);
}

/* =================================
   HUBUNGKAN TOMBOL IMPOR / EKSPOR
================================= */

// Tombol dan input dibuat di sini agar tidak perlu menambah
// elemen HTML baru secara manual.
const areaDataBerita = beritaTableBody.closest(".admin-card");
const areaTombol = areaDataBerita?.querySelector(".data-header");

if (areaTombol) {
    const grupTombol = document.createElement("div");
    grupTombol.className = "berita-export-import";

    const btnEkspor = document.createElement("button");
    btnEkspor.type = "button";
    btnEkspor.className = "btn-content";
    btnEkspor.textContent = "Ekspor CSV";
    btnEkspor.addEventListener("click", eksporBerita);

    const btnImpor = document.createElement("button");
    btnImpor.type = "button";
    btnImpor.className = "btn-content";
    btnImpor.textContent = "Impor CSV";

    const inputImpor = document.createElement("input");
    inputImpor.type = "file";
    inputImpor.accept = ".csv,text/csv";
    inputImpor.hidden = true;

    btnImpor.addEventListener("click", () => inputImpor.click());

    inputImpor.addEventListener("change", function () {
        const file = inputImpor.files[0];

        if (file) imporBerita(file);

        inputImpor.value = "";
    });

    grupTombol.append(btnEkspor, btnImpor, inputImpor);
    areaTombol.appendChild(grupTombol);
}

/* =================================
   LOGOUT
================================= */

btnLogout.addEventListener("click", function () {
    const yakin = confirm("Yakin ingin logout?");

    if (!yakin) return;

    localStorage.removeItem("adminLogin");
    window.location.href = "../admin/login.html";
});

/* =================================
   JALANKAN SAAT HALAMAN DIBUKA
================================= */

buatFilter();
tampilkanData();
