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

  /* ─── FAQ Chatbot Widget ─── */
  (function(){
    var toggleBtn = document.getElementById('al-chat-toggle');
    var closeBtn  = document.getElementById('al-chat-close');
    var chatBox   = document.getElementById('al-chat-box');
    var messages  = document.getElementById('al-chat-messages');
    var input     = document.getElementById('al-chat-input');
    var sendBtn   = document.getElementById('al-chat-send');

    if(!toggleBtn) return;

    var faqs = [
      {
        keys:['schedule','book','appointment','consult','consultation','meeting','free','30 min'],
        answer:'Ashvale Legal offers a free 30-minute consultation with Christopher. You can book online anytime — just click <strong>Schedule a Free Consultation</strong> below, or call <a href="tel:+18013697005">801.369.7005</a>.'
      },
      {
        keys:['price','cost','fee','flat','how much','charge','billing','rate'],
        answer:'Ashvale Legal uses flat-fee pricing, so you\'ll know the full cost before any work begins — no surprise bills. For a specific quote, contact Christopher directly.'
      },
      {
        keys:['estate planning','will','trust','power of attorney','healthcare directive','guardianship','beneficiary'],
        answer:'Christopher handles estate planning including wills, revocable living trusts, powers of attorney, healthcare directives, and guardianship designations — all tailored to your specific situation, not a generic template.'
      },
      {
        keys:['business law','entity','llc','corporation','contract','formation','dispute','business'],
        answer:'Ashvale Legal assists with entity formation, contract drafting and review, business dispute resolution, and ongoing business counsel for Utah entrepreneurs and small businesses.'
      },
      {
        keys:['criminal','defense','charge','arrest','dui','misdemeanor','felony'],
        answer:'Christopher also handles criminal defense matters. For details about your specific situation, please contact him directly — each case is unique and requires a personal review.'
      },
      {
        keys:['family law','divorce','custody','child','alimony','adoption','family'],
        answer:'Ashvale Legal provides family law services. For questions about your specific situation, please contact Christopher directly so he can properly review your case.'
      },
      {
        keys:['location','address','office','where','south jordan','salt lake','utah'],
        answer:'Ashvale Legal is based in South Jordan, Utah and serves Salt Lake County, Utah County, and surrounding areas including Herriman, Riverton, West Jordan, and Draper.'
      },
      {
        keys:['hours','open','available','when','time'],
        answer:'Office hours are Monday through Friday, 9:00 AM – 5:00 PM. You can also schedule online 24/7 using the booking link.'
      },
      {
        keys:['contact','email','phone','call','reach','christopher','chris'],
        answer:'You can reach Christopher at <a href="tel:+18013697005">801.369.7005</a> or by email at <a href="mailto:chris@ashvalelaw.com">chris@ashvalelaw.com</a>. Or schedule a free consultation using the button below.'
      },
      {
        keys:['veteran','army','military','service'],
        answer:'Christopher R. Topham is a U.S. Army veteran with nearly two decades of military service. He founded Ashvale Legal on the values of integrity, duty, and accountability.'
      },
      {
        keys:['hello','hi','hey','good morning','good afternoon','help','start'],
        answer:'Hello! I\'m the Ashvale Legal assistant. I can help with questions about services, scheduling, pricing, location, and contact information. How can I help you today?'
      }
    ];

    var legalKeys = ['advice','sue','lawsuit','legal issue','my case','charged with','my situation','should i','guilty','innocent','rights','liable','liable','attorney client','negligence','accident','injury'];

    var welcomeShown = false;

    function normalize(str){ return str.toLowerCase(); }

    function getResponse(text){
      var t = normalize(text);
      for(var i=0;i<legalKeys.length;i++){
        if(t.indexOf(legalKeys[i]) !== -1){
          return 'For legal questions specific to your situation, please contact Christopher directly — he\'ll be happy to review your case in a free 30-minute consultation. Call <a href="tel:+18013697005">801.369.7005</a> or click the button below.';
        }
      }
      for(var j=0;j<faqs.length;j++){
        for(var k=0;k<faqs[j].keys.length;k++){
          if(t.indexOf(faqs[j].keys[k]) !== -1){
            return faqs[j].answer;
          }
        }
      }
      return 'I\'m not sure I have the answer to that one. For the best help, please contact Christopher directly at <a href="tel:+18013697005">801.369.7005</a> or <a href="mailto:chris@ashvalelaw.com">chris@ashvalelaw.com</a>.';
    }

    function addMessage(text, role){
      var el = document.createElement('div');
      el.className = 'al-msg al-msg-' + role;
      el.innerHTML = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function showWelcome(){
      if(welcomeShown) return;
      welcomeShown = true;
      setTimeout(function(){
        addMessage('Hello! I\'m the Ashvale Legal assistant. I can answer basic questions about services, scheduling, pricing, and contact information. How can I help you today?', 'bot');
      }, 300);
    }

    function openChat(){
      chatBox.hidden = false;
      toggleBtn.setAttribute('aria-expanded','true');
      showWelcome();
      setTimeout(function(){ input && input.focus(); }, 100);
    }

    function closeChat(){
      chatBox.hidden = true;
      toggleBtn.setAttribute('aria-expanded','false');
    }

    toggleBtn.addEventListener('click', function(){
      chatBox.hidden ? openChat() : closeChat();
    });

    closeBtn.addEventListener('click', closeChat);

    function handleSend(){
      var val = input.value.trim();
      if(!val) return;
      addMessage(val, 'user');
      input.value = '';
      var response = getResponse(val);
      setTimeout(function(){ addMessage(response, 'bot'); }, 400);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){ handleSend(); }
    });
  })();

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
