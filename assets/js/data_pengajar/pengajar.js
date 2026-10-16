/* =================================
   CEK LOGIN ADMIN
================================= */

const adminLogin = localStorage.getItem("adminLogin");

if (adminLogin !== "true") {
    window.location.href = "../admin/login.html";
}



/* =================================
   ELEMENT HTML
================================= */

const pengajarForm = document.getElementById("pengajarForm");

const pengajarId = document.getElementById("pengajarId");
const nip = document.getElementById("nip");
const nama = document.getElementById("nama");
const jenisKelamin = document.getElementById("jenisKelamin");
const bidang = document.getElementById("bidang");
const jabatan = document.getElementById("jabatan");

const tableBody = document.getElementById("pengajarTableBody");
const emptyData = document.getElementById("emptyData");

const totalPengajar = document.getElementById("totalPengajar");
const pengajarLaki = document.getElementById("pengajarLaki");
const pengajarPerempuan = document.getElementById("pengajarPerempuan");

const btnImport = document.getElementById("btnImport");
const fileImport = document.getElementById("fileImport");
const btnExport = document.getElementById("btnExport");

const searchPengajar = document.getElementById("searchPengajar");
const filterBidang = document.getElementById("filterBidang");
const filterJabatan = document.getElementById("filterJabatan");

const formTitle = document.getElementById("formTitle");
const btnSimpan = document.getElementById("btnSimpan");
const btnBatal = document.getElementById("btnBatal");


/* =================================
   AMBIL DATA DARI LOCAL STORAGE
================================= */
let dataPengajar =
    JSON.parse(localStorage.getItem("dataPengajar")) || [];


/* =================================
   TAMPILKAN STATISTIK
================================= */
function tampilkanStatistik() {

    const total = dataPengajar.length;

    const laki = dataPengajar.filter(
        pengajar => pengajar.jenisKelamin === "Laki-laki"
    ).length;

    const perempuan = dataPengajar.filter(
        pengajar => pengajar.jenisKelamin === "Perempuan"
    ).length;


    totalPengajar.textContent = total;

    pengajarLaki.textContent = laki;

    pengajarPerempuan.textContent = perempuan;

}



/* =================================
   EXPORT DATA PENGAJAR
================================= */
function exportData() {

    if (dataPengajar.length === 0) {
        alert("Belum ada data pengajar untuk diexport.");
        return;
    }


    let csv =
        "No,NIP / ID,Nama,Jenis Kelamin,Bidang,Jabatan\n";


    dataPengajar.forEach((pengajar, index) => {

        csv +=
            `${index + 1},"${pengajar.nip}","${pengajar.nama}","${pengajar.jenisKelamin}","${pengajar.bidang}","${pengajar.jabatan}"\n`;

    });


    const blob = new Blob(
        [csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );


    const url = URL.createObjectURL(blob);


    const link = document.createElement("a");

    link.href = url;

    link.download = "data-pengajar.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}



/* =================================
   IMPORT DATA PENGAJAR
================================= */
function importData(file) {

    if (!file) return;


    const reader = new FileReader();


    reader.onload = function(event) {

        const isiFile = event.target.result;

        const baris = isiFile
            .trim()
            .split("\n");


        const dataBaru = baris
            .slice(1)
            .map(barisData => {

                const kolom = barisData
                    .split(",")
                    .map(data =>
                        data
                            .replace(/^"|"$/g, "")
                            .trim()
                    );


                return {

                    id:
                        Date.now().toString()
                        + Math.random(),

                    nip: kolom[1],

                    nama: kolom[2],

                    jenisKelamin: kolom[3],

                    bidang: kolom[4],

                    jabatan: kolom[5]

                };

            });


        if (dataBaru.length === 0) {

            alert(
                "File CSV tidak memiliki data pengajar."
            );

            return;

        }


        const pilihan = confirm(

            `Ditemukan ${dataBaru.length} data pengajar.\n\n` +

            `Klik OK untuk MENAMBAHKAN data ke data lama.\n` +

            `Klik Batal untuk memilih apakah data lama akan diganti.`

        );


        if (pilihan) {

            dataPengajar = [
                ...dataPengajar,
                ...dataBaru
            ];


            localStorage.setItem(
                "dataPengajar",
                JSON.stringify(dataPengajar)
            );


            tampilkanData();

            buatFilter();

            tampilkanStatistik();


            alert(
                `${dataBaru.length} data berhasil ditambahkan.`
            );

        } else {

            const gantiSemua = confirm(

                "PERINGATAN!\n\n" +

                "Semua data pengajar yang sekarang akan diganti " +

                "dengan data dari file CSV.\n\n" +

                "Apakah kamu yakin?"

            );


            if (!gantiSemua) return;


            dataPengajar = dataBaru;


            localStorage.setItem(
                "dataPengajar",
                JSON.stringify(dataPengajar)
            );


            tampilkanData();

            buatFilter();

            tampilkanStatistik();


            alert(
                `Data berhasil diganti dengan ${dataBaru.length} data dari CSV.`
            );

        }


        fileImport.value = "";

    };


    reader.readAsText(file);

}



/* =================================
   TAMPILKAN DATA
================================= */
function tampilkanData(data = dataPengajar) {

    tableBody.innerHTML = "";

    if (data.length === 0) {
        emptyData.classList.add("show");
        return;
    }

    emptyData.classList.remove("show");


    data.forEach((pengajar, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${pengajar.nip}</td>
            <td>${pengajar.nama}</td>
            <td>${pengajar.jenisKelamin}</td>
            <td>${pengajar.bidang}</td>
            <td>${pengajar.jabatan}</td>

            <td>
                <div class="aksi">

                    <button
                        type="button"
                        class="btn-edit"
                        onclick="editPengajar('${pengajar.id}')"
                        title="Edit"
                    >
                        <i class='bx bx-edit'></i>
                    </button>

                    <button
                        type="button"
                        class="btn-hapus"
                        onclick="hapusPengajar('${pengajar.id}')"
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
   BUAT FILTER
================================= */
function buatFilter() {

    // FILTER BIDANG

    const daftarBidang = [
        ...new Set(
            dataPengajar.map(pengajar => pengajar.bidang)
        )
    ];

    filterBidang.innerHTML = `
        <option value="">Semua Bidang</option>
    `;

    daftarBidang.sort().forEach(bidang => {

        const option = document.createElement("option");

        option.value = bidang;

        option.textContent = bidang;

        filterBidang.appendChild(option);

    });


    // FILTER JABATAN

    const daftarJabatan = [
        ...new Set(
            dataPengajar.map(pengajar => pengajar.jabatan)
        )
    ];

    filterJabatan.innerHTML = `
        <option value="">Semua Jabatan</option>
    `;

    daftarJabatan.sort().forEach(jabatan => {

        const option = document.createElement("option");

        option.value = jabatan;

        option.textContent = jabatan;

        filterJabatan.appendChild(option);

    });

}



/* =================================
   SEARCH + FILTER
================================= */
function filterData() {

    const keyword =
        searchPengajar.value.toLowerCase().trim();

    const bidangDipilih =
        filterBidang.value;

    const jabatanDipilih =
        filterJabatan.value;


    const hasil = dataPengajar.filter(pengajar => {

        const cocokSearch =

            pengajar.nip
                .toLowerCase()
                .includes(keyword)

            ||

            pengajar.nama
                .toLowerCase()
                .includes(keyword)

            ||

            pengajar.bidang
                .toLowerCase()
                .includes(keyword)

            ||

            pengajar.jabatan
                .toLowerCase()
                .includes(keyword);


        const cocokBidang =
            bidangDipilih === "" ||
            pengajar.bidang === bidangDipilih;


        const cocokJabatan =
            jabatanDipilih === "" ||
            pengajar.jabatan === jabatanDipilih;


        return (
            cocokSearch &&
            cocokBidang &&
            cocokJabatan
        );

    });


    tampilkanData(hasil);

}





/* =================================
   SIMPAN DATA
================================= */
pengajarForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const id = pengajarId.value;


    const data = {

        id: id || Date.now().toString(),

        nip: nip.value.trim(),

        nama: nama.value.trim(),

        jenisKelamin: jenisKelamin.value,

        bidang: bidang.value.trim(),

        jabatan: jabatan.value.trim()

    };


    if (id) {

        const index = dataPengajar.findIndex(
            pengajar => pengajar.id === id
        );

        if (index !== -1) {
            dataPengajar[index] = data;
        }

    } else {

        dataPengajar.push(data);

    }


    localStorage.setItem(
        "dataPengajar",
        JSON.stringify(dataPengajar)
    );


    tampilkanData();
    buatFilter();
    tampilkanStatistik();
    resetForm();


    alert(
        id
            ? "Data pengajar berhasil diperbarui."
            : "Data pengajar berhasil ditambahkan."
    );

});



/* =================================
   RESET FORM
================================= */
function resetForm() {

    pengajarForm.reset();

    pengajarId.value = "";

    formTitle.textContent = "Tambah Pengajar";

    btnSimpan.innerHTML = `
        <i class='bx bx-save'></i>
        <span>Simpan Data</span>
    `;

}



/* =================================
   TOMBOL BATAL
================================= */
btnBatal.addEventListener("click", function() {

    resetForm();

});



/* =================================
   EDIT DATA PENGAJAR
================================= */
function editPengajar(id) {

    const pengajar = dataPengajar.find(
        data => data.id === id
    );

    if (!pengajar) return;


    pengajarId.value = pengajar.id;

    nip.value = pengajar.nip;

    nama.value = pengajar.nama;

    jenisKelamin.value = pengajar.jenisKelamin;

    bidang.value = pengajar.bidang;

    jabatan.value = pengajar.jabatan;


    formTitle.textContent = "Edit Data Pengajar";

    btnSimpan.innerHTML = `
        <i class='bx bx-save'></i>
        <span>Update Data</span>
    `;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* =================================
   HAPUS DATA PENGAJAR
================================= */
function hapusPengajar(id) {

    const pengajar = dataPengajar.find(
        data => data.id === id
    );

    if (!pengajar) return;


    const yakin = confirm(
        `Apakah kamu yakin ingin menghapus data ${pengajar.nama}?`
    );


    if (!yakin) return;


    dataPengajar = dataPengajar.filter(
        data => data.id !== id
    );


    localStorage.setItem(
        "dataPengajar",
        JSON.stringify(dataPengajar)
    );


    tampilkanData();
    buatFilter();
    tampilkanStatistik();

    alert("Data pengajar berhasil dihapus.");

}


// Tombol Export
btnExport.addEventListener("click", function () {
    exportData();
});

btnImport.addEventListener("click", function() {

    fileImport.click();

});

fileImport.addEventListener("change", function() {

    const file = this.files[0];

    importData(file);

});



/* =================================
   EVENT FILTER
================================= */
searchPengajar.addEventListener(
    "input",
    filterData
);

filterBidang.addEventListener(
    "change",
    filterData
);

filterJabatan.addEventListener(
    "change",
    filterData
);



/* =================================
   TAMPILKAN DATA SAAT HALAMAN DIBUKA
================================= */
buatFilter();
tampilkanData();
tampilkanStatistik();







/* =================================
   LOGOUT ADMIN
================================= */
const btnLogout = document.getElementById("btnLogout");

btnLogout.addEventListener("click", function() {

    const yakin = confirm("Apakah kamu yakin ingin logout?");

    if (!yakin) return;

    localStorage.removeItem("adminLogin");

    window.location.href = "../index.html";

});