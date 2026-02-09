// ====== COUNTDOWN ======
function updateCountdown() {
  const uzatu = new Date('2026-05-30T17:00:00+06:00');
  const now = new Date();
  const diff = uzatu - now;

  if (diff <= 0) {
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '0';
    document.getElementById('minutes').textContent = '0';
    document.getElementById('seconds').textContent = '0';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ====== SCROLL REVEAL ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ====== MUSIC ON FIRST INTERACTION ======
let musicStarted = false;
function startMusic() {
  if (musicStarted) return;
  musicStarted = true;
  const music = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  music.volume = 0.4;
  music.play().then(() => {
    btn.classList.add('playing');
  }).catch(() => {});
}

['click', 'touchstart', 'scroll'].forEach(evt => {
  document.addEventListener(evt, startMusic, { once: true, passive: true });
});

function toggleMusic(e) {
  e.stopPropagation();
  const music = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  if (music.paused) {
    music.play();
    btn.classList.add('playing');
  } else {
    music.pause();
    btn.classList.remove('playing');
  }
}

// ====== RSVP -> GOOGLE SHEETS ======
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

async function submitRSVP(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const errorEl = document.getElementById('form-error');

  btn.disabled = true;
  btn.textContent = 'Жіберілуде...';
  errorEl.classList.remove('show');

  const attendance = document.querySelector('input[name="attendance"]:checked');

  const data = {
    fullName: document.getElementById('fullname').value.trim(),
    attendance: attendance ? attendance.value : '',
    event: 'uzatu'
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    document.getElementById('rsvp-form').style.display = 'none';
    document.getElementById('form-success').classList.add('show');
  } catch (err) {
    errorEl.classList.add('show');
    btn.disabled = false;
    btn.textContent = 'Жауап беру';
  }
}
