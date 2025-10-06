document.addEventListener('DOMContentLoaded', function() {
  // Animaciones
  AOS.init({ duration: 900, once: true });

  // GLightbox
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true
  });

  // Masonry
  const grid = document.querySelector('#gallery');
  if (grid) {
    imagesLoaded(grid, function() {
      const msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 8, // menos espacio entre columnas
        fitWidth: false // evita scroll horizontal
      });

      lightbox.on('open', () => msnry.layout());
      window.addEventListener('resize', () => msnry.layout());
    });
  }
});
