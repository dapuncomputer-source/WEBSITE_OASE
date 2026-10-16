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

const pengurusForm = document.getElementById("pengurusForm");

const pengurusId = document.getElementById("pengurusId");
const nip = document.getElementById("nip");
const nama = document.getElementById("nama");
const jenisKelamin = document.getElementById("jenisKelamin");
const bagian = document.getElementById("bagian");
const jabatan = document.getElementById("jabatan");

const tableBody = document.getElementById("pengurusTableBody");
const emptyData = document.getElementById("emptyData");

const totalPengurus = document.getElementById("totalPengurus");
const pengurusLaki = document.getElementById("pengurusLaki");
const pengurusPerempuan = document.getElementById("pengurusPerempuan");

const searchPengurus = document.getElementById("searchPengurus");

const filterBagian = document.getElementById("filterBagian");
const filterJabatan = document.getElementById("filterJabatan");

const formTitle = document.getElementById("formTitle");
const btnSimpan = document.getElementById("btnSimpan");
const btnBatal = document.getElementById("btnBatal");

const btnExport = document.getElementById("btnExport");
const btnImport = document.getElementById("btnImport");
const fileImport = document.getElementById("fileImport");


/* =================================
   DATA PENGURUS
================================= */

let dataPengurus =
    JSON.parse(localStorage.getItem("dataPengurus")) || [];


/* =================================
   TAMPILKAN DATA
================================= */
function tampilkanData(data = dataPengurus) {

    tableBody.innerHTML = "";

    if (data.length === 0) {
        emptyData.classList.add("show");
        return;
    }

    emptyData.classList.remove("show");

    data.forEach((pengurus, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>${pengurus.nip}</td>

            <td>${pengurus.nama}</td>

            <td>${pengurus.jenisKelamin}</td>

            <td>${pengurus.bagian}</td>

            <td>${pengurus.jabatan}</td>

            <td>
                <div class="aksi">

                    <button
                        type="button"
                        class="btn-edit"
                        onclick="editPengurus('${pengurus.id}')"
                        title="Edit"
                    >
                        <i class='bx bx-edit'></i>
                    </button>

                    <button
                        type="button"
                        class="btn-hapus"
                        onclick="hapusPengurus('${pengurus.id}')"
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
   TAMBAH / EDIT DATA
================================= */
pengurusForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const id = pengurusId.value;

    const data = {

        id: id || Date.now().toString(),

        nip: nip.value.trim(),

        nama: nama.value.trim(),

        jenisKelamin: jenisKelamin.value,

        bagian: bagian.value.trim(),

        jabatan: jabatan.value.trim()

    };


    /* EDIT DATA */

    if (id) {

        const index = dataPengurus.findIndex(
            pengurus => pengurus.id === id
        );

        if (index !== -1) {

            dataPengurus[index] = data;

        }

    }

    /* TAMBAH DATA */

    else {

        dataPengurus.push(data);

    }


    /* SIMPAN KE LOCAL STORAGE */

    localStorage.setItem(
        "dataPengurus",
        JSON.stringify(dataPengurus)
    );


    /* UPDATE TAMPILAN */

    tampilkanData();
    buatFilter();
    tampilkanStatistik();
    resetForm();


    alert(
        id
            ? "Data pengurus berhasil diperbarui."
            : "Data pengurus berhasil ditambahkan."
    );

});


/* =================================
   EDIT PENGURUS
================================= */
function editPengurus(id) {

    const pengurus = dataPengurus.find(
        data => data.id === id
    );

    if (!pengurus) return;


    pengurusId.value = pengurus.id;

    nip.value = pengurus.nip;

    nama.value = pengurus.nama;

    jenisKelamin.value = pengurus.jenisKelamin;

    bagian.value = pengurus.bagian;

    jabatan.value = pengurus.jabatan;


    formTitle.textContent = "Edit Data Pengurus";

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
   HAPUS PENGURUS
================================= */
function hapusPengurus(id) {

    const pengurus = dataPengurus.find(
        data => data.id === id
    );

    if (!pengurus) return;


    const yakin = confirm(
        `Apakah kamu yakin ingin menghapus data ${pengurus.nama}?`
    );

    if (!yakin) return;


    dataPengurus = dataPengurus.filter(
        data => data.id !== id
    );


    localStorage.setItem(
        "dataPengurus",
        JSON.stringify(dataPengurus)
    );


    tampilkanData();

    buatFilter();

    tampilkanStatistik();


    alert("Data pengurus berhasil dihapus.");

}


/* =================================
   RESET FORM
================================= */
function resetForm() {

    pengurusForm.reset();

    pengurusId.value = "";

    formTitle.textContent = "Tambah Data Pengurus";

    btnSimpan.innerHTML = `
        <i class='bx bx-save'></i>
        <span>Simpan Data</span>
    `;

}


/* =================================
   TOMBOL BATAL
================================= */
btnBatal.addEventListener("click", function () {

    resetForm();

});


/* =================================
   BUAT FILTER
================================= */
function buatFilter() {

    /* FILTER BAGIAN */

    const daftarBagian = [
        ...new Set(
            dataPengurus.map(
                pengurus => pengurus.bagian
            )
        )
    ];


    filterBagian.innerHTML = `
        <option value="">
            Semua Bagian
        </option>
    `;


    daftarBagian.sort().forEach(bagianData => {

        const option = document.createElement("option");

        option.value = bagianData;

        option.textContent = bagianData;

        filterBagian.appendChild(option);

    });


    /* FILTER JABATAN */

    const daftarJabatan = [
        ...new Set(
            dataPengurus.map(
                pengurus => pengurus.jabatan
            )
        )
    ];


    filterJabatan.innerHTML = `
        <option value="">
            Semua Jabatan
        </option>
    `;


    daftarJabatan.sort().forEach(jabatanData => {

        const option = document.createElement("option");

        option.value = jabatanData;

        option.textContent = jabatanData;

        filterJabatan.appendChild(option);

    });

}


/* =================================
   SEARCH & FILTER DATA
================================= */
function filterData() {

    const keyword =
        searchPengurus.value
            .toLowerCase()
            .trim();


    const bagianDipilih =
        filterBagian.value;


    const jabatanDipilih =
        filterJabatan.value;


    const hasil = dataPengurus.filter(pengurus => {

        const cocokSearch =

            pengurus.nip
                .toLowerCase()
                .includes(keyword)

            ||

            pengurus.nama
                .toLowerCase()
                .includes(keyword)

            ||

            pengurus.bagian
                .toLowerCase()
                .includes(keyword)

            ||

            pengurus.jabatan
                .toLowerCase()
                .includes(keyword);


        const cocokBagian =
            bagianDipilih === ""
            ||
            pengurus.bagian === bagianDipilih;


        const cocokJabatan =
            jabatanDipilih === ""
            ||
            pengurus.jabatan === jabatanDipilih;


        return (
            cocokSearch
            &&
            cocokBagian
            &&
            cocokJabatan
        );

    });


    tampilkanData(hasil);

}


/* =================================
   EVENT SEARCH & FILTER
================================= */

searchPengurus.addEventListener(
    "input",
    filterData
);

filterBagian.addEventListener(
    "change",
    filterData
);

filterJabatan.addEventListener(
    "change",
    filterData
);


/* =================================
   STATISTIK
================================= */
function tampilkanStatistik() {

    const total =
        dataPengurus.length;


    const laki =
        dataPengurus.filter(
            pengurus =>
                pengurus.jenisKelamin === "Laki-laki"
        ).length;


    const perempuan =
        dataPengurus.filter(
            pengurus =>
                pengurus.jenisKelamin === "Perempuan"
        ).length;


    totalPengurus.textContent = total;

    pengurusLaki.textContent = laki;

    pengurusPerempuan.textContent = perempuan;

}


/* =================================
   EXPORT DATA
================================= */
function exportData() {

    if (dataPengurus.length === 0) {

        alert(
            "Belum ada data pengurus untuk diexport."
        );

        return;

    }


    let csv =
        "No,NIP / ID,Nama,Jenis Kelamin,Bagian,Jabatan\n";


    dataPengurus.forEach(
        (pengurus, index) => {

            csv +=
                `${index + 1},"${pengurus.nip}","${pengurus.nama}","${pengurus.jenisKelamin}","${pengurus.bagian}","${pengurus.jabatan}"\n`;

        }
    );


    const blob = new Blob(
        [csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "data-pengurus.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


/* =================================
   EVENT EXPORT
================================= */
btnExport.addEventListener(
    "click",
    exportData
);

btnImport.addEventListener(
    "click",
    function () {

        fileImport.click();

    }
);

fileImport.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        importData(file);

    }
);


/* =================================
   IMPORT DATA
================================= */

function importData(file) {

    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            const isiFile =
                event.target.result;


            const baris =
                isiFile.trim().split("\n");


            const dataBaru =
                baris
                    .slice(1)
                    .map(barisData => {

                        const kolom =
                            barisData
                                .split(",")
                                .map(data =>
                                    data
                                        .replace(/^"|"$/g, "")
                                        .trim()
                                );


                        return {

                            id:
                                Date.now().toString()
                                +
                                Math.random(),

                            nip:
                                kolom[1],

                            nama:
                                kolom[2],

                            jenisKelamin:
                                kolom[3],

                            bagian:
                                kolom[4],

                            jabatan:
                                kolom[5]

                        };

                    });


            if (dataBaru.length === 0) {

                alert(
                    "File CSV tidak memiliki data pengurus."
                );

                return;

            }


            const pilihan =
                confirm(
                    `Ditemukan ${dataBaru.length} data pengurus.\n\n` +
                    `Klik OK untuk MENAMBAHKAN data ke data lama.\n` +
                    `Klik Batal untuk memilih apakah data lama akan diganti.`
                );


            /* TAMBAHKAN */

            if (pilihan) {

                dataPengurus = [
                    ...dataPengurus,
                    ...dataBaru
                ];


                localStorage.setItem(
                    "dataPengurus",
                    JSON.stringify(dataPengurus)
                );


                tampilkanData();

                buatFilter();

                tampilkanStatistik();


                alert(
                    `${dataBaru.length} data berhasil ditambahkan.`
                );

            }


            /* GANTI SEMUA */

            else {

                const gantiSemua =
                    confirm(
                        "PERINGATAN!\n\n" +
                        "Semua data pengurus yang sekarang akan diganti " +
                        "dengan data dari file CSV.\n\n" +
                        "Apakah kamu yakin?"
                    );


                if (!gantiSemua) return;


                dataPengurus =
                    dataBaru;


                localStorage.setItem(
                    "dataPengurus",
                    JSON.stringify(dataPengurus)
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
   LOGOUT
================================= */

const btnLogout =
    document.getElementById("btnLogout");


btnLogout.addEventListener(
    "click",
    function () {

        const yakin =
            confirm(
                "Apakah kamu yakin ingin logout?"
            );


        if (!yakin) return;


        localStorage.removeItem(
            "adminLogin"
        );


        window.location.href =
            "../admin/login.html";

    }
);


/* =================================
   JALANKAN SAAT HALAMAN DIBUKA
================================= */
buatFilter();
tampilkanData();
tampilkanStatistik();