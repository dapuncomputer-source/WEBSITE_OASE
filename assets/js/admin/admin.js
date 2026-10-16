
/* =================================
   CEK LOGIN ADMIN
================================= */

const adminLogin = localStorage.getItem("adminLogin");

if (adminLogin !== "true") {
    window.location.href = "login.html";
}



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