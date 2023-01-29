let mobileMenu = document.querySelector(".mobile-menu")
let mobileMenuLinks = document.querySelectorAll(".mobile-menu li a")

function openMobileMenu () {
    mobileMenu.classList.add("active")
}

function closeMobileMenu () {
    mobileMenu.classList.remove("active")
}

mobileMenuLinks.forEach(function(link) {
    link.addEventListener("click", closeMobileMenu)
})


let spectaSection = document.getElementById("sec3")
let body = document.querySelector("body")

function goToSpecta() {
    console.log("go to specta")
    let spectaY = spectaSection.getBoundingClientRect().y
    window.scrollTo(0, spectaY, { duration: 10000 })
}

// PRODUCT GALLERY

let mobileX = window.matchMedia("(max-width: 768px)")
let galleryImg = Array.from(document.querySelector(".gallery").children)
let imageW = document.querySelector(".gallery .span-2").getBoundingClientRect().width
let gallery = document.querySelector(".gallery")
let galleryIndex = 0

if (mobileX.matches) {
    scrollGallery()
}

function scrollGallery() {
    setInterval(function(){
        galleryIndex ++
        if (galleryIndex == galleryImg.length) {galleryIndex = 0}
        gallery.scrollTo(imageW * galleryIndex, 0)
    }, 5000)
}

function draw() {
    for(let i = 0; i <galleryImg.length; i++) {
        let imgX = galleryImg[i].getBoundingClientRect().x
        if ( imgX > 0 && imgX < gallery.getBoundingClientRect().width ){
            galleryIndex = i
        }
    }
}