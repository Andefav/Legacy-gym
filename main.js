/* ==========================================================================
   LEGACY ATHLETICS - JAVASCRIPT CONTROLLERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initScrollHeader();
  initCenteredNavHighlight();
  initVideoControls();
  initEquipmentFilter();
  initRoutineTabs();
  initPricingToggle();
  initRegistrationSync();
  initConfirmationModal();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initScrollHeader() {
  const topHeader = document.querySelector('.top-header');
  const heroSection = document.querySelector('.hero-section');
  
  if (!topHeader || !heroSection) return;

  const handleScroll = () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    // When hero is scrolled out of view, activate sticky header styling and links
    if (heroBottom <= 100) {
      topHeader.classList.add('scrolled');
    } else {
      topHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. CENTRED HERO NAV & ACTIVE SECTION HIGHLIGHT
   -------------------------------------------------------------------------- */
function initCenteredNavHighlight() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const heroNavLinks = document.querySelectorAll('.hero-nav a');
  const stickyNavLinks = document.querySelectorAll('.sticky-nav-links a');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update both hero nav & sticky nav
        updateActiveLinks(heroNavLinks, id);
        updateActiveLinks(stickyNavLinks, id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  function updateActiveLinks(links, currentId) {
    links.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. BACKGROUND VIDEO ACCESSIBILITY & CONTROLS
   -------------------------------------------------------------------------- */
function initVideoControls() {
  const video = document.getElementById('bgVideo');
  const controlBtn = document.getElementById('videoToggleBtn');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');

  if (!video || !controlBtn) return;

  // Attempt auto-play with mute
  video.play().catch(() => {
    // Autoplay policy fallback: show play icon
    if (iconPlay && iconPause) {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    }
  });

  controlBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      if (iconPlay && iconPause) {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      }
      controlBtn.setAttribute('aria-label', 'Pause background video');
      controlBtn.title = 'Pause video';
    } else {
      video.pause();
      if (iconPlay && iconPause) {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
      controlBtn.setAttribute('aria-label', 'Play background video');
      controlBtn.title = 'Play video';
    }
  });
}

/* --------------------------------------------------------------------------
   4. EQUIPMENT SHOWCASE FILTERING
   -------------------------------------------------------------------------- */
function initEquipmentFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const equipmentCards = document.querySelectorAll('.equipment-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      equipmentCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. BEGINNER ROUTINES TAB SWITCHER
   -------------------------------------------------------------------------- */
function initRoutineTabs() {
  const tabBtns = document.querySelectorAll('.routine-tab-btn');
  const panes = document.querySelectorAll('.routine-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(btn.getAttribute('data-target'));
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. MEMBERSHIP BILLING TOGGLE (Starter, Pro, Elite)
   -------------------------------------------------------------------------- */
const pricingData = {
  monthly: {
    starter: { price: 49, cycle: '/ month', name: 'Starter Plan' },
    pro: { price: 89, cycle: '/ month', name: 'Pro Plan (Most Popular)' },
    elite: { price: 149, cycle: '/ month', name: 'Elite Plan' }
  },
  annual: {
    starter: { price: 39, cycle: '/ month (billed annually)', name: 'Starter Plan' },
    pro: { price: 69, cycle: '/ month (billed annually)', name: 'Pro Plan (Most Popular)' },
    elite: { price: 119, cycle: '/ month (billed annually)', name: 'Elite Plan' }
  }
};

const tierPerks = {
  starter: {
    name: 'Starter Plan',
    highlight: '✓ Full Arena + 24/7 Keyless Entry + App Access',
    badge: 'Starter Pass',
    perks: [
      '24/7 Biometric Keyless Entry',
      'Full Free Weights & Cardio Arena',
      'Locker Rooms & Rain Showers',
      'Legacy Companion Training App'
    ]
  },
  pro: {
    name: 'Pro Plan (Most Popular)',
    highlight: '✓ Full Arena + Recovery Spa + Daily Guest Pass',
    badge: 'Pro Pass (Most Popular)',
    perks: [
      'Everything in Starter Included',
      'Infrared Sauna & Recovery Lounge',
      '1 Free Daily Guest Pass',
      'Monthly InBody 770 Composition Scan',
      'Priority Access to Master Clinics'
    ]
  },
  elite: {
    name: 'Elite Plan (Ultimate)',
    highlight: '✓ 2x Personal Coaching + Cryo Lounge + VIP Locker',
    badge: 'Elite VIP Pass',
    perks: [
      'Everything in Pro Included',
      '2x Monthly 1-on-1 Master Coach Sessions',
      'Unlimited Cold Plunge & Cryo Lounge',
      'Dedicated Locker & Daily Towel Laundry',
      'Personalized Nutrition & Macro Programming'
    ]
  }
};

let currentBilling = 'monthly';

function initPricingToggle() {
  const toggleCheckbox = document.getElementById('billingSwitch');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelAnnual = document.getElementById('labelAnnual');

  if (!toggleCheckbox) return;

  toggleCheckbox.addEventListener('change', () => {
    currentBilling = toggleCheckbox.checked ? 'annual' : 'monthly';

    if (currentBilling === 'annual') {
      labelAnnual.classList.add('active');
      labelMonthly.classList.remove('active');
    } else {
      labelMonthly.classList.add('active');
      labelAnnual.classList.remove('active');
    }

    updatePricingDisplay();
    syncSummaryPrices();
    updateModalPlanPreview();
  });
}

function updatePricingDisplay() {
  const data = pricingData[currentBilling];
  
  const starterAmt = document.getElementById('priceStarter');
  const starterCycle = document.getElementById('cycleStarter');
  const proAmt = document.getElementById('pricePro');
  const proCycle = document.getElementById('cyclePro');
  const eliteAmt = document.getElementById('priceElite');
  const eliteCycle = document.getElementById('cycleElite');

  if (starterAmt) starterAmt.textContent = data.starter.price;
  if (starterCycle) starterCycle.textContent = data.starter.cycle;
  if (proAmt) proAmt.textContent = data.pro.price;
  if (proCycle) proCycle.textContent = data.pro.cycle;
  if (eliteAmt) eliteAmt.textContent = data.elite.price;
  if (eliteCycle) eliteCycle.textContent = data.elite.cycle;
}

/* --------------------------------------------------------------------------
   7. IN-PAGE REGISTRATION FORM SYNC & DYNAMIC SUMMARY
   -------------------------------------------------------------------------- */
function initRegistrationSync() {
  const planSelect = document.getElementById('planSelect');

  if (planSelect) {
    planSelect.addEventListener('change', updateOrderSummary);
  }

  // Preload default summary
  updateOrderSummary();
}

function updateOrderSummary() {
  const planSelect = document.getElementById('planSelect');
  if (!planSelect) return;

  const planVal = planSelect.value || 'pro';
  const summaryPlanBadge = document.getElementById('summaryPlanBadge');
  const summaryPriceLine = document.getElementById('summaryPriceLine');
  const summaryTotal = document.getElementById('summaryTotal');
  const summaryPerksList = document.getElementById('summaryPerksList');

  const planInfo = tierPerks[planVal] || tierPerks.pro;
  const planPrice = pricingData[currentBilling][planVal]?.price || 89;

  if (summaryPlanBadge) {
    summaryPlanBadge.textContent = planInfo.badge;
  }

  if (summaryPriceLine) {
    summaryPriceLine.textContent = `$${planPrice}/mo`;
  }

  if (summaryTotal) {
    summaryTotal.textContent = `$${planPrice}/mo`;
  }

  if (summaryPerksList && planInfo.perks) {
    summaryPerksList.innerHTML = planInfo.perks.map(perk => `
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${perk}</span>
      </li>
    `).join('');
  }
}

function syncSummaryPrices() {
  updateOrderSummary();
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE REGISTRATION MODAL (Opens On Any Sign-Up Click)
   -------------------------------------------------------------------------- */
function initConfirmationModal() {
  const modal = document.getElementById('registrationModal');
  const modalFormView = document.getElementById('modalFormView');
  const modalSuccessView = document.getElementById('modalSuccessView');
  const modalRegForm = document.getElementById('modalRegistrationForm');
  const modalPlanSelect = document.getElementById('modalPlanSelect');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');

  // Trigger buttons that should open the Registration Modal:
  const signUpButtons = document.querySelectorAll(
    '.btn-select-tier, .btn-header-join, a[href="#register"].btn-primary'
  );

  if (!modal) return;

  // Open modal when any membership button is clicked
  signUpButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const requestedTier = btn.getAttribute('data-tier') || 'pro';
      
      // Pre-select plan in modal
      if (modalPlanSelect) {
        modalPlanSelect.value = requestedTier;
      }
      
      updateModalPlanPreview();

      // Show form view, hide success view
      if (modalFormView) modalFormView.style.display = 'block';
      if (modalSuccessView) {
        modalSuccessView.classList.remove('active');
        modalSuccessView.style.display = 'none';
      }

      // Open modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scroll

      // Focus first input
      const firstInput = document.getElementById('modalFullName');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    });
  });

  // Modal Plan selection dropdown changes
  if (modalPlanSelect) {
    modalPlanSelect.addEventListener('change', updateModalPlanPreview);
  }

  // Modal Form Submission & Submission Feedback
  if (modalRegForm) {
    modalRegForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('modalFullName');
      const emailInput = document.getElementById('modalEmail');
      const phoneInput = document.getElementById('modalPhone');
      const planVal = modalPlanSelect ? modalPlanSelect.value : 'pro';

      const name = nameInput ? nameInput.value.trim() : 'Athlete';
      const email = emailInput ? emailInput.value.trim() : 'athlete@legacyforge.fit';
      const tierInfo = tierPerks[planVal] || tierPerks.pro;

      // Populate Submission Feedback
      const feedbackName = document.getElementById('feedbackMemberName');
      const feedbackTier = document.getElementById('feedbackMemberTier');
      const feedbackEmail = document.getElementById('feedbackMemberEmail');
      const feedbackId = document.getElementById('feedbackMemberId');

      if (feedbackName) feedbackName.textContent = name;
      if (feedbackTier) feedbackTier.textContent = tierInfo.name;
      if (feedbackEmail) feedbackEmail.textContent = email;
      if (feedbackId) {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        feedbackId.textContent = `#LF-${randomNum}`;
      }

      // Hide Form View, Show Success State
      if (modalFormView) modalFormView.style.display = 'none';
      if (modalSuccessView) {
        modalSuccessView.style.display = 'block';
        modalSuccessView.classList.add('active');
      }
    });
  }

  // Close handlers
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (modalRegForm) modalRegForm.reset();
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);

  // Close on outside overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Also support the in-page form submission if user submits there
  const inPageForm = document.getElementById('registrationForm');
  if (inPageForm) {
    inPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inPageName = document.getElementById('fullName');
      const inPageEmail = document.getElementById('email');
      const inPagePlan = document.getElementById('planSelect');

      if (modalPlanSelect && inPagePlan) modalPlanSelect.value = inPagePlan.value;
      if (document.getElementById('modalFullName') && inPageName) {
        document.getElementById('modalFullName').value = inPageName.value;
      }
      if (document.getElementById('modalEmail') && inPageEmail) {
        document.getElementById('modalEmail').value = inPageEmail.value;
      }

      // Trigger modal submission feedback
      if (modalRegForm) {
        const submitEvent = new Event('submit', { cancelable: true });
        modalRegForm.dispatchEvent(submitEvent);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

function updateModalPlanPreview() {
  const modalPlanSelect = document.getElementById('modalPlanSelect');
  if (!modalPlanSelect) return;

  const planVal = modalPlanSelect.value || 'pro';
  const planInfo = tierPerks[planVal] || tierPerks.pro;
  const planPrice = pricingData[currentBilling][planVal]?.price || 89;

  const previewName = document.getElementById('modalPreviewName');
  const previewPerk = document.getElementById('modalPreviewPerk');
  const previewPrice = document.getElementById('modalPreviewPrice');

  if (previewName) previewName.textContent = planInfo.name;
  if (previewPerk) previewPerk.textContent = planInfo.highlight;
  if (previewPrice) previewPrice.innerHTML = `$${planPrice}<span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-body);">/mo</span>`;
}
