/* Handcrafted interactions: no external animation dependencies. */
const $ = (selector, scope = document) => scope.querySelector(selector);
const letter = `Sometimes I wonder how someone could unknowingly become the reason behind so many smiles.

Ever since I met you, everything has felt different.

The little moments.
The conversations.
Even the silence.

Everything became special because you were there.

I don't know what the future has waiting for us.

But I know one thing.

If I get to walk through it with you,

I'll always be the luckiest person alive.

No matter how many years pass,

I'll never stop choosing you.

I love you more than words could ever explain.`;

window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 500));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('in-view');
  if (entry.target.classList.contains('letter-paper') && !entry.target.dataset.typed) typeLetter();
  observer.unobserve(entry.target);
}), { threshold: .16 });
document.querySelectorAll('.reveal, .ending').forEach(element => observer.observe(element));

function typeLetter() {
  const output = $('#typed-letter');
  const paper = output.closest('.letter-paper');
  paper.dataset.typed = 'true';
  let index = 0;
  const write = () => {
    output.textContent = letter.slice(0, ++index);
    if (index < letter.length) setTimeout(write, letter[index] === '\n' ? 45 : 14);
  };
  write();
}

const start = new Date(2026, 6, 25, 20, 0, 0);
function updateTimer() {
  const now = new Date();
  let totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
  let anchor = new Date(start.getFullYear(), start.getMonth() + totalMonths, start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds());

  // A month only completes on the same day and time as the start date.
  if (now < anchor) {
    totalMonths--;
    anchor = new Date(start.getFullYear(), start.getMonth() + totalMonths, start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds());
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  let diff = Math.max(0, now - anchor); const units = { days: Math.floor(diff / 86400000) };
  diff %= 86400000; units.hours = Math.floor(diff / 3600000); diff %= 3600000; units.minutes = Math.floor(diff / 60000); units.seconds = Math.floor((diff % 60000) / 1000);
  Object.entries({ years, months, ...units }).forEach(([unit, value]) => { const el = $(`[data-unit="${unit}"]`); const text = String(value).padStart(2, '0'); if (el.textContent !== text) { el.textContent = text; el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); } });
}
updateTimer(); setInterval(updateTimer, 1000);

const canvas = $('#sky'), context = canvas.getContext('2d'); let stars = [];
function resizeSky() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; context.scale(devicePixelRatio, devicePixelRatio); stars = Array.from({ length: Math.min(140, Math.floor(innerWidth / 8)) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.25 + .15, a: Math.random() })); }
function drawSky() { context.clearRect(0, 0, innerWidth, innerHeight); stars.forEach(s => { s.a += .014; context.fillStyle = `rgba(255,225,235,${.2 + Math.sin(s.a) * .18})`; context.beginPath(); context.arc(s.x, s.y, s.r, 0, Math.PI * 2); context.fill(); }); requestAnimationFrame(drawSky); }
resizeSky(); drawSky(); addEventListener('resize', resizeSky);

const glow = $('.cursor-glow'); addEventListener('pointermove', e => { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; });
addEventListener('click', e => { const spark = document.createElement('i'); spark.textContent = '✦'; spark.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;color:#ffd700;pointer-events:none;z-index:10;animation:burst .55s forwards`; document.body.append(spark); setTimeout(() => spark.remove(), 550); });
const song = $('#loveSong');
const sound = $('#soundToggle');
const playerButton = $('#playerButton');
function setPlayerState(playing) {
  sound.setAttribute('aria-pressed', playing);
  $('span', sound).textContent = playing ? 'on' : 'off';
  playerButton.textContent = playing ? 'Ⅱ' : '▶';
  playerButton.setAttribute('aria-label', playing ? 'Pause our song' : 'Play our song');
}
async function toggleSong() {
  if (song.paused) {
    try { await song.play(); setPlayerState(true); $('#musicStatus').textContent = 'Now Playing'; }
    catch { $('#musicStatus').textContent = 'Add audio/our-song.mp3'; }
  } else { song.pause(); setPlayerState(false); }
}
sound.addEventListener('click', toggleSong);
playerButton.addEventListener('click', toggleSong);
song.addEventListener('ended', () => setPlayerState(false));
