// AOS Init
// AOS init (si no lo tienes ya)
AOS.init({ duration: 900, once: true });

// GLightbox (modal para zoom)
const lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  loop: true
});

// Masonry: espera a que las imágenes hayan cargado
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({ duration: 900, once: true });

  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true
  });

  const grid = document.querySelector('#gallery');
  if (grid) {
    imagesLoaded(grid, function() {
      const msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 12
      });
      lightbox.on('open', () => msnry.layout());
    });
  }
});

// GLightbox Modal
/*const lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  loop: true
});*/

// Parallax Effect for Hero and About
window.addEventListener('scroll', function() {
  const hero = document.querySelector('.hero');
  const about = document.querySelector('.about-section');
  let offset = window.pageYOffset;
  if (hero) hero.style.backgroundPositionY = offset * 0.5 + 'px';
  if (about) about.style.backgroundPositionY = offset * 0.3 + 'px';
});
