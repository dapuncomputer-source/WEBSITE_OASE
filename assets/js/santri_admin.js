/* =================================
   DATA SANTRI ADMIN
================================= */


/* =================================
   ELEMENT HTML
================================= */
const santriForm = document.getElementById("santriForm");
const santriId = document.getElementById("santriId");

const nis = document.getElementById("nis");
const nama = document.getElementById("nama");
const jenisKelamin = document.getElementById("jenisKelamin");
const kelas = document.getElementById("kelas");
const angkatan = document.getElementById("angkatan");

const tableBody = document.getElementById("santriTableBody");
const emptyData = document.getElementById("emptyData");
const searchSantri = document.getElementById("searchSantri");

const filterKelas = document.getElementById("filterKelas");
const filterAngkatan = document.getElementById("filterAngkatan");

const formTitle = document.getElementById("formTitle");
const btnSimpan = document.getElementById("btnSimpan");
const btnBatal = document.getElementById("btnBatal");

// AMBIL DATA DARI LOCAL STORAGE
let dataSantri = JSON.parse(localStorage.getItem("dataSantri")) || [];

const adminTotalSantri = document.getElementById("adminTotalSantri");
const adminSantriPutra = document.getElementById("adminSantriPutra");
const adminSantriPutri = document.getElementById("adminSantriPutri");

const btnExport = document.getElementById("btnExport");
const fileImport = document.getElementById("fileImport");

/* =================================
   TAMPILKAN DATA STATISTIK
================================= */
function tampilkanStatistik() {

    const total = dataSantri.length;

    const putra = dataSantri.filter(
        santri => santri.jenisKelamin === "Laki-laki"
    ).length;

    const putri = dataSantri.filter(
        santri => santri.jenisKelamin === "Perempuan"
    ).length;

    adminTotalSantri.textContent = total;
    adminSantriPutra.textContent = putra;
    adminSantriPutri.textContent = putri;
}


/* =================================
   TAMPILKAN DATA
================================= */
function tampilkanData(data = dataSantri) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        emptyData.classList.add("show");

        return;

    }

    emptyData.classList.remove("show");


    data.forEach((santri, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${santri.nis}</td>

            <td>${santri.nama}</td>

            <td>${santri.jenisKelamin}</td>

            <td>${santri.kelas}</td>

            <td>${santri.angkatan}</td>

            <td>

                <div class="aksi">

                    <button
                        type="button"
                        class="btn-edit"
                        onclick="editSantri('${santri.id}')"
                        title="Edit"
                    >
                        <i class='bx bx-edit'></i>
                    </button>

                    <button
                        type="button"
                        class="btn-hapus"
                        onclick="hapusSantri('${santri.id}')"
                        title="Hapus"
                    >
                        <i class='bx bx-trash'></i>
                    </button>

                </div>

            </td>

        `;

        tableBody.appendChild(row);

    });

}


/* =================================
   BUAT FILTER KELAS & ANGKATAN
================================= */
function buatFilter() {

    /* =============================
       KELAS
    ============================== */
    const daftarKelas = [
        ...new Set(
            dataSantri.map(
                santri => santri.kelas
            )
        )
    ];


    /* Kosongkan pilihan */
    filterKelas.innerHTML = `
        <option value="">
            Semua Kelas
        </option>
    `;


    /* Masukkan kelas */
    daftarKelas.sort().forEach(kelas => {

        const option = document.createElement("option");

        option.value = kelas;

        option.textContent = kelas;

        filterKelas.appendChild(option);

    });


    /* =============================
       ANGKATAN
    ============================== */
    const daftarAngkatan = [
        ...new Set(
            dataSantri.map(
                santri => santri.angkatan
            )
        )
    ];


    filterAngkatan.innerHTML = `
        <option value="">
            Semua Angkatan
        </option>
    `;


    /* Urutkan tahun */

    daftarAngkatan.sort(
        (a, b) => Number(a) - Number(b)
    );


    /* Masukkan angkatan */

    daftarAngkatan.forEach(angkatan => {

        const option = document.createElement("option");

        option.value = angkatan;

        option.textContent = angkatan;

        filterAngkatan.appendChild(option);

    });

}


/* =================================
   FILTER DATA
================================= */
function filterData() {

    const keyword = searchSantri.value
        .toLowerCase()
        .trim();


    const kelasDipilih = filterKelas.value;

    const angkatanDipilih = filterAngkatan.value;


    const hasil = dataSantri.filter(santri => {

        /* =============================
           PENCARIAN
        ============================== */

        const cocokSearch =

            santri.nis
                .toLowerCase()
                .includes(keyword)

            ||

            santri.nama
                .toLowerCase()
                .includes(keyword)

            ||

            santri.kelas
                .toLowerCase()
                .includes(keyword)

            ||

            santri.angkatan
                .toLowerCase()
                .includes(keyword);


        /* =============================
           FILTER KELAS
        ============================== */

        const cocokKelas =

            kelasDipilih === "" ||

            santri.kelas === kelasDipilih;


        /* =============================
           FILTER ANGKATAN
        ============================== */

        const cocokAngkatan =

            angkatanDipilih === "" ||

            santri.angkatan === angkatanDipilih;


        return (
            cocokSearch &&
            cocokKelas &&
            cocokAngkatan
        );

    });


    tampilkanData(hasil);

}


/* =================================
   EXPORT DATA
================================= */
function exportData() {

    if (dataSantri.length === 0) {
        alert("Belum ada data santri untuk diexport.");
        return;
    }

    let csv = "No,NIS,Nama,Jenis Kelamin,Kelas,Angkatan\n";

    dataSantri.forEach((santri, index) => {

        csv += `${index + 1},"${santri.nis}","${santri.nama}","${santri.jenisKelamin}","${santri.kelas}","${santri.angkatan}"\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "data-santri.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


/* =================================
   IMPORT DATA
================================= */
function importData(file) {

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        const isiFile = event.target.result;

        const baris = isiFile.trim().split("\n");

        // Lewati baris pertama karena berisi judul kolom
        const dataBaru = baris.slice(1).map(barisData => {

            const kolom = barisData
                .split(",")
                .map(data => data.replace(/^"|"$/g, "").trim());

            return {
                id: Date.now().toString() + Math.random(),
                nis: kolom[1],
                nama: kolom[2],
                jenisKelamin: kolom[3],
                kelas: kolom[4],
                angkatan: kolom[5]
            };

        });

        if (dataBaru.length === 0) {
            alert("File CSV tidak memiliki data santri.");
            return;
        }

        const pilihan = confirm(
            `Ditemukan ${dataBaru.length} data santri.\n\n` +
            `Klik OK untuk MENAMBAHKAN data ke data lama.\n` +
            `Klik Batal untuk memilih apakah data lama akan diganti.`
        );

        if (pilihan) {

            // TAMBAHKAN KE DATA LAMA
            dataSantri = [...dataSantri, ...dataBaru];

            localStorage.setItem(
                "dataSantri",
                JSON.stringify(dataSantri)
            );

            tampilkanData();
            buatFilter();
            tampilkanStatistik();

            alert(
                `${dataBaru.length} data berhasil ditambahkan.`
            );

        } else {

            // KONFIRMASI GANTI SEMUA DATA
            const gantiSemua = confirm(
                "PERINGATAN!\n\n" +
                "Semua data santri yang sekarang akan diganti " +
                "dengan data dari file CSV.\n\n" +
                "Apakah kamu yakin?"
            );

            if (!gantiSemua) {
                return;
            }

            dataSantri = dataBaru;

            localStorage.setItem(
                "dataSantri",
                JSON.stringify(dataSantri)
            );

            tampilkanData();
            buatFilter();
            tampilkanStatistik();

            alert(
                `Data berhasil diganti dengan ${dataBaru.length} data dari CSV.`
            );
        }

        // Reset input file
        fileImport.value = "";
    };

    reader.readAsText(file);
}

/* =================================
   SIMPAN DATA
================================= */
santriForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = santriId.value;

    const data = {

        id: id || Date.now().toString(),

        nis: nis.value.trim(),

        nama: nama.value.trim(),

        jenisKelamin: jenisKelamin.value,

        kelas: kelas.value.trim(),

        angkatan: angkatan.value.trim()

    };


    /* =============================
       EDIT DATA
    ============================== */
    if (id) {

        const index = dataSantri.findIndex(
            santri => santri.id === id
        );


        if (index !== -1) {

            dataSantri[index] = data;

        }

    }

    /* =============================
       TAMBAH DATA
    ============================== */
    else {
        dataSantri.push(data);
    }


    /* =============================
       SIMPAN KE LOCAL STORAGE
    ============================== */
    localStorage.setItem(
        "dataSantri",
        JSON.stringify(dataSantri)
    );


    /* =============================
       UPDATE TAMPILAN
    ============================== */
    tampilkanData();
    buatFilter();
    tampilkanStatistik();
    resetForm();


    alert(
        id
        ? "Data santri berhasil diperbarui."
        : "Data santri berhasil ditambahkan."
    );

});


/* =================================
   EDIT SANTRI
================================= */
function editSantri(id) {

    const santri = dataSantri.find(
        data => data.id === id
    );


    if (!santri) {
        return;
    }


    santriId.value = santri.id;
    nis.value = santri.nis;
    nama.value = santri.nama;
    jenisKelamin.value = santri.jenisKelamin;
    kelas.value = santri.kelas;
    angkatan.value = santri.angkatan;


    /* Ubah judul form */
    formTitle.textContent = "Edit Data Santri";


    /* Ubah tombol */
    btnSimpan.innerHTML = `
        <i class='bx bx-save'></i>
        <span>Update Data</span>
    `;


    /* Scroll ke form */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =================================
   HAPUS SANTRI
================================= */
function hapusSantri(id) {

    const santri = dataSantri.find(
        data => data.id === id
    );


    if (!santri) {

        return;

    }


    const yakin = confirm(
        `Apakah kamu yakin ingin menghapus data ${santri.nama}?`
    );


    if (!yakin) {

        return;

    }


    dataSantri = dataSantri.filter(
        data => data.id !== id
    );


    localStorage.setItem(
        "dataSantri",
        JSON.stringify(dataSantri)
    );


    tampilkanData();
    buatFilter();
    tampilkanStatistik();


    alert("Data santri berhasil dihapus.");

}


/* =================================
   RESET FORM
================================= */
function resetForm() {

    santriForm.reset();

    santriId.value = "";

    formTitle.textContent = "Tambah Data Santri";

    btnSimpan.innerHTML = `
        <i class='bx bx-save'></i>
        <span>Simpan Data</span>
    `;

}


/* =================================
   BUTTON BATAL
================================= */
btnBatal.addEventListener("click", function() {

    resetForm();

});


/* =================================
   EVENT FILTER
================================= */
searchSantri.addEventListener(
    "input",
    filterData
);


filterKelas.addEventListener(
    "change",
    filterData
);


filterAngkatan.addEventListener(
    "change",
    filterData
);

// Tombol Export dan Import Data
btnImport.addEventListener("click", function() {
    fileImport.click();
});
fileImport.addEventListener("change", function() {

    const file = this.files[0];

    importData(file);

});


/* =================================
   TAMPILKAN DATA SAAT HALAMAN DIBUKA
================================= */
buatFilter();
tampilkanData();
tampilkanStatistik();