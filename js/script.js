const popup = document.getElementById("dsp-popup");

const popupTitle = document.getElementById("popup-title");

const spotifyLink = document.getElementById("spotify-link");
const appleLink = document.getElementById("apple-link");
const youtubeLink = document.getElementById("youtube-link");

const closeBtn = document.getElementById("close-popup");

const buttons = document.querySelectorAll(".listen-btn");

buttons.forEach(button => {

button.addEventListener("click", () => {

const releaseIndex = button.dataset.release;

const release = releases[releaseIndex];

popupTitle.textContent = "Listen to " + release.title;

spotifyLink.href = release.spotify;
appleLink.href = release.apple;
youtubeLink.href = release.youtube;

popup.style.display = "flex";

});

});

closeBtn.addEventListener("click", () => {

popup.style.display = "none";

});

window.addEventListener("click",(e)=>{

if(e.target.classList.contains("popup")){

popup.style.display="none";

}

});