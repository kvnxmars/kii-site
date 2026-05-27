// ===========================
// FEATURED DROP LOAD
// ===========================

function loadFeaturedDrop() {
  if (typeof releases === 'undefined' || releases.length === 0) return;
  
  // Find the first release with era="new"
  const featured = releases.find(r => r.era === 'new');
  if (!featured) return;
  
  const featuredImg = document.getElementById('featured-img');
  const featuredTitle = document.getElementById('featured-title');
  const featuredMeta = document.getElementById('featured-meta');
  const featuredBtn = document.getElementById('featured-btn');
  
  if (featuredImg) featuredImg.src = featured.image;
  if (featuredTitle) featuredTitle.textContent = featured.title;
  if (featuredMeta) featuredMeta.textContent = `${featured.type} • Out Now`;
  
  const releaseIndex = releases.indexOf(featured);
  if (featuredBtn) {
    featuredBtn.dataset.release = releaseIndex;
    featuredBtn.addEventListener('click', () => openPopup(releaseIndex));
  }
}

loadFeaturedDrop();

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
//const popupArt      = document.getElementById("popup-art");
const spotifyLink   = document.getElementById("spotify-link");
const appleLink     = document.getElementById("apple-link");


function openPopup(releaseIndex) {
  if (!popup || typeof releases === 'undefined') return;
  const release = releases[releaseIndex];
  if (!release) return;

  popupTitle.textContent     = release.title;
  if (popupTypeLabel) popupTypeLabel.textContent = release.type || 'Single';
  //if (popupArt)       popupArt.src = release.image || '';
  spotifyLink.href           = release.spotify;
  appleLink.href             = release.apple;

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

const videoPlaylist = document.getElementById('video-playlist');
const videoFrame  = document.getElementById('main-video-frame');
const vnpTitle    = document.getElementById('vnp-title');

function buildVideoPlaylist() {
  if (!videoPlaylist || typeof releases === 'undefined') return;
  
  // Only show music videos: ma ten'e and paan raaz
  const musicVideoTitles = ["ma ten'e", "Paan Raaz"];
  const videoReleases = releases.filter(r => musicVideoTitles.includes(r.title));
  
  if (videoReleases.length === 0) return;
  
  videoReleases.forEach((release, idx) => {
    // Convert YouTube link to embed URL
    let embedUrl = release.youtubeEmbed;
    if (!embedUrl && release.youtube) {
      // Convert various YouTube URL formats to embed URL
      let youtubeId = '';
      if (release.youtube.includes('youtube.com/embed/')) {
        youtubeId = release.youtube.split('youtube.com/embed/')[1];
      } else if (release.youtube.includes('youtube.com/watch?v=')) {
        youtubeId = release.youtube.split('v=')[1].split('&')[0];
      } else if (release.youtube.includes('youtu.be/')) {
        youtubeId = release.youtube.split('youtu.be/')[1].split('?')[0];
      } else if (release.youtube.includes('youtube.com/playlist')) {
        youtubeId = release.youtube.split('list=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/videoseries?list=${youtubeId}`;
      }
      
      if (youtubeId && !embedUrl) {
        embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
      }
    }
    
    if (!embedUrl) return;
    
    const vplItem = document.createElement('div');
    vplItem.className = 'vpl-item';
    vplItem.dataset.embed = embedUrl;
    vplItem.dataset.title = release.title;
    if (idx === 0) vplItem.classList.add('active');
    
    vplItem.innerHTML = `
      <div class="vpl-thumb">
        <img src="${release.image}" alt="${release.title}">
        <span class="vpl-play">▶</span>
      </div>
      <div class="vpl-info">
        <span class="vpl-name">${release.title}</span>
        <span class="vpl-type">${release.type}</span>
      </div>
    `;
    
    vplItem.addEventListener('click', () => {
      document.querySelectorAll('.vpl-item').forEach(i => i.classList.remove('active'));
      vplItem.classList.add('active');
      
      if (videoFrame) videoFrame.src = embedUrl;
      if (vnpTitle) vnpTitle.textContent = release.title;
    });
    
    videoPlaylist.appendChild(vplItem);
  });
  
  // Set initial video to ma ten'e
  if (videoReleases.length > 0) {
    const maTeneRelease = videoReleases.find(r => r.title === "ma ten'e");
    if (maTeneRelease && maTeneRelease.youtubeEmbed) {
      if (videoFrame) videoFrame.src = maTeneRelease.youtubeEmbed;
      if (vnpTitle) vnpTitle.textContent = "ma ten'e";
    }
  }
}

buildVideoPlaylist();