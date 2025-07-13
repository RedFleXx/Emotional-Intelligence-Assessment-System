const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 
    });

    const target = document.querySelector('.why-parent');
    if (target) {
        observer.observe(target);
    }

   //SHOW/HIDE BTOP-BTN
window.addEventListener("scroll", () => {
  const backToTopBtn = document.getElementById("backToTop");
  if (window.scrollY > 400) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".link-container");

let loginLinksAdded = false;

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("show");

  // If screen is small and login links aren't added yet
  if (window.innerWidth <= 1200 && !loginLinksAdded) {
    const loginLink = document.createElement("a");
    loginLink.href = "./login.html";
    loginLink.textContent = "Login";
    loginLink.className = "link-btn";

    navLinks.appendChild(loginLink);
   
    loginLinksAdded = true;
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}


  