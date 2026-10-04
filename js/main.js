/**
 * HAMMAD.AI - Application Logic & Interactive Systems
 * Includes:
 * 1. Web Audio Synthesizer (Sci-Fi Audio Engine)
 * 2. Dynamic Typing Engine
 * 3. 3D Perspective Card Tilt
 * 4. Interactive Live AI Agent Terminal Sandbox
 * 5. Dynamic AI ROI Calculator
 * 6. Portfolio Category Filter
 * 7. Animated Metric Counters
 * 8. Interactive Cursor Tracking
 * 9. Consultation Form & Toast System
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. WEB AUDIO SYNTHESIZER (Sci-Fi Sound FX Engine)
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          this.initialized = true;
        }
      } catch (e) {
        console.warn('Web Audio API not supported', e);
      }
    }

    playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.03) {
      if (this.muted || !this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }

    hoverBlip() {
      this.playTone(880, 'sine', 0.04, 0.015);
    }

    clickChime() {
      if (this.muted || !this.ctx) return;
      this.playTone(660, 'triangle', 0.08, 0.04);
      setTimeout(() => this.playTone(990, 'sine', 0.12, 0.04), 60);
    }

    successChord() {
      if (this.muted || !this.ctx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sine', 0.25, 0.03), idx * 70);
      });
    }

    toggleMute() {
      this.muted = !this.muted;
      return this.muted;
    }
  }

  const sound = new SoundEngine();

  // Initialize audio on first user gesture
  function unlockAudio() {
    sound.init();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  }
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  // Sound toggle button in navigation
  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sound.init();
      const isMuted = sound.toggleMute();
      soundToggleBtn.classList.toggle('active', !isMuted);
      soundToggleBtn.innerHTML = isMuted
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
      if (!isMuted) sound.clickChime();
    });
  }

  // Attach hover sounds to interactive elements
  const interactiveElements = document.querySelectorAll('button, a, .service-3d-card, .bento-card, .project-card, .case-card, .scenario-btn, .scenario-pill-btn');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => sound.hoverBlip());
  });

  /* ==========================================================================
     2. DYNAMIC TYPING EFFECT (Hero Section)
     ========================================================================== */
  const dynamicTypeEl = document.getElementById('dynamic-type-text');
  if (dynamicTypeEl) {
    const roles = [
      'Autonomous AI Agent Swarms',
      'Enterprise LLM & RAG Systems',
      'High-Speed Vision AI Pipelines',
      'Custom Deep Learning Models',
      'Scalable MLOps & Triton Servers'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        dynamicTypeEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 40;
      } else {
        dynamicTypeEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typeSpeed = 1800; // Pause at end of text
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next
      }

      setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();
  }

  /* ==========================================================================
     3. 3D PERSPECTIVE CARD TILT EFFECT (Vanilla JS Physics)
     ========================================================================== */
  const tiltCards = document.querySelectorAll('.tilt-3d');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)`;
    });
  });

  /* ==========================================================================
     4. INTERACTIVE LIVE AI AGENT TERMINAL SANDBOX
     ========================================================================== */
  const terminalScreen = document.getElementById('terminal-log-output');
  const scenarioBtns = document.querySelectorAll('.scenario-btn, .scenario-pill-btn');

  const scenarios = {
    'multi-agent': [
      { text: '[INIT] Spawning Autonomous Multi-Agent Swarm (LangGraph + CrewAI)...', class: 'log-sys' },
      { text: '[PLANNER] Task: "Execute Cross-Market Arbitrage & Sentiment Synthesis"', class: 'log-cyan' },
      { text: '[AGENT 1: WebCrawler] Ingested 14,200 real-time financial filings and news streams', class: 'log-purple' },
      { text: '[AGENT 2: NLP Analyzer] Running fine-tuned FinBERT sentiment extraction: Confidence 98.7%', class: 'log-green' },
      { text: '[AGENT 3: Risk Guardian] Evaluating portfolio exposure constraint: PASSED (Value-at-Risk < 1.2%)', class: 'log-yellow' },
      { text: '[EXECUTION] 4 autonomous trades routed with 3.8ms latency. PnL projection: +14.8%', class: 'log-green' },
      { text: '[SUCCESS] Swarm mission cycle completed in 218ms. Awaiting next trigger.', class: 'log-cyan' }
    ],
    'enterprise-rag': [
      { text: '[INIT] Hybrid RAG Engine (Qdrant Vector DB + Dense/Sparse BM25 Search)...', class: 'log-sys' },
      { text: '[INPUT] Query: "Explain our Q3 liability clauses under section 4.8.2"', class: 'log-cyan' },
      { text: '[EMBED] text-embedding-3-large generated 3,072-dim vector in 18ms', class: 'log-purple' },
      { text: '[RETRIEVE] Top-k 20 chunks retrieved across 850,000 PDF pages (Cosine: 0.942)', class: 'log-purple' },
      { text: '[RERANK] Cohere Rerank-v3 filtered to 4 ground-truth legal citations', class: 'log-yellow' },
      { text: '[SYNTHESIS] Claude 3.5 Sonnet generated verified answer with 0% hallucination score', class: 'log-green' },
      { text: '[COMPLETED] Total latency: 412ms | Token efficiency: 94.2%', class: 'log-green' }
    ],
    'vision-defect': [
      { text: '[STREAM] Connecting 4K industrial optical camera @ 60 FPS...', class: 'log-sys' },
      { text: '[MODEL] Loading YOLOv10-TensorRT optimized FP16 engine on NVIDIA Jetson Orin...', class: 'log-cyan' },
      { text: '[FRAME #18420] Surface Inspection: PCB Micro-controller Unit #417', class: 'log-sys' },
      { text: '[DETECT] Micro-fracture detected in pin 12 solder joint (Width: 0.04mm)', class: 'log-yellow' },
      { text: '[CONFIDENCE] 99.8% precision | Class: "Solder_Bridge_Defect"', class: 'log-green' },
      { text: '[TRIGGER] Actuating robotic rejection arm | Pipeline latency: 2.1ms', class: 'log-cyan' },
      { text: '[LOGGED] Defect telemetry synchronized to edge dashboard & cloud analytics.', class: 'log-green' }
    ],
    'model-finetune': [
      { text: '[MLOPS] Initializing QLoRA 4-bit Fine-Tuning Pipeline for Llama-3-70B...', class: 'log-sys' },
      { text: '[DATA] Ingesting 45,000 proprietary enterprise medical/legal domain pairs', class: 'log-purple' },
      { text: '[PARAM] Rank r=64, Alpha=128, Gradient Checkpointing enabled on 4x H100 SXM5', class: 'log-cyan' },
      { text: '[EPOCH 3/3] Training Loss: 0.284 | Validation Perplexity: 3.12 (SOTA)', class: 'log-green' },
      { text: '[BENCHMARK] Domain accuracy improved from 68.2% (base) -> 89.6% (tuned)', class: 'log-yellow' },
      { text: '[EXPORT] Quantized GGUF & vLLM engine deployed to production cluster with Triton.', class: 'log-cyan' }
    ]
  };

  let activeInterval = null;

  function runTerminalScenario(scenarioKey) {
    if (!terminalScreen) return;
    clearInterval(activeInterval);
    terminalScreen.innerHTML = '';

    const lines = scenarios[scenarioKey] || scenarios['multi-agent'];
    let lineIdx = 0;

    function addNextLine() {
      if (lineIdx >= lines.length) {
        const promptLine = document.createElement('div');
        promptLine.className = 'log-line';
        promptLine.innerHTML = `<span class="log-cyan">hammad@ai-core:~$</span> <span class="terminal-cursor-blink"></span>`;
        terminalScreen.appendChild(promptLine);
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
        return;
      }

      const lineData = lines[lineIdx];
      const lineEl = document.createElement('div');
      lineEl.className = `log-line ${lineData.class}`;

      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      lineEl.innerHTML = `<span class="log-sys">[${timestamp}]</span> ${lineData.text}`;
      terminalScreen.appendChild(lineEl);
      terminalScreen.scrollTop = terminalScreen.scrollHeight;

      sound.playTone(1200 + lineIdx * 100, 'sine', 0.02, 0.008);

      lineIdx++;
      const nextDelay = 350 + Math.random() * 300;
      activeInterval = setTimeout(addNextLine, nextDelay);
    }

    addNextLine();
  }

  scenarioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sound.clickChime();
      scenarioBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const scenarioKey = btn.getAttribute('data-scenario');
      runTerminalScenario(scenarioKey);
    });
  });

  // Start with default scenario
  if (scenarioBtns.length > 0) {
    runTerminalScenario('multi-agent');
  }

  /* ==========================================================================
     5. DYNAMIC AI ROI CALCULATOR
     ========================================================================== */
  const teamSlider = document.getElementById('slider-team-size');
  const hoursSlider = document.getElementById('slider-hours-manual');
  const rateSlider = document.getElementById('slider-hourly-rate');

  const teamValDisplay = document.getElementById('val-team-size');
  const hoursValDisplay = document.getElementById('val-hours-manual');
  const rateValDisplay = document.getElementById('val-hourly-rate');

  const metricSavings = document.getElementById('metric-savings');
  const metricHours = document.getElementById('metric-hours-saved');
  const metricRoi = document.getElementById('metric-roi-multiplier');
  const metricPayback = document.getElementById('metric-payback-months');

  function calculateRoi() {
    if (!teamSlider || !hoursSlider || !rateSlider) return;

    const teamSize = parseInt(teamSlider.value, 10);
    const hoursPerWeek = parseInt(hoursSlider.value, 10);
    const hourlyRate = parseInt(rateSlider.value, 10);

    // Update labels
    if (teamValDisplay) teamValDisplay.textContent = `${teamSize} Engineers / Ops`;
    if (hoursValDisplay) hoursValDisplay.textContent = `${hoursPerWeek} hrs/week`;
    if (rateValDisplay) rateValDisplay.textContent = `$${hourlyRate}/hr`;

    // AI Automation removes ~65% of repetitive work
    const automationRate = 0.65;
    const weeklyHoursSaved = teamSize * hoursPerWeek * automationRate;
    const annualHoursSaved = Math.round(weeklyHoursSaved * 50);
    const annualCostSavings = Math.round(annualHoursSaved * hourlyRate);

    // Estimated implementation cost based on team complexity
    const estimatedCost = Math.max(25000, teamSize * 1400);
    const roiMultiplier = ((annualCostSavings / estimatedCost)).toFixed(1);
    const paybackMonths = Math.max(1.2, ((estimatedCost / (annualCostSavings / 12)))).toFixed(1);

    // Format currency
    const formattedSavings = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(annualCostSavings);

    const formattedHours = new Intl.NumberFormat('en-US').format(annualHoursSaved);

    if (metricSavings) metricSavings.textContent = formattedSavings;
    if (metricHours) metricHours.textContent = `${formattedHours} hrs`;
    if (metricRoi) metricRoi.textContent = `${roiMultiplier}x ROI`;
    if (metricPayback) metricPayback.textContent = `${paybackMonths} Mo`;
  }

  [teamSlider, hoursSlider, rateSlider].forEach((slider) => {
    if (slider) {
      slider.addEventListener('input', calculateRoi);
    }
  });
  calculateRoi();

  /* ==========================================================================
     6. PORTFOLIO CATEGORY FILTER
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn, .filter-chip-btn');
  const projectCards = document.querySelectorAll('.project-card, .case-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sound.clickChime();
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'logFadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     7. ANIMATED METRIC COUNTERS (Intersection Observer)
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter-val');
  let counted = false;

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          counterElements.forEach((el) => {
            const target = parseFloat(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const isFloat = target % 1 !== 0;
            let current = 0;
            const step = target / 50;

            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
            }, 30);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.hero-stats-bar, .hero-telemetry-row');
  if (statsSection) {
    countObserver.observe(statsSection);
  }

  /* ==========================================================================
     8. CUSTOM INTERACTIVE CURSOR (Desktop)
     ========================================================================== */
  const cursorFollower = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');

  if (cursorFollower && cursorDot && window.innerWidth > 992) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;

      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverables = document.querySelectorAll('button, a, input, textarea, select, .service-3d-card, .bento-card, .project-card, .case-card, .scenario-btn, .scenario-pill-btn');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorFollower.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hovering'));
    });
  }

  /* ==========================================================================
     9. CONSULTATION FORM & TOAST NOTIFICATION
     ========================================================================== */
  const contactForm = document.getElementById('consultation-form');
  const toast = document.getElementById('toast-notice');

  function showToast(message) {
    if (!toast) return;
    toast.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00f5a0" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    sound.successChord();

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>Transmitting to Hammad's AI Nexus...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showToast('Inquiry Transmitted! Hammad will reply with an architecture proposal within 12 hours.');
      }, 1200);
    });
  }

  /* ==========================================================================
     10. FLOATING NAVBAR SCROLL & ACTIVE LINK SPY
     ========================================================================== */
  const siteNavWrapper = document.querySelector('.site-nav-wrapper') || document.querySelector('.site-nav');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu') || document.querySelector('.nav-links');
  const navLinksList = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (!siteNavWrapper) return;
    if (window.scrollY > 30) {
      siteNavWrapper.classList.add('scrolled');
    } else {
      siteNavWrapper.classList.remove('scrolled');
    }

    // Scrollspy active section detection
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinksList.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      sound.clickChime();
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    navLinksList.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

})();
