/**
 * cooked_meter.js - "Am I Cooked?" Semester Exam Survival & Zodiac Luck Calculator
 */

const ROASTS = {
  raw: [
    "Bro is chilling like it's summer break. Either you're the class topper or completely delusional.",
    "Suspiciously calm. Did you actually study or did you accept your fate two weeks ago?",
    "Zero smoke detected. Go take a nap, Einstein.",
    "You're fresher than morning lettuce. What are you even doing on this website?"
  ],
  light: [
    "Mild warmth detected. You still have time if you close Instagram right now.",
    "A gentle simmer. Don't get cocky though, one Netflix episode could ruin you.",
    "Manageable! Just don't start color-coding your notes instead of actually reading them.",
    "You're in the safe zone, but the water is beginning to boil."
  ],
  medium: [
    "The pan is smoking! You're officially sweating through your notes.",
    "You need to enter academic beast mode. Turn off the group chat immediately.",
    "Half-baked situation. You'll pass if you trade sleep for caffeine and prayer.",
    "Sizzling! You're currently negotiating with God to only get questions from module 1."
  ],
  wellDone: [
    "CRITICAL HEAT! You are actively burning to the bottom of the pan!",
    "You need to study 16 hours a day and absorb PDFs via bluetooth into your skull.",
    "Gordon Ramsay just walked in and called your semester preparation an idiot sandwich.",
    "Your brain is running at 100% CPU with 256MB of actual syllabus cached."
  ],
  burnt: [
    "DEEP FRIED. CHARRED. REDUCED TO ATOMS.",
    "Bro you aren't just cooked, you are on the menu at KFC.",
    "At this point, just write your roll number in fancy calligraphy and hope for partial credit.",
    "You have 2 days for 5 modules? You need a time machine, not a study timetable.",
    "Pack your bags. The professor is already grading your exam with a red Sharpie from home."
  ]
};

const ZODIAC_DATA = {
  aries: {
    name: "Aries (The Ram)",
    element: "Fire",
    planet: "Mars",
    cosmicBadge: "COSMIC LUCK: MARS CLUTCH (-8%)",
    cosmicTitle: "Aries: Mars Clutch Power",
    reduction: 8,
    cosmicDesc: "Fiery Mars adrenaline activates! Your last-minute clutch sprint reduces cookedness by 8%.",
    luckMessage: "Your fiery stubbornness gives you clutch superpowers! You might speedrun 3 modules tonight.",
    forsakenMessage: "Even gods doesn't help you! Mars ran out of fire and left you to burn alone. Your impulsive cramming will meet reality head-on."
  },
  taurus: {
    name: "Taurus (The Bull)",
    element: "Earth",
    planet: "Venus",
    cosmicBadge: "COSMIC LUCK: BULL FORTITUDE (-7%)",
    cosmicTitle: "Taurus: Unshakable Endurance",
    reduction: 7,
    cosmicDesc: "Venus brings deep grounding. Methodical pacing and unyielding focus reduce cookedness by 7%.",
    luckMessage: "Slow and steady is actually saving you. Your grounded focus will pull you through.",
    forsakenMessage: "Even gods doesn't help you! You were too stubborn to start studying 3 weeks ago, and now the universe has muted your prayers."
  },
  gemini: {
    name: "Gemini (The Twins)",
    element: "Air",
    planet: "Mercury",
    cosmicBadge: "COSMIC LUCK: MERCURY TWIN-BRAIN (-10%)",
    cosmicTitle: "Gemini: Dual-Core Synergy",
    reduction: 10,
    cosmicDesc: "Mercury blesses both brain halves! Simultaneous speed-reading and MCQ hacks slash cookedness by 10%.",
    luckMessage: "Mercury blessing active! Your dual-brain can absorb 2 slides at the same time and guess every MCQ correctly.",
    forsakenMessage: "Even gods doesn't help you! Both of your personalities are currently failing the same exam. Neither one took notes."
  },
  cancer: {
    name: "Cancer (The Crab)",
    element: "Water",
    planet: "Moon",
    cosmicBadge: "COSMIC LUCK: LUNAR SHIELD (-6%)",
    cosmicTitle: "Cancer: Moon Sanctuary",
    reduction: 6,
    cosmicDesc: "The Moon shields against anxiety! Calm emotional clarity reduces cookedness by 6%.",
    luckMessage: "The Moon is providing emotional shielding. Light an exam candle and lock in.",
    forsakenMessage: "Even gods doesn't help you! Tears do not count as exam ink. The gods have left the chat and blocked your phone number."
  },
  leo: {
    name: "Leo (The Lion)",
    element: "Fire",
    planet: "Sun",
    cosmicBadge: "COSMIC LUCK: SOLAR PLOT ARMOR (-9%)",
    cosmicTitle: "Leo: Radiant Plot Armor",
    reduction: 9,
    cosmicDesc: "The Sun bestows radiant main-character invulnerability! Grade-curving luck reduces cookedness by 9%.",
    luckMessage: "Main character plot armor detected! The professor might just curve your grade out of respect.",
    forsakenMessage: "Even gods doesn't help you! Your main character energy cannot defeat 5 modules in 24 hours. You are an extra in your own exam."
  },
  virgo: {
    name: "Virgo (The Virgin)",
    element: "Earth",
    planet: "Mercury",
    cosmicBadge: "COSMIC LUCK: SURGICAL LOGIC (-9%)",
    cosmicTitle: "Virgo: Precision Mastermind",
    reduction: 9,
    cosmicDesc: "Mercury sharpens analytical recall! Clean note structuring and rapid recall reduce cookedness by 9%.",
    luckMessage: "Your analytical mind and clean handwriting will charm the evaluator into giving extra credit.",
    forsakenMessage: "Even gods doesn't help you! Your color-coded timetable looks gorgeous, but you haven't opened page 1. Perfectionism led to cremation."
  },
  libra: {
    name: "Libra (The Scales)",
    element: "Air",
    planet: "Venus",
    cosmicBadge: "COSMIC LUCK: CELESTIAL EQUILIBRIUM (-8%)",
    cosmicTitle: "Libra: 51% Golden Balance",
    reduction: 8,
    cosmicDesc: "Cosmic scales tilt in your favor! Perfect minimum-effort balance reduces cookedness by 8%.",
    luckMessage: "Cosmic balance is on your side. Even if you only know 50%, you'll somehow get 51% and pass.",
    forsakenMessage: "Even gods doesn't help you! You spent 4 days deciding whether to start with Module 1 or Module 2. Judgment day has arrived."
  },
  scorpio: {
    name: "Scorpio (The Scorpion)",
    element: "Water",
    planet: "Pluto",
    cosmicBadge: "COSMIC LUCK: PLUTONIC HYPERFOCUS (-11%)",
    cosmicTitle: "Scorpio: Midnight Intensity",
    reduction: 11,
    cosmicDesc: "Pluto unlocks fierce occult stamina. Unmatched midnight all-nighter focus slashes cookedness by 11%.",
    luckMessage: "Your intense dark obsession allows you to pull an ungodly all-nighter and defeat the syllabus.",
    forsakenMessage: "Even gods doesn't help you! Not even your secret dark vengeance can save your GPA now. Pluto has disowned you."
  },
  sagittarius: {
    name: "Sagittarius (The Archer)",
    element: "Fire",
    planet: "Jupiter",
    cosmicBadge: "COSMIC LUCK: JUPITER JACKPOT (-12%)",
    cosmicTitle: "Sagittarius: Fortune's Golden Arrow",
    reduction: 12,
    cosmicDesc: "Jupiter delivers maximum jackpot luck! Guessing exact textbook exam questions slashes cookedness by 12%.",
    luckMessage: "Jupiter's jackpot luck is alive! You will randomly open the textbook to the exact page that appears on Question 1.",
    forsakenMessage: "Even gods doesn't help you! You trusted 'vibes over studying'. The vibes are now a category 5 hurricane heading for your transcript."
  },
  capricorn: {
    name: "Capricorn (The Sea-Goat)",
    element: "Earth",
    planet: "Saturn",
    cosmicBadge: "COSMIC LUCK: TITAN DISCIPLINE (-9%)",
    cosmicTitle: "Capricorn: Iron Willpower",
    reduction: 9,
    cosmicDesc: "Saturn rewards relentless grinding. Stoic focus and disciplined study reduce cookedness by 9%.",
    luckMessage: "Saturn respects your discipline. The grinding will yield a respectable passing grade.",
    forsakenMessage: "Even gods doesn't help you! For the first time in history, a Capricorn procrastinated. The ancestors are weeping in shame."
  },
  aquarius: {
    name: "Aquarius (The Water-Bearer)",
    element: "Air",
    planet: "Uranus",
    cosmicBadge: "COSMIC LUCK: NEBULA INNOVATION (-9%)",
    cosmicTitle: "Aquarius: Eureka Insight",
    reduction: 9,
    cosmicDesc: "Uranus sparks unorthodox brilliance! Creative out-of-the-box exam logic reduces cookedness by 9%.",
    luckMessage: "Your unconventional thinking will produce creative answers that confuse the professor into giving full marks.",
    forsakenMessage: "Even gods doesn't help you! You thought you'd revolutionize the exam by not studying. You are about to revolutionize supplementary fees."
  },
  pisces: {
    name: "Pisces (The Fish)",
    element: "Water",
    planet: "Neptune",
    cosmicBadge: "COSMIC LUCK: ASTRAL FLOW (-8%)",
    cosmicTitle: "Pisces: Mystic Sixth Sense",
    reduction: 8,
    cosmicDesc: "Neptunian intuition guides your pen. Eerie gut instincts for right answers reduce cookedness by 8%.",
    luckMessage: "Intuition overload! Your gut feeling will lead you to the exact questions being asked.",
    forsakenMessage: "Even gods doesn't help you! You manifested passing in your dreams, but this exam is taking place in harsh reality."
  }
};

class CookedCalculator {
  constructor() {
    this.hasCalculated = false;
    this.isProcessing = false;
    this.isStale = false;
    this.initElements();
    this.bindEvents();
    this.updateStandbySummary();
  }

  initElements() {
    // Inputs
    this.studentNameInput = document.getElementById('student-name');
    this.examNameInput = document.getElementById('exam-name');
    this.zodiacInput = document.getElementById('zodiac-sign');
    this.daysInput = document.getElementById('days-left');
    this.totalModulesInput = document.getElementById('total-modules');
    this.coveredModulesInput = document.getElementById('covered-modules');
    this.modulesLeftInput = document.getElementById('modules-left');
    this.studyHoursInput = document.getElementById('daily-study-hours');
    this.hoursPerModInput = document.getElementById('hours-per-module');
    this.panicModeSelect = document.getElementById('panic-mode');

    // Calculate & State Containers
    this.btnCalculate = document.getElementById('btn-calculate-cooked');
    this.btnCalcText = document.getElementById('btn-calc-text');
    this.standbyState = document.getElementById('cooked-standby-state');
    this.processingState = document.getElementById('cooked-processing-state');
    this.resultsState = document.getElementById('cooked-results-state');
    this.standbySummaryPill = document.getElementById('standby-summary-pill');

    // Processing Page Elements
    this.procProgressFill = document.getElementById('proc-progress-fill');
    this.procPercentNum = document.getElementById('proc-percent-num');
    this.procStepName = document.getElementById('proc-step-name');
    this.procStageSubtitle = document.getElementById('proc-stage-subtitle');
    this.procFeedBox = document.getElementById('proc-feed-box');

    // Outputs
    this.meterFill = document.getElementById('cooked-meter-fill');
    this.percentageText = document.getElementById('cooked-percentage');
    this.statusBadge = document.getElementById('cooked-status-badge');
    this.roastText = document.getElementById('cooked-roast-text');
    this.velocityText = document.getElementById('cooked-velocity-text');
    this.hoursDeficitText = document.getElementById('cooked-deficit-text');
    this.skilletEmoji = document.getElementById('skillet-student-emoji');
    this.flameEffect = document.getElementById('meter-flame-effect');

    // Zodiac Luck Outputs
    this.zodiacLuckBadge = document.getElementById('zodiac-luck-badge');
    this.zodiacVerdictTitle = document.getElementById('zodiac-verdict-title');
    this.zodiacVerdictText = document.getElementById('zodiac-verdict-text');

    this.certificateModal = document.getElementById('certificate-modal');
  }

  updateStandbySummary() {
    const days = Math.max(0, parseFloat(this.daysInput?.value) || 0);
    const left = Math.max(0, parseFloat(this.modulesLeftInput?.value) || 0);
    const dailyStudyHours = Math.max(0.5, parseFloat(this.studyHoursInput?.value) || 4);
    const zodiacKey = this.zodiacInput ? this.zodiacInput.value : 'aries';
    const zodiacInfo = ZODIAC_DATA[zodiacKey] || ZODIAC_DATA.aries;

    if (this.standbySummaryPill) {
      this.standbySummaryPill.innerHTML = `<span>Ready: <strong>${days} Days Left</strong> • <strong>${left} Modules</strong> • <strong>${zodiacInfo.name.split(' ')[0]}</strong></span>`;
    }
  }

  markInputChanged() {
    this.updateStandbySummary();
    if (this.hasCalculated) {
      this.isStale = true;
      if (this.btnCalcText) {
        this.btnCalcText.textContent = 'RE-CALCULATE COOKED LEVEL';
      }
      if (this.btnCalculate) {
        this.btnCalculate.classList.add('pulse-needed');
      }
    }
  }

  bindEvents() {
    // Two-way module syncing
    this.totalModulesInput.addEventListener('input', () => {
      let total = parseFloat(this.totalModulesInput.value) || 0;
      let covered = parseFloat(this.coveredModulesInput.value) || 0;
      if (covered > total) {
        covered = total;
        this.coveredModulesInput.value = covered;
      }
      this.modulesLeftInput.value = Math.max(0, total - covered);
      this.markInputChanged();
    });

    this.coveredModulesInput.addEventListener('input', () => {
      let total = parseFloat(this.totalModulesInput.value) || 0;
      let covered = parseFloat(this.coveredModulesInput.value) || 0;
      if (covered > total) {
        total = covered;
        this.totalModulesInput.value = total;
      }
      this.modulesLeftInput.value = Math.max(0, total - covered);
      this.markInputChanged();
    });

    this.modulesLeftInput.addEventListener('input', () => {
      let left = parseFloat(this.modulesLeftInput.value) || 0;
      let total = parseFloat(this.totalModulesInput.value) || 0;
      if (left > total) {
        total = left;
        this.totalModulesInput.value = total;
        this.coveredModulesInput.value = 0;
      } else {
        this.coveredModulesInput.value = Math.max(0, total - left);
      }
      this.markInputChanged();
    });

    const standardInputs = [
      this.daysInput,
      this.studyHoursInput,
      this.hoursPerModInput,
      this.panicModeSelect,
      this.studentNameInput,
      this.examNameInput,
      this.zodiacInput
    ];

    standardInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.markInputChanged());
        input.addEventListener('change', () => this.markInputChanged());
      }
    });

    // Primary Calculate Button Click
    if (this.btnCalculate) {
      this.btnCalculate.addEventListener('click', () => {
        this.startProcessingCalculation();
      });
    }

    // Preset quick buttons
    document.querySelectorAll('.quick-scenario-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenario = e.currentTarget.dataset.scenario;
        this.loadScenario(scenario);
      });
    });

    // Stepper buttons for semi-circle pods
    document.querySelectorAll('.pod-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        const delta = parseFloat(e.currentTarget.getAttribute('data-delta')) || 0;
        const targetInput = document.getElementById(targetId);
        if (!targetInput) return;

        let currentVal = parseFloat(targetInput.value) || 0;
        const min = targetInput.hasAttribute('min') ? parseFloat(targetInput.getAttribute('min')) : 0;
        const max = targetInput.hasAttribute('max') ? parseFloat(targetInput.getAttribute('max')) : 999;

        let newVal = currentVal + delta;
        newVal = Math.round(newVal * 10) / 10;
        if (newVal < min) newVal = min;
        if (newVal > max) newVal = max;

        targetInput.value = newVal;
        targetInput.dispatchEvent(new Event('input'));
        targetInput.dispatchEvent(new Event('change'));
      });
    });

    // Certificate buttons
    const viewCertBtn = document.getElementById('btn-generate-cert');
    if (viewCertBtn) {
      viewCertBtn.addEventListener('click', () => this.openCertificate());
    }

    const closeCertBtn = document.getElementById('btn-close-cert');
    if (closeCertBtn) {
      closeCertBtn.addEventListener('click', () => this.closeCertificate());
    }

    const copyCertBtn = document.getElementById('btn-copy-roast');
    if (copyCertBtn) {
      copyCertBtn.addEventListener('click', () => this.copyRoastToClipboard());
    }
  }

  startProcessingCalculation() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.playClick();
    }

    if (this.btnCalculate) {
      this.btnCalculate.classList.remove('pulse-needed');
      this.btnCalculate.style.pointerEvents = 'none';
      this.btnCalculate.style.opacity = '0.7';
    }
    if (this.btnCalcText) {
      this.btnCalcText.textContent = 'CRUNCHING DATA...';
    }

    // Hide Standby and Results, Show Processing State
    if (this.standbyState) this.standbyState.style.display = 'none';
    if (this.resultsState) this.resultsState.style.display = 'none';
    if (this.processingState) {
      this.processingState.style.display = 'block';
    }

    const days = Math.max(0, parseFloat(this.daysInput?.value) || 0);
    const left = Math.max(0, parseFloat(this.modulesLeftInput?.value) || 0);
    const hoursPerModule = Math.max(1, parseFloat(this.hoursPerModInput?.value) || 8);
    const totalHoursNeeded = left * hoursPerModule;
    const dailyVelocity = days > 0 ? (totalHoursNeeded / days).toFixed(1) : totalHoursNeeded.toFixed(1);
    const zodiacKey = this.zodiacInput ? this.zodiacInput.value : 'aries';
    const zodiacInfo = ZODIAC_DATA[zodiacKey] || ZODIAC_DATA.aries;

    // STEP 1 (0ms)
    this.updateProcessingStep(
      15,
      'Step 1 of 4: Checking Exam Schedule & Modules',
      `Scanning timetable: ${days} days left for ${left} modules...`,
      '⚡ Querying Academic Survival Matrix...'
    );
    if (window.soundEngine) window.soundEngine.playProcessingBeep(1.0);

    // STEP 2 (550ms)
    setTimeout(() => {
      this.updateProcessingStep(
        45,
        'Step 2 of 4: Computing Required Study Velocity',
        `Calculating pace: ${dailyVelocity} hrs/day needed vs sleep buffer...`,
        '☕ Testing brain RAM & caffeine absorption limits...'
      );
      if (window.soundEngine) window.soundEngine.playProcessingBeep(1.25);
    }, 550);

    // STEP 3 (1100ms)
    setTimeout(() => {
      this.updateProcessingStep(
        75,
        'Step 3 of 4: Celestial Zodiac Alignment',
        `Consulting ${zodiacInfo.name} • ${zodiacInfo.planet} influence...`,
        `✨ Applying ${zodiacInfo.cosmicBadge}...`
      );
      if (window.soundEngine) window.soundEngine.playProcessingBeep(1.5);
    }, 1100);

    // STEP 4 (1650ms)
    setTimeout(() => {
      this.updateProcessingStep(
        100,
        'Step 4 of 4: Finalizing Gordon Ramsay Roast',
        'Verdict synthesized! Preparing Cooked Gauge...',
        '🔥 Ready to reveal final cooked status!'
      );
      if (window.soundEngine) window.soundEngine.playDing();
    }, 1650);

    // REVEAL RESULTS (2100ms)
    setTimeout(() => {
      this.isProcessing = false;
      this.hasCalculated = true;
      this.isStale = false;

      if (this.processingState) this.processingState.style.display = 'none';
      if (this.resultsState) {
        this.resultsState.style.display = 'block';
      }

      if (this.btnCalculate) {
        this.btnCalculate.style.pointerEvents = 'auto';
        this.btnCalculate.style.opacity = '1';
      }
      if (this.btnCalcText) {
        this.btnCalcText.textContent = 'RE-CALCULATE COOKED LEVEL';
      }

      this.calculate();

      // Scroll to gauge smoothly if on mobile
      if (window.innerWidth < 768 && this.resultsState) {
        this.resultsState.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 2100);
  }

  updateProcessingStep(percent, stepName, subtitle, feedMsg) {
    if (this.procProgressFill) this.procProgressFill.style.width = `${percent}%`;
    if (this.procPercentNum) this.procPercentNum.textContent = `${percent}%`;
    if (this.procStepName) this.procStepName.textContent = stepName;
    if (this.procStageSubtitle) this.procStageSubtitle.textContent = subtitle;
    if (this.procFeedBox) {
      this.procFeedBox.innerHTML = `<div class="feed-item active">${feedMsg}</div>`;
    }
  }

  loadScenario(scenario) {
    if (scenario === 'exam_tomorrow') {
      this.daysInput.value = 1;
      this.totalModulesInput.value = 5;
      this.coveredModulesInput.value = 0.5;
      this.modulesLeftInput.value = 4.5;
      this.studyHoursInput.value = 6;
      this.panicModeSelect.value = 'crisis';
      this.zodiacInput.value = 'aries';
    } else if (scenario === 'semester_start') {
      this.daysInput.value = 45;
      this.totalModulesInput.value = 6;
      this.coveredModulesInput.value = 1;
      this.modulesLeftInput.value = 5;
      this.studyHoursInput.value = 3;
      this.panicModeSelect.value = 'chill';
      this.zodiacInput.value = 'capricorn';
    } else if (scenario === 'one_week_clutch') {
      this.daysInput.value = 7;
      this.totalModulesInput.value = 5;
      this.coveredModulesInput.value = 2;
      this.modulesLeftInput.value = 3;
      this.studyHoursInput.value = 5;
      this.panicModeSelect.value = 'normal';
      this.zodiacInput.value = 'gemini';
    }
    this.markInputChanged();
  }

  calculate() {
    const days = Math.max(0, parseFloat(this.daysInput?.value) || 0);
    const totalModules = Math.max(0.1, parseFloat(this.totalModulesInput?.value) || 1);
    const covered = Math.max(0, parseFloat(this.coveredModulesInput?.value) || 0);
    const left = Math.max(0, parseFloat(this.modulesLeftInput?.value) || 0);
    const dailyStudyHours = Math.max(0.5, parseFloat(this.studyHoursInput?.value) || 4);
    const hoursPerModule = Math.max(1, parseFloat(this.hoursPerModInput?.value) || 8);
    const panicMode = this.panicModeSelect ? this.panicModeSelect.value : 'normal';
    const zodiacKey = this.zodiacInput ? this.zodiacInput.value : 'aries';

    const totalHoursNeeded = left * hoursPerModule;
    const totalHoursAvailable = days * dailyStudyHours;

    // Daily required velocity
    const dailyVelocityNeeded = days > 0 ? (totalHoursNeeded / days) : totalHoursNeeded;

    // Panic multiplier
    let multiplier = 1.0;
    if (panicMode === 'chill') multiplier = 0.85;
    if (panicMode === 'crisis') multiplier = 1.35;
    if (panicMode === 'praying') multiplier = 1.6;

    const zodiacInfo = ZODIAC_DATA[zodiacKey] || ZODIAC_DATA.aries;
    let cookedScore = 0;

    // Days left 0 or modules left 0 should strictly be 0% cooked
    if (days === 0 || left === 0) {
      cookedScore = 0;
    } else {
      const uncoveredRatio = left / totalModules;
      let rawScore = 0;

      if (days === 9) {
        // Specifically targeted between 5% and 10% after zodiac luck reduction
        rawScore = 15 + Math.round(uncoveredRatio * 2) * multiplier;
      } else if (days > 9) {
        // Plenty of days ahead (0% - 5%)
        rawScore = Math.round((9 / days) * 12 * uncoveredRatio * multiplier);
      } else if (days >= 6) {
        // 6 to 8 days: gentle simmer (12% - 24%)
        const dayRatio = (9 - days) / 3;
        rawScore = Math.round(16 + dayRatio * 12 * uncoveredRatio * multiplier);
      } else if (days >= 3) {
        // 3 to 5 days: active heating (28% - 50%)
        const dayRatio = (6 - days) / 3;
        rawScore = Math.round(32 + dayRatio * 24 * Math.max(0.6, uncoveredRatio) * multiplier);
      } else if (days === 2) {
        // 2 days: critical danger (55% - 75%)
        rawScore = Math.round(62 + uncoveredRatio * 18 * multiplier);
      } else {
        // 1 day left: maximum emergency (80% - 98%)
        rawScore = Math.round(82 + uncoveredRatio * 18 * multiplier);
      }

      // Apply star sign Cosmic Luck reduction to reduce overall cookedness
      const luckReduction = zodiacInfo.reduction || 8;
      cookedScore = Math.max(0, rawScore - luckReduction);

      // Ensure that when days left is 9, it is cleanly between 5% and 10%
      if (days === 9) {
        cookedScore = Math.min(10, Math.max(5, cookedScore));
      }
    }

    cookedScore = Math.max(0, Math.min(100, Math.round(cookedScore)));

    // Ensure Academic Crisis part is completely silent
    if (window.soundEngine) {
      window.soundEngine.stopSizzle();
    }

    this.updateUI(cookedScore, days, left, totalHoursNeeded, dailyVelocityNeeded, totalHoursAvailable, zodiacKey);
  }

  updateUI(cookedScore, days, left, totalHoursNeeded, dailyVelocityNeeded, totalHoursAvailable, zodiacKey) {
    const displayScore = cookedScore;
    this.percentageText.innerText = `${displayScore}%`;

    // Cap progress bar visually at 100%
    const barWidth = Math.min(95, displayScore * 0.95);
    this.meterFill.style.width = `${barWidth}%`;

    let tier = 'raw';
    let badgeText = 'RAW & CHILLING';
    let badgeClass = 'badge-raw';
    let emoji = 'CHILL';

    if (cookedScore <= 20) {
      tier = 'raw';
      badgeText = 'RAW & CHILLING';
      badgeClass = 'badge-raw';
      emoji = 'CHILL';
      this.meterFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
    } else if (cookedScore <= 45) {
      tier = 'light';
      badgeText = 'LIGHTLY SEARED';
      badgeClass = 'badge-light';
      emoji = 'WARM';
      this.meterFill.style.background = 'linear-gradient(90deg, #facc15, #f59e0b)';
    } else if (cookedScore <= 75) {
      tier = 'medium';
      badgeText = 'MEDIUM RARE PANIC';
      badgeClass = 'badge-medium';
      emoji = 'SWEAT';
      this.meterFill.style.background = 'linear-gradient(90deg, #f97316, #ea580c)';
    } else if (cookedScore <= 99) {
      tier = 'wellDone';
      badgeText = 'WELL DONE (CRISPY)';
      badgeClass = 'badge-welldone';
      emoji = 'CRISPY';
      this.meterFill.style.background = 'linear-gradient(90deg, #ef4444, #b91c1c)';
    } else {
      tier = 'burnt';
      badgeText = 'EXTRA DEEP FRIED / CREMATED';
      badgeClass = 'badge-burnt';
      emoji = 'BURNT';
      this.meterFill.style.background = 'linear-gradient(90deg, #dc2626, #7f1d1d, #000)';
    }

    this.statusBadge.className = `status-badge ${badgeClass}`;
    this.statusBadge.innerText = badgeText;
    this.skilletEmoji.innerText = emoji;

    // Pick roast based on tier
    const list = ROASTS[tier];
    const roastIndex = Math.floor((days + left * 3 + cookedScore) % list.length);
    this.roastText.innerText = `"${list[roastIndex]}"`;

    // Velocity breakdown
    if (left === 0) {
      this.velocityText.innerHTML = `<strong>0.0 hrs/day</strong> needed. You're already completely done!`;
      this.hoursDeficitText.innerHTML = `Syllabus 100% conquered. Go chill!`;
    } else if (days === 0) {
      this.velocityText.innerHTML = `<strong class="text-danger">EXAM IS TODAY!</strong>`;
      this.hoursDeficitText.innerHTML = `You need <strong>${totalHoursNeeded.toFixed(1)} hrs</strong> of studying in 0 minutes. Good luck soldier.`;
    } else {
      const vText = dailyVelocityNeeded > 24 
        ? `<strong class="text-danger">${dailyVelocityNeeded.toFixed(1)} hrs/day</strong> (Literally impossible, you need ${Math.ceil(dailyVelocityNeeded/24)} clones)`
        : `<strong>${dailyVelocityNeeded.toFixed(1)} hrs/day</strong> of pure studying`;
      this.velocityText.innerHTML = vText;

      const deficit = totalHoursNeeded - totalHoursAvailable;
      if (deficit > 0) {
        this.hoursDeficitText.innerHTML = `Deficit: You are short by <strong>${deficit.toFixed(1)} hours</strong> at your current pace!`;
      } else {
        this.hoursDeficitText.innerHTML = `Surplus: You have <strong>${Math.abs(deficit).toFixed(1)} extra buffer hours</strong>. Keep this rhythm!`;
      }
    }

    // --- ZODIAC LUCK EVALUATION (CUSTOMIZED BY STAR SIGN) ---
    const zodiacInfo = ZODIAC_DATA[zodiacKey] || ZODIAC_DATA.aries;

    if (this.zodiacLuckBadge && this.zodiacVerdictTitle && this.zodiacVerdictText) {
      this.zodiacLuckBadge.className = 'status-badge badge-raw';
      this.zodiacLuckBadge.innerText = zodiacInfo.cosmicBadge;
      this.zodiacVerdictTitle.innerHTML = `${zodiacInfo.cosmicTitle} <span style="font-size:0.85em; color:#38bdf8;">(-${zodiacInfo.reduction}% Cookedness)</span>`;
      this.zodiacVerdictTitle.style.color = '#38bdf8';
      
      if (cookedScore <= 35) {
        this.zodiacVerdictText.innerText = `"${zodiacInfo.cosmicDesc} ${zodiacInfo.luckMessage}"`;
      } else {
        this.zodiacVerdictText.innerText = `"${zodiacInfo.cosmicDesc} Cosmic protection is holding strong against high exam heat!"`;
      }
    }

    // Flame animation trigger
    if (cookedScore >= 60) {
      this.flameEffect.classList.add('active-flames');
    } else {
      this.flameEffect.classList.remove('active-flames');
    }
  }

  openCertificate() {
    const name = this.studentNameInput.value.trim() || 'Desperate Student';
    const exam = this.examNameInput.value.trim() || 'Semester Finals';
    const zodiacKey = this.zodiacInput ? this.zodiacInput.value : 'aries';
    const zodiacInfo = ZODIAC_DATA[zodiacKey] || ZODIAC_DATA.aries;
    const percentage = this.percentageText.innerText;
    const status = this.statusBadge.innerText;
    const roast = this.roastText.innerText;
    const cookedValue = parseInt(percentage) || 0;

    document.getElementById('cert-student-name').innerText = name;
    document.getElementById('cert-exam-name').innerText = exam;
    document.getElementById('cert-zodiac').innerText = `${zodiacInfo.name} • ${zodiacInfo.cosmicBadge}`;
    document.getElementById('cert-percentage').innerText = percentage;
    document.getElementById('cert-roast').innerText = roast;
    document.getElementById('cert-date').innerText = new Date().toLocaleDateString();

    // If cooked level > 65, show "confirmed moonji" and a redirect button
    const certStatus = document.getElementById('cert-status');
    let existingRedirectBtn = document.getElementById('btn-cert-go-cook');

    if (cookedValue > 65) {
      certStatus.innerText = 'CONFIRMED MOONJI';
      certStatus.style.color = '#ef4444';

      if (!existingRedirectBtn) {
        existingRedirectBtn = document.createElement('button');
        existingRedirectBtn.id = 'btn-cert-go-cook';
        existingRedirectBtn.className = 'btn btn-orange';
        existingRedirectBtn.style.cssText = 'width: 100%; margin-top: 12px; font-size: 1rem;';
        existingRedirectBtn.innerText = 'Go Cook Instead 🍳';
        existingRedirectBtn.addEventListener('click', () => {
          this.closeCertificate();
          if (window.cookingGame) {
            if (window.cookingGame.hideResultModal) window.cookingGame.hideResultModal();
            const jm = document.getElementById('judges-review-modal');
            if (jm) jm.classList.remove('active', 'modal-visible');
            if (window.cookingGame.initStage) window.cookingGame.initStage(1);
          }
          if (window.location.hash === '#cooking-game') {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          } else {
            window.location.hash = 'cooking-game';
          }
        });
        // Insert before the cert footer
        const certBody = document.querySelector('.cert-body');
        if (certBody) certBody.appendChild(existingRedirectBtn);
      }
      existingRedirectBtn.style.display = 'block';
    } else {
      certStatus.innerText = status;
      certStatus.style.color = 'var(--accent-orange)';
      if (existingRedirectBtn) existingRedirectBtn.style.display = 'none';
    }

    this.certificateModal.classList.add('modal-visible');
  }

  closeCertificate() {
    this.certificateModal.classList.remove('modal-visible');
  }

  copyRoastToClipboard() {
    const name = this.studentNameInput.value.trim() || 'I';
    const exam = this.examNameInput.value.trim() || 'Semester Finals';
    const zodiacKey = this.zodiacInput ? this.zodiacInput.value : 'aries';
    const zodiacInfo = ZODIAC_DATA[zodiacKey] || ZODIAC_DATA.aries;
    const score = this.percentageText.innerText;
    const status = this.statusBadge.innerText;
    const roast = this.roastText.innerText;
    const cosmicLine = `${zodiacInfo.cosmicBadge}: ${zodiacInfo.cosmicDesc} (-${zodiacInfo.reduction}% Cookedness)`;

    const copyText = `COOKED METER REPORT\nStudent: ${name}\nZodiac: ${zodiacInfo.name}\nExam: ${exam}\nCooked Level: ${score} (${status})\n${cosmicLine}\nVerdict: ${roast}\n\nCheck yours at cook,cooking,cooked!`;

    navigator.clipboard.writeText(copyText).then(() => {
      const btn = document.getElementById('btn-copy-roast');
      const orig = btn.innerText;
      btn.innerText = 'Copied to Clipboard!';
      setTimeout(() => { btn.innerText = orig; }, 2000);
    });
  }
}

window.CookedCalculator = CookedCalculator;
