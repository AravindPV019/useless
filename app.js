/**
 * app.js - Main Application Coordinator & View Router
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Engines safely
  let cookedCalc = null;
  try {
    if (window.CookedCalculator) {
      cookedCalc = new window.CookedCalculator();
    }
  } catch (e) {
    console.error('CookedCalculator init error:', e);
  }

  let cookingGame = null;
  try {
    if (window.PlayableCookingGame) {
      cookingGame = new window.PlayableCookingGame();
      window.cookingGame = cookingGame;
    }
  } catch (e) {
    console.error('PlayableCookingGame init error:', e);
  }

  // View Containers
  const viewHome = document.getElementById('view-home');
  const viewCooked = document.getElementById('view-cooked-meter');
  const viewGame = document.getElementById('view-cooking-game');

  // Navigation elements
  const btnHeaderBackHub = document.getElementById('btn-header-back-hub');
  const navLogoLink = document.getElementById('nav-logo-link');
  const portalOption1 = document.getElementById('portal-option-1');
  const portalOption2 = document.getElementById('portal-option-2');
  const backToHubBtns = document.querySelectorAll('.btn-back-to-hub');

  function navigateTo(route, updateHash = true) {
    if (window.soundEngine) {
      if (route !== 'cooked-meter') {
        window.soundEngine.playClick();
      }
      window.soundEngine.stopSizzle();
    }

    // Hide all views first
    [viewHome, viewCooked, viewGame].forEach(v => {
      if (v) v.classList.remove('active-view');
    });

    if (route === 'cooked-meter') {
      viewCooked.classList.add('active-view');
      btnHeaderBackHub.style.display = 'inline-flex';
      if (updateHash) window.location.hash = 'cooked-meter';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Results remain withheld on standby until user clicks "Calculate Cooked Level"
    } else if (route === 'cooking-game') {
      viewGame.classList.add('active-view');
      btnHeaderBackHub.style.display = 'inline-flex';
      if (updateHash) window.location.hash = 'cooking-game';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Trigger canvas resize so Three.js adapts to the displayed width.
      // Call twice: immediately after layout paints, then again after 200ms
      // to catch any flex/grid reflow that happens slightly later.
      requestAnimationFrame(() => {
        if (cookingGame && cookingGame.resizeCanvas) cookingGame.resizeCanvas();
        window.dispatchEvent(new Event('resize'));
      });
      setTimeout(() => {
        if (cookingGame && cookingGame.resizeCanvas) cookingGame.resizeCanvas();
        window.dispatchEvent(new Event('resize'));
      }, 200);
      if (cookingGame && cookingGame.stage === 2 && window.soundEngine) {
        window.soundEngine.startSizzle(0.4);
      }
    }
 else {
      // Default: Home Hub
      viewHome.classList.add('active-view');
      btnHeaderBackHub.style.display = 'none';
      if (updateHash) window.location.hash = 'home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Handle Hash on Load & Back/Forward Browser buttons
  function handleHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'cooked-meter') {
      navigateTo('cooked-meter', false);
    } else if (hash === 'cooking-game') {
      navigateTo('cooking-game', false);
    } else {
      navigateTo('home', false);
    }
  }

  window.addEventListener('hashchange', handleHash);

  // Portal Clicks from Middle Hub
  const btnLaunchCooked = document.getElementById('btn-launch-cooked-meter');
  const btnEnterComp = document.getElementById('btn-enter-competition');

  if (portalOption1) {
    portalOption1.addEventListener('click', () => navigateTo('cooked-meter'));
  }
  if (btnLaunchCooked) {
    btnLaunchCooked.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo('cooked-meter');
    });
  }

  if (portalOption2) {
    portalOption2.addEventListener('click', () => navigateTo('cooking-game'));
  }
  if (btnEnterComp) {
    btnEnterComp.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo('cooking-game');
    });
  }

  // Back to Hub Buttons
  backToHubBtns.forEach(btn => {
    btn.addEventListener('click', () => navigateTo('home'));
  });

  if (btnHeaderBackHub) {
    btnHeaderBackHub.addEventListener('click', () => navigateTo('home'));
  }

  if (navLogoLink) {
    navLogoLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('home');
    });
  }

  // Sound Mute Toggle (only shown in 3D arena)
  const soundBtn = document.getElementById('btn-toggle-sound');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (window.soundEngine) {
        const isMuted = window.soundEngine.toggleMute();
        if (isMuted) {
          soundIcon.innerText = '';
          soundLabel.innerText = 'SOUND: MUTED';
          soundBtn.style.opacity = '0.7';
        } else {
          soundIcon.innerText = '';
          soundLabel.innerText = 'SOUND: ON';
          soundBtn.style.opacity = '1';
          window.soundEngine.playDing();
        }
      }
    });
  }

  // Enable audio context on first user click anywhere (browser autoplay policy)
  document.body.addEventListener('click', () => {
    if (window.soundEngine) {
      window.soundEngine.init();
    }
  }, { once: true });

  // Initial load
  handleHash();
});
