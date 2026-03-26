// ===========================
// SCROLL REVEAL
// ===========================

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

// ===========================
// RELEASE GRID (tabs)
// ===========================

const grid = document.getElementById('release-grid');

function buildCards(era) {
  if (!grid || typeof releases === 'undefined') return;
  grid.innerHTML = '';

  const filtered = era === 'all'
    ? releases
    : releases.filter(r => r.era === era);

  filtered.forEach((release, idx) => {
    const globalIdx = releases.indexOf(release);
    const isNew = release.era === 'new';

    const card = document.createElement('div');
    card.className = 'release-card reveal';
    card.dataset.era = release.era;
    card.style.animationDelay = (idx * 0.08) + 's';

    card.innerHTML = `
      ${isNew ? '<span class="drop-badge">NEW</span>' : ''}
      <div class="img-wrap">
        <img src="${release.image}" alt="${release.title} cover">
      </div>
      <h3>${release.title}</h3>
      <p class="release-type">${release.type}</p>
      <div class="release-buttons">
        <button class="listen-btn" data-release="${globalIdx}">Listen Now</button>
      </div>
    `;
    grid.appendChild(card);

    // re-observe for scroll reveal
    revealObserver.observe(card);
  });

  // re-attach listen btn listeners
  attachListenBtns();
}

// Era tabs
const eraTabs = document.querySelectorAll('.era-tab');
eraTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    eraTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    buildCards(tab.dataset.era);
  });
});

// Initial build
if (grid) buildCards('new');

// ===========================
// POPUP
// ===========================

const popup         = document.getElementById("dsp-popup");
const closeBtn      = document.getElementById("close-popup");
const popupTitle    = document.getElementById("popup-title");
const popupTypeLabel= document.getElementById("popup-type-label");
const popupArt      = document.getElementById("popup-art");
const spotifyLink   = document.getElementById("spotify-link");
const appleLink     = document.getElementById("apple-link");
const youtubeLink   = document.getElementById("youtube-link");

function openPopup(releaseIndex) {
  if (!popup || typeof releases === 'undefined') return;
  const release = releases[releaseIndex];
  if (!release) return;

  popupTitle.textContent     = release.title;
  if (popupTypeLabel) popupTypeLabel.textContent = release.type || 'Single';
  if (popupArt)       popupArt.src = release.image || '';
  spotifyLink.href           = release.spotify;
  appleLink.href             = release.apple;
  youtubeLink.href           = release.youtube;

  popup.style.display = "flex";
}

function attachListenBtns() {
  document.querySelectorAll(".listen-btn").forEach(btn => {
    // clone to clear old listeners
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener("click", () => openPopup(parseInt(fresh.dataset.release)));
  });
}

// Initial attach (for featured drop btn and any static btns)
attachListenBtns();

if (popup && closeBtn) {
  closeBtn.addEventListener("click", () => { popup.style.display = "none"; });
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("popup")) popup.style.display = "none";
  });
}

// ===========================
// VIDEO PLAYLIST SWITCHER
// ===========================

const vplItems    = document.querySelectorAll('.vpl-item');
const videoFrame  = document.getElementById('main-video-frame');
const vnpTitle    = document.getElementById('vnp-title');

vplItems.forEach(item => {
  item.addEventListener('click', () => {
    vplItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    if (videoFrame) videoFrame.src = item.dataset.embed;
    if (vnpTitle)   vnpTitle.textContent = item.dataset.title;
  });
});