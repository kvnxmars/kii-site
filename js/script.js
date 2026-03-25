// ===========================
// SCROLL REVEAL
// ===========================

const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ===========================
// POPUP (music page only)
// ===========================

const popup    = document.getElementById("dsp-popup");
const closeBtn = document.getElementById("close-popup");

if (popup && closeBtn) {

  const popupTitle  = document.getElementById("popup-title");
  const spotifyLink = document.getElementById("spotify-link");
  const appleLink   = document.getElementById("apple-link");
  const youtubeLink = document.getElementById("youtube-link");

  const buttons = document.querySelectorAll(".listen-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const release = releases[button.dataset.release];

      popupTitle.textContent = "Listen to " + release.title;
      spotifyLink.href       = release.spotify;
      appleLink.href         = release.apple;
      youtubeLink.href       = release.youtube;

      popup.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("popup")) {
      popup.style.display = "none";
    }
  });
}