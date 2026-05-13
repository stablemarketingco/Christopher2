(function(){
  'use strict';

  var header = document.getElementById('site-header');
  var burgerBtn = document.getElementById('burger-btn');

  /* Sticky header shadow on scroll */
  function onScroll(){
    if(window.scrollY > 20){
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});

  /* Mobile nav overlay */
  var overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  overlay.setAttribute('aria-label','Mobile navigation');

  var navLinks = [
    {label:'Home', href:'index.html'},
    {label:'Practice Areas', children:[
      {label:'Estate Planning', href:'estate-planning.html'},
      {label:'Business Law', href:'business-law.html'},
      {label:'Criminal Defense', href:'criminal-defense.html'},
      {label:'Family Law', href:'family-law.html'}
    ]},
    {label:'About', href:'index.html#about'},
    {label:'Contact', href:'contact.html'}
  ];

  navLinks.forEach(function(item){
    if(item.children){
      var btn = document.createElement('button');
      btn.textContent = item.label;
      overlay.appendChild(btn);
      item.children.forEach(function(child){
        var a = document.createElement('a');
        a.href = child.href;
        a.textContent = child.label;
        a.className = 'mobile-sub';
        overlay.appendChild(a);
      });
    } else {
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      overlay.appendChild(a);
    }
  });

  var ctaLink = document.createElement('a');
  ctaLink.href = 'https://ashvalelaw.cliogrow.com/book/3494140267d6b8330a02c39e8ebb3258';
  ctaLink.target = '_blank';
  ctaLink.rel = 'noopener';
  ctaLink.textContent = 'Schedule Consultation';
  ctaLink.className = 'mobile-cta';
  overlay.appendChild(ctaLink);

  document.body.appendChild(overlay);

  function openMenu(){
    overlay.classList.add('open');
    burgerBtn.classList.add('open');
    burgerBtn.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    overlay.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }

  if(burgerBtn){
    burgerBtn.addEventListener('click', function(){
      if(overlay.classList.contains('open')){ closeMenu(); } else { openMenu(); }
    });
  }

  overlay.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  /* Dropdown keyboard accessibility */
  var dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(function(toggle){
    toggle.addEventListener('click', function(){
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded ? 'true' : 'false');
    });
    toggle.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){ toggle.setAttribute('aria-expanded','false'); }
    });
  });

  /* FAQ accordion */
  var faqBtns = document.querySelectorAll('.faq-question');
  faqBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var answer = btn.nextElementSibling;
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      faqBtns.forEach(function(b){
        b.setAttribute('aria-expanded','false');
        if(b.nextElementSibling) b.nextElementSibling.classList.remove('open');
      });
      if(!expanded){
        btn.setAttribute('aria-expanded','true');
        answer.classList.add('open');
      }
    });
  });

  /* Lazy load fallback for older browsers */
  if('loading' in HTMLImageElement.prototype === false){
    var lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var img = entry.target;
            img.src = img.dataset.src || img.src;
            io.unobserve(img);
          }
        });
      });
      lazyImgs.forEach(function(img){ io.observe(img); });
    }
  }
})();
