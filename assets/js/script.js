document.addEventListener('DOMContentLoaded', function() {
  // Animaciones AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
  });

  // Navbar scroll effect
  const navbar = document.getElementById('mainNavbar');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  function activateNavLink() {
    let current = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}` || 
          (current === 'hero' && link.getAttribute('href') === '#')) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', activateNavLink);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // GLightbox configuration
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
    openEffect: 'fade',
    closeEffect: 'fade'
  });

  // Masonry Gallery
  const grid = document.querySelector('#gallery');
  if (grid) {
    imagesLoaded(grid, function() {
      const msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 10,
        fitWidth: false,
        stagger: 30,
        transitionDuration: '0.4s'
      });

      // Re-layout on lightbox open/close
      lightbox.on('open', () => {
        setTimeout(() => msnry.layout(), 100);
      });
      lightbox.on('close', () => {
        setTimeout(() => msnry.layout(), 100);
      });

      // Re-layout on window resize
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          msnry.layout();
        }, 250);
      });
    });
  }

  // Add loading animation to images
  const portfolioImages = document.querySelectorAll('.grid-item img');
  portfolioImages.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
    }
  });

  // Close mobile menu when clicking on a link
  const navCollapse = document.querySelector('.navbar-collapse');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });
});
