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

  // Auto-add data-title and data-description to glightbox links from overlay content
  // This must run BEFORE GLightbox initialization
  document.querySelectorAll('.glightbox').forEach(link => {
    const overlay = link.querySelector('.item-overlay');
    if (overlay) {
      const title = overlay.querySelector('h3')?.textContent?.trim() || '';
      const description = overlay.querySelector('p')?.textContent?.trim() || '';
      
      // Set data-title (required for GLightbox to show description)
      if (title && !link.getAttribute('data-title')) {
        if (description) {
          link.setAttribute('data-title', `${title} – ${description}`);
        } else {
          link.setAttribute('data-title', title);
        }
      }
      
      // Also set data-description if needed
      if (description && !link.getAttribute('data-description')) {
        link.setAttribute('data-description', description);
      }
    }
  });

  // GLightbox configuration with description support
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
    openEffect: 'fade',
    closeEffect: 'fade',
    descPosition: 'bottom',
    showDesc: true
  });

  // Masonry Gallery with Filters
  const grid = document.querySelector('#gallery');
  let msnry = null;
  
  if (grid) {
    imagesLoaded(grid, function() {
      msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 10,
        fitWidth: false,
        stagger: 30,
        transitionDuration: '0.4s'
      });

      // Filter functionality
      const filterButtons = document.querySelectorAll('.filters button');
      
      // Function to get filter class from data-filter attribute
      function getFilterClass(filterValue) {
        if (filterValue === '*') return '*';
        return filterValue.startsWith('.') ? filterValue.substring(1) : filterValue;
      }
      
      // Function to check if item matches filter
      function itemMatchesFilter(item, filterClass) {
        if (filterClass === '*') return true;
        const itemClasses = Array.from(item.classList);
        // Check all classes - look for the filter class (excluding 'grid-item' and AOS classes)
        return itemClasses.includes(filterClass);
      }

      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked button
          this.classList.add('active');
          
          // Get filter value
          const filterValue = this.getAttribute('data-filter');
          const filterClass = getFilterClass(filterValue);
          
          // Get fresh list of items every time
          const filterItems = Array.from(document.querySelectorAll('.grid-item'));
          
          // Process all items
          let visibleCount = 0;
          filterItems.forEach((item) => {
            const shouldShow = itemMatchesFilter(item, filterClass);
            
            if (shouldShow) {
              // Remove hidden class and show item
              item.classList.remove('hidden');
              item.style.display = '';
              item.style.visibility = 'visible';
              item.style.opacity = '0';
              item.style.transform = 'scale(0.9)';
              
              // Staggered fade in animation
              setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, visibleCount * 25);
              visibleCount++;
            } else {
              // Hide item with fade out
              item.style.opacity = '0';
              item.style.transform = 'scale(0.9)';
              
              setTimeout(() => {
                item.style.display = 'none';
                item.style.visibility = 'hidden';
                item.classList.add('hidden');
              }, 200);
            }
          });
          
          // Re-layout masonry with proper timing
          if (msnry) {
            // Initial layout
            setTimeout(() => {
              if (msnry) {
                msnry.layout();
              }
            }, 100);
            
            // Layout after fade out
            setTimeout(() => {
              if (msnry) {
                msnry.layout();
              }
            }, 300);
            
            // Layout during fade in
            setTimeout(() => {
              if (msnry) {
                msnry.layout();
              }
            }, 500);
            
            // Final layout after all animations
            setTimeout(() => {
              if (msnry) {
                // Force reflow
                void grid.offsetHeight;
                msnry.layout();
                // One more layout to be sure
                setTimeout(() => {
                  if (msnry) msnry.layout();
                }, 100);
              }
            }, 1000);
          }
        });
      });

      // Re-layout on lightbox open/close
      lightbox.on('open', () => {
        setTimeout(() => {
          if (msnry) msnry.layout();
        }, 100);
      });
      lightbox.on('close', () => {
        setTimeout(() => {
          if (msnry) msnry.layout();
        }, 100);
      });

      // Re-layout on window resize
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (msnry) msnry.layout();
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
