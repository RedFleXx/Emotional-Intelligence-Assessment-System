const display = document.querySelector('.auto-slide-display');
  const grid = document.querySelector('.auto-slide-grid');


  const slides = [...grid.children];
  slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    grid.appendChild(clone);
  });

//AUTO SCROLL
  let scrollSpeed = 1;
  let isPaused = false;

  function autoScroll() {
    if (!isPaused) {
      display.scrollLeft += scrollSpeed;
      if (display.scrollLeft >= grid.scrollWidth / 2) {
        display.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  autoScroll();

 //HOVER PAUSE
  display.addEventListener('mouseenter', () => isPaused = true);
  display.addEventListener('mouseleave', () => isPaused = false);

  //DESK DRAG
  let isDragging = false;
  let startX;
  let scrollStart;

  display.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - display.offsetLeft;
    scrollStart = display.scrollLeft;
    display.classList.add('dragging');
    isPaused = true;
  });

  display.addEventListener('mouseup', () => {
    isDragging = false;
    display.classList.remove('dragging');
    isPaused = false;
  });

  display.addEventListener('mouseleave', () => {
    isDragging = false;
    display.classList.remove('dragging');
    isPaused = false;
  });

  display.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - display.offsetLeft;
    const walk = (x - startX) * 1.5;
    display.scrollLeft = scrollStart - walk;
  });

 //MOB SWIPE
  let touchStartX = 0;
  let touchScrollStart = 0;

  display.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollStart = display.scrollLeft;
    isPaused = true;
  }, { passive: true });

  display.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].pageX;
    const walk = (touchX - touchStartX) * 1.5;
    display.scrollLeft = touchScrollStart - walk;
  }, { passive: true });

  display.addEventListener('touchend', () => {
    isPaused = false;
  });