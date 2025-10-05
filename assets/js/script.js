/* script.js - Studio M&M */
/* - Crea la galería masonry, lightbox, AOS
   - Soporta cambio de idioma (ES/EN/FR) dinámico
   - Configura botón WhatsApp con mensaje
*/

/* ----------------------------
   Traducciones (puedes ajustar)
   ---------------------------- */
const TRANSLATIONS = {
  es: {
    hero_title: "Capturamos tu luz, tu historia, tu arte.",
    hero_sub: "Fotografía y arte desde Canadá y Chile.",
    explore: "Explora la galería",
    about_us: "Sobre nosotros",
    gallery_title: "Galería",
    gallery_sub: "Paisajes · Arte · Eventos",
    about_title: "Sobre Studio M&M",
    about_text: "Studio M&M nació de la colaboración entre dos miradas que se complementan: Medchuk, artista ucraniano-chilena, combina la fuerza del color con la sensibilidad del óleo. Monroy es un fotógrafo apasionado por los paisajes y la naturaleza, que captura momentos efímeros con una estética moderna.",
    contact_title: "Contacto",
    contact_sub: "Haz clic en el botón de WhatsApp para enviarnos un mensaje directo.",
    whatsapp: "Enviar WhatsApp",
    book: "Contáctanos"
  },
  en: {
    hero_title: "We capture your light, your story, your art.",
    hero_sub: "Photography and visual art from Canada and Chile.",
    explore: "Explore the gallery",
    about_us: "About us",
    gallery_title: "Gallery",
    gallery_sub: "Landscapes · Art · Events",
    about_title: "About Studio M&M",
    about_text: "Studio M&M grew from the collaboration of two complementary visions: Medchuk, a Ukrainian–Chilean artist, merges color with oil sensibility. Monroy is a photographer passionate about landscapes and nature, capturing fleeting moments with a modern aesthetic.",
    contact_title: "Contact",
    contact_sub: "Click the WhatsApp button to send us a direct message.",
    whatsapp: "Send WhatsApp",
    book: "Get in touch"
  },
  fr: {
    hero_title: "Nous capturons votre lumière, votre histoire, votre art.",
    hero_sub: "Photographie et art visuel depuis le Canada et le Chili.",
    explore: "Explorer la galerie",
    about_us: "À propos",
    gallery_title: "Galerie",
    gallery_sub: "Paysages · Art · Événements",
    about_title: "À propos de Studio M&M",
    about_text: "Studio M&M est né de la collaboration de deux visions complémentaires : Medchuk, artiste ukraino-chilienne, allie la force de la couleur à la sensibilité de l'huile. Monroy est un photographe passionné par les paysages et la nature, capturant des instants fugitifs avec une esthétique moderne.",
    contact_title: "Contact",
    contact_sub: "Cliquez sur le bouton WhatsApp pour nous envoyer un message direct.",
    whatsapp: "Envoyer WhatsApp",
    book: "Contactez-nous"
  }
};

/* ----------------------------
   Datos del portafolio
   Añade/renombra imágenes en assets/img/portfolio/
   ---------------------------- */
const portfolioItems = [
  { src: "assets/img/portfolio/photo1.jpg", title: "Paisaje 1", category: "paisaje" },
  { src: "assets/img/portfolio/photo2.jpg", title: "Arte - Óleo", category: "arte" },
  { src: "assets/img/portfolio/photo3.jpg", title: "Evento 1", category: "evento" },
  { src: "assets/img/portfolio/photo4.jpg", title: "Paisaje 2", category: "paisaje" },
  { src: "assets/img/portfolio/photo5.jpg", title: "Arte - Serie", category: "arte" },
  { src: "assets/img/portfolio/photo6.jpg", title: "Evento 2", category: "evento" }
];

/* ----------------------------
   Inicialización: DOMContentLoaded
   ---------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Año en footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Rellenar galería
  renderGallery();

  // Inicializar AOS
  AOS.init({ duration: 700, once: true });

  // Inicializar lightbox (GLightbox)
  const lightbox = GLightbox({ selector: '.glightbox' });

  // Inicializar Masonry tras cargar imágenes
  const grid = document.querySelector('#masonry-grid');
  imagesLoaded(grid, function () {
    new Masonry(grid, {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true,
      gutter: 16
    });
  });

  // Filtros
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      filterGallery(filter);
    });
  });

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.addEventListener('click', () => {
      const lang = b.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Auto-detect language (only first two letters)
  const userLang = navigator.language ? navigator.language.slice(0,2) : 'es';
  setLanguage(['es','en','fr'].includes(userLang) ? userLang : 'es');

  // WhatsApp button (number placeholder: cambia por tu numero)
  const phone = "1234567890"; // <- REEMPLAZA con número internacional, ej: 15551234567 (sin +)
  const defaultMsg = encodeURIComponent("¡Hola! Estoy interesado en sesiones o colaboración con Studio M&M.");
  const waHref = `https://wa.me/${phone}?text=${defaultMsg}`;
  document.getElementById('whatsapp-btn').href = waHref;
  document.getElementById('whatsapp-float').href = waHref;

});

/* ----------------------------
   Render gallery function
   ---------------------------- */
function renderGallery() {
  const container = document.getElementById('masonry-grid');
  container.innerHTML = '';

  // grid-sizer for masonry (one invisible sizing element)
  const sizer = document.createElement('div');
  sizer.className = 'grid-sizer col-12 col-sm-6 col-md-4';
  container.appendChild(sizer);

  // create each item
  portfolioItems.forEach((item, idx) => {
    const col = document.createElement('div');
    col.className = `grid-item col-12 col-sm-6 col-md-4`;

    // randomize heights slightly for masonry feel (you can control via crop)
    const h = (idx % 3 === 0) ? 'tall' : (idx % 2 === 0 ? 'medium' : 'short');

    col.innerHTML = `
      <div class="portfolio-item" data-category="${item.category}" data-aos="fade-up" data-aos-delay="${(idx%5)*60}">
        <a href="${item.src}" class="glightbox" data-gallery="studio">
          <img src="${item.src}" alt="${item.title}">
          <div class="portfolio-meta">
            <strong>${item.title}</strong>
          </div>
        </a>
      </div>
    `;

    container.appendChild(col);
  });
}

/* ----------------------------
   Filter gallery
   ---------------------------- */
function filterGallery(filter) {
  document.querySelectorAll('#masonry-grid .grid-item').forEach(el => {
    if (filter === '*' || el.querySelector('.portfolio-item').getAttribute('data-category') === filter) {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  });

  // re-layout masonry after display changes
  const grid = document.querySelector('#masonry-grid');
  imagesLoaded(grid, function () {
    new Masonry(grid, {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true,
      gutter: 16
    });
  });
}

/* ----------------------------
   Language switcher: setLanguage
   - Reemplaza texto en elementos con data-i18n
   ---------------------------- */
function setLanguage(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.es;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  // Update "about" text (larger paragraph)
  const about = document.querySelector('[data-i18n="about_text"]');
  if (about) about.textContent = dict['about_text'] || '';

  // Ajustar active en botones de idioma
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });
}
