const hamburger = document.getElementById("hamburger");
const navigasi = document.querySelector(".navigasi");
// DROPDOWN INFORMASI
const infoToggle = document.getElementById("infoTogle")
const infoDropdown = document.querySelector(".dropdown-info")
// DROPDOWN BERITA
const beritaToggle = document.getElementById("beritaTogle")
const beritaDropdown = document.querySelector(".dropdown-berita")

// SEARCH MENU
const searchOpen = document.getElementById("searchOpen");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");



// ==============[ NAVBAR ]==============
// ======================================
hamburger.addEventListener("click", function (event){
    event.stopPropagation();

    hamburger.classList.toggle("active");
    navigasi.classList.toggle("active");

    // Tutup Search
    searchBox.classList.remove("active")
});



// ==============[DROPDOWN]==============
// ======================================
// DROPDOWN INFORMASI
function toggleInfo() {
    infoDropdown.classList.toggle("info-open");
}

infoToggle.addEventListener("click", function (e) {
    e.preventDefault();
    toggleInfo();
});

// DROPDOWN BERITA
function toggleBerita() {
    beritaDropdown.classList.toggle("berita-open");
}

beritaToggle.addEventListener("click", function (e) {
    e.preventDefault();
    toggleBerita();
});



// ==============[ SEARCH ]==============
// ======================================
// BUKA SEARCH
searchOpen.addEventListener("click", function (event) {
    event.stopPropagation();
    searchBox.classList.toggle("active");

    // Tutup hamburger
    hamburger.classList.remove("active")
    navigasi.classList.remove("active")
});

// HAPUS ISI SEARCH
searchClear.addEventListener("click", function () {
    searchInput.value = "";
    searchInput.focus();
});




// Click luar elemen
document.addEventListener("click", function (event) {

    // Tutup search jika klik di luar
    if (
        !searchBox.contains(event.target) &&
        !searchOpen.contains(event.target)
    ) {
        searchBox.classList.remove("active");
    }


    // Tutup hamburger jika klik di luar
    if (
        !navigasi.contains(event.target) &&
        !hamburger.contains(event.target)
    ) {
        hamburger.classList.remove("active");
        navigasi.classList.remove("active");
    }

});











// ===================================================================
        // ================================================
        // =========={SLIDESHOW TENTANG PONDOK}============
        // ================================================
// ===================================================================

const tentangSlides = document.querySelectorAll(".tentang_slide");

let tentangIndex = 0;

function nextTentangSlide() {

    tentangSlides[tentangIndex].classList.remove("active");

    tentangIndex++;

    if (tentangIndex >= tentangSlides.length) {
        tentangIndex = 0;
    }

    tentangSlides[tentangIndex].classList.add("active");
}

if (tentangSlides.length > 1) {
    setInterval(nextTentangSlide, 5000);
}




// ================================================
// ==========={ NAVBAR TENTANG PONDOK }============
// ================================================
const tentangMenuToggle = document.getElementById("tentangMenuToggle");
const tentangMenu = document.getElementById("tentangMenu");

if (tentangMenuToggle && tentangMenu) {

    tentangMenuToggle.addEventListener("click", function () {

        tentangMenu.classList.toggle("active");

        tentangMenuToggle.classList.toggle("active");

    });

}