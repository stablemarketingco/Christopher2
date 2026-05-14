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

  /* Mobile nav overlay — use inline HTML already in page */
  var overlay = document.getElementById('mobile-nav-overlay');

  if(overlay){
    function openMenu(){
      overlay.classList.add('open');
      if(burgerBtn){ burgerBtn.classList.add('open'); burgerBtn.setAttribute('aria-expanded','true'); }
      document.body.style.overflow = 'hidden';
    }
    function closeMenu(){
      overlay.classList.remove('open');
      if(burgerBtn){ burgerBtn.classList.remove('open'); burgerBtn.setAttribute('aria-expanded','false'); }
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
  }

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
        keys:['hello','hi','hey','good morning','good afternoon','howdy'],
        answer:'Hello! I can answer basic questions about Ashvale Legal\'s services, pricing, scheduling, and contact information. What can I help you with today?'
      },
      {
        keys:['what services','what do you offer','what areas','what type of legal','what kind of law','practice areas','what can you help','what do you handle','what does ashvale'],
        answer:'Ashvale Legal handles four main practice areas: <strong>Estate Planning</strong> (wills, trusts, powers of attorney, healthcare directives), <strong>Business Law</strong> (entity formation, contracts, business disputes), <strong>Criminal Defense</strong> (DUI, drug charges, felonies, expungements), and <strong>Family Law</strong> (divorce, custody, prenuptial agreements). I can\'t provide legal advice for your specific situation, but Christopher can — schedule a free consultation below.'
      },
      {
        keys:['estate planning','will','trust','revocable','irrevocable','power of attorney','healthcare directive','guardianship','beneficiary','probate','inheritance'],
        answer:'Ashvale Legal handles a full range of estate planning services including wills, revocable living trusts, powers of attorney, healthcare directives, and guardianship designations — all drafted for your specific situation, not a generic template. For guidance on what you need, schedule a free consultation with Christopher.'
      },
      {
        keys:['business law','business formation','entity formation','llc','corporation','sole proprietor','partnership','contract','contracts','business dispute','entrepreneur','small business','operating agreement'],
        answer:'Ashvale Legal assists Utah businesses and entrepreneurs with entity formation (LLCs, corporations), contract drafting and review, business dispute resolution, and ongoing business counsel. For advice about your specific situation, schedule a free consultation.'
      },
      {
        keys:['criminal defense','criminal','felony','felonies','misdemeanor','expungement','expunge','record','weapons','assault','domestic violence','theft','drug','drugs'],
        answer:'Yes — Ashvale Legal handles criminal defense matters including DUI and impaired driving, drug charges, assault and domestic violence, theft and property crimes, weapons offenses, misdemeanors, felony defense, and expungements. Christopher is a former prosecutor and ARIDE-certified, bringing insider knowledge to every defense. For advice about your specific charge, please schedule a free consultation.'
      },
      {
        keys:['dui','dwi','drunk driving','impaired','impairment','sobriety','breathalyzer','field sobriety','aride'],
        answer:'Yes — Ashvale Legal handles DUI and impaired driving defense. Christopher is ARIDE-certified, which means he evaluates the evidence at the same technical level as the officer who conducted your roadside assessment — challenging both the legal process and the science behind the charge. For advice about your specific situation, schedule a free consultation.'
      },
      {
        keys:['family law','divorce','custody','child custody','parent time','asset division','property settlement','prenuptial','postnuptial','prenup','alimony','modification','lgbtq'],
        answer:'Yes — Ashvale Legal handles family law matters including prenuptial and postnuptial agreements, divorce, asset division, child custody and parent time, and custody modifications. Ashvale Legal is also a proud LGBTQ+ ally with experience serving all family structures. For guidance on your specific situation, please schedule a free consultation.'
      },
      {
        keys:['price','cost','fee','flat fee','flat-fee','how much','billing','rate','hourly','transparent','pricing','what does it cost','afford'],
        answer:'Ashvale Legal uses flat-fee pricing — you know exactly what representation costs before any work begins. No hourly billing, no surprise invoices. The exact fee depends on the type and complexity of your matter. The best next step is a free 30-minute consultation where Christopher will explain your options and provide an upfront quote.'
      },
      {
        keys:['schedule','book','appointment','consultation','consult','meeting','30 min','30-minute','free consult','book online'],
        answer:'Ashvale Legal offers a free 30-minute consultation with Christopher — available by phone, video, or in person. Click <strong>Schedule a Free Consultation</strong> below to book online anytime, or call <a href="tel:+18013697005">801.369.7005</a> during business hours.'
      },
      {
        keys:['phone','video','in person','virtual','zoom','remote','online consult','how to meet'],
        answer:'Consultations are available by phone, video, or in person — whichever works best for you. Use the button below to schedule, or call <a href="tel:+18013697005">801.369.7005</a>.'
      },
      {
        keys:['contact','email','phone','call','reach','christopher','chris','attorney','topham'],
        answer:'You can reach Christopher directly at <a href="tel:+18013697005">801.369.7005</a> or by email at <a href="mailto:chris@ashvalelaw.com">chris@ashvalelaw.com</a>. Office hours are Monday–Friday, 9 AM–5 PM. You can also schedule a free consultation online using the button below.'
      },
      {
        keys:['location','address','office','where','south jordan','salt lake','utah county','herriman','riverton','draper'],
        answer:'Ashvale Legal is based in South Jordan, Utah and serves Salt Lake County, Utah County, and surrounding communities including Herriman, Riverton, West Jordan, and Draper.'
      },
      {
        keys:['hours','open','available','when','office hours','business hours'],
        answer:'Office hours are Monday through Friday, 9:00 AM – 5:00 PM. You can also schedule a consultation online 24/7 using the booking link below.'
      },
      {
        keys:['veteran','army','military','service','patriot','vso'],
        answer:'Christopher R. Topham is a U.S. Army veteran with nearly two decades of military service. Ashvale Legal is a veteran-owned firm built on the values of integrity, discipline, and accountability — the same standard applied to every client.'
      },
      {
        keys:['legal advice','can you advise','give me advice','what should i do','am i liable','do i have a case'],
        answer:'I can answer general questions about Ashvale Legal\'s services, but I\'m not able to provide legal advice for your specific situation. For case-specific legal guidance, please schedule a free consultation with Christopher — he\'ll review your situation personally and give you an honest assessment of your options.'
      }
    ];

    var legalKeys = ['what should i do with my case','is my case strong','will i win','am i guilty','can they prove','what are my chances'];

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

    var chips = [
      {label:'Schedule a consultation', query:'schedule a consultation'},
      {label:'What\'s your pricing?',   query:'what is the pricing'},
      {label:'Where are you located?',  query:'where are you located'},
      {label:'What services do you offer?', query:'what services do you offer'},
      {label:'How do I contact Christopher?', query:'how do I contact christopher'}
    ];

    var chipBar = document.getElementById('al-chat-chips');

    function hideChips(){
      if(chipBar){ chipBar.style.display = 'none'; }
    }

    function showWelcome(){
      if(welcomeShown) return;
      welcomeShown = true;
      setTimeout(function(){
        addMessage('Hello! I\'m the Ashvale Legal assistant. I can answer basic questions about services, scheduling, pricing, and contact information. How can I help you today?', 'bot');
        if(chipBar){ chipBar.style.display = 'flex'; }
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

    if(chipBar){
      chips.forEach(function(chip){
        var btn = document.createElement('button');
        btn.className = 'al-chip';
        btn.textContent = chip.label;
        btn.addEventListener('click', function(){
          hideChips();
          addMessage(chip.label, 'user');
          var response = getResponse(chip.query);
          setTimeout(function(){ addMessage(response, 'bot'); }, 400);
        });
        chipBar.appendChild(btn);
      });
    }

    function handleSend(){
      var val = input.value.trim();
      if(!val) return;
      hideChips();
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
