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