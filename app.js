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