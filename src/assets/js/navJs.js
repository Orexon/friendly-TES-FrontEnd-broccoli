function openEvent() {
  const menuBar = document.querySelector(".menuBar");
  const navLinks = document.querySelector(".navLinks");
  const links = document.querySelectorAll("nav-links li");

  menuBar.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    links.forEach((link) => {
      link.classList.toggle("fade");
    });
  });
}
