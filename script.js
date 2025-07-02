const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // remove if you want it to animate only once
            }
        });
    }, {
        threshold: 0.1 // triggers when 10% is visible
    });

    const target = document.querySelector('.why-parent');
    if (target) {
        observer.observe(target);
    }