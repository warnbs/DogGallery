/* ==========================================================
   Our Dogs — script.js

   >>> TO USE YOUR OWN PHOTOS: edit the DOGS array below. <<<
   - Put your image files in an "images" folder next to home.html
     and use paths like "images/chooey-1.jpg", or paste full URLs.
   - "cover" is the picture shown on the homepage card.
   - Add or remove photos freely; each needs a "src" and a "caption".
   ========================================================== */

const DOGS = [
  {
    id: "chooey",
    name: "Chooey",
    emoji: "🐶",
    blurb: "The sunny goofball",
    subtitle: "Golden retriever · Professional tail-wagger",
    color: "#ffd9c0", // card border (peach)
    cover: "https://placedog.net/600/600?id=11",
    photos: [
      { src: "https://placedog.net/800/600?id=11", caption: "Chooey's very first beach day" },
      { src: "https://placedog.net/800/600?id=12", caption: "Caught mid-zoomies in the garden" },
      { src: "https://placedog.net/800/600?id=13", caption: "Nap time on the good couch" },
      { src: "https://placedog.net/800/600?id=14", caption: "Waiting (im)patiently for dinner" },
    ],
  },
  {
    id: "chopper",
    name: "Chopper",
    emoji: "🐕",
    blurb: "The cuddly sweetheart",
    subtitle: "Shih tzu mix · Chief of snuggles",
    color: "#cfe3cf", // sage
    cover: "https://placedog.net/600/600?id=21",
    photos: [
      { src: "https://placedog.net/800/600?id=21", caption: "Fresh from the groomer" },
      { src: "https://placedog.net/800/600?id=22", caption: "Guarding the pillow fort" },
      { src: "https://placedog.net/800/600?id=23", caption: "Sunbathing on the porch" },
    ],
  },
  {
    id: "chimmy",
    name: "Chimmy",
    emoji: "🐩",
    blurb: "The speedy explorer",
    subtitle: "Border collie · Ball enthusiast",
    color: "#f7c6d0", // soft pink, the only girl
    cover: "https://placedog.net/600/600?id=31",
    photos: [
      { src: "https://placedog.net/800/600?id=31", caption: "Hiking with the family" },
      { src: "https://placedog.net/800/600?id=32", caption: "Ball? Did someone say ball?" },
      { src: "https://placedog.net/800/600?id=33", caption: "Splashing through puddles" },
      { src: "https://placedog.net/800/600?id=34", caption: "Tired after a big adventure" },
      { src: "https://placedog.net/800/600?id=35", caption: "Chimmy's serious photo face" },
    ],
  },
  {
    id: "cheeko",
    name: "Cheeko",
    emoji: "🦮",
    blurb: "The gentle old soul",
    subtitle: "Labrador · Treat negotiator",
    color: "#fff0b8", // butter
    cover: "https://placedog.net/600/600?id=41",
    photos: [
      { src: "https://placedog.net/800/600?id=41", caption: "Cheeko wearing his birthday bandana" },
      { src: "https://placedog.net/800/600?id=42", caption: "Looking very innocent" },
      { src: "https://placedog.net/800/600?id=43", caption: "Best buddies on a walk" },
    ],
  },
];

/* ==========================================================
   Everything below is app logic — no need to edit.
   ========================================================== */

// Inline paw-print placeholder, used if an image fails to load.
const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
      '<rect width="400" height="300" fill="#fdeedb"/>' +
      '<g fill="#f7b998"><ellipse cx="200" cy="185" rx="55" ry="45"/>' +
      '<ellipse cx="130" cy="130" rx="22" ry="30"/><ellipse cx="180" cy="95" rx="22" ry="30"/>' +
      '<ellipse cx="230" cy="95" rx="22" ry="30"/><ellipse cx="280" cy="130" rx="22" ry="30"/></g>' +
      "</svg>"
  );

// ----- State -----
const state = {
  view: "home", // "home" | "album"
  dogId: null,
  lightboxIndex: null,
};

// ----- DOM references -----
const els = {
  homeView: document.getElementById("home-view"),
  albumView: document.getElementById("album-view"),
  albumGrid: document.getElementById("album-grid"),
  albumTitle: document.getElementById("album-title"),
  albumSub: document.getElementById("album-sub"),
  photoGrid: document.getElementById("photo-grid"),
  backBtn: document.getElementById("back-btn"),
  lightbox: document.getElementById("lightbox"),
  lightboxImg: document.getElementById("lightbox-img"),
  lightboxCaption: document.getElementById("lightbox-caption"),
  lightboxClose: document.getElementById("lightbox-close"),
  lightboxPrev: document.getElementById("lightbox-prev"),
  lightboxNext: document.getElementById("lightbox-next"),
  year: document.getElementById("year"),
};

// ----- Helpers -----
function getDog(id) {
  return DOGS.find((d) => d.id === id) || null;
}

function makeImg(src, alt) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  img.addEventListener("error", () => {
    img.src = FALLBACK_IMG; // swap in the paw placeholder
  }, { once: true });
  return img;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ----- Rendering: home -----
function renderHome() {
  els.albumGrid.replaceChildren();

  DOGS.forEach((dog) => {
    const li = el("li");
    const card = el("button", "album-card");
    card.type = "button";
    card.style.setProperty("--accent", dog.color);
    card.setAttribute("aria-label", `Open ${dog.name}'s album, ${dog.photos.length} photos`);
    card.addEventListener("click", () => openAlbum(dog.id));

    const cover = el("div", "album-cover");
    cover.append(makeImg(dog.cover, `${dog.name} album cover`));
    cover.append(el("span", "album-badge", `📷 ${dog.photos.length}`));

    card.append(
      cover,
      el("h3", "album-name", `${dog.name} ${dog.emoji}`),
      el("p", "album-blurb", dog.blurb)
    );

    li.append(card);
    els.albumGrid.append(li);
  });
}

// ----- Rendering: album -----
function renderAlbum(dog) {
  els.albumTitle.replaceChildren();
  const emoji = el("span", "dog-emoji", dog.emoji);
  emoji.setAttribute("aria-hidden", "true");
  els.albumTitle.append(emoji, ` ${dog.name}'s Album`);
  els.albumSub.textContent = dog.subtitle;

  els.photoGrid.replaceChildren();

  if (!dog.photos.length) {
    els.photoGrid.append(el("li", "empty-note", "No photos yet — add some in script.js! 🐾"));
    return;
  }

  dog.photos.forEach((photo, index) => {
    const li = el("li");
    const fig = el("figure", "photo-card");

    const btn = el("button", "photo-btn");
    btn.type = "button";
    btn.setAttribute("aria-label", `View larger: ${photo.caption}`);
    btn.append(makeImg(photo.src, photo.caption));
    btn.addEventListener("click", () => openLightbox(index));

    fig.append(btn, el("figcaption", "", photo.caption));
    li.append(fig);
    els.photoGrid.append(li);
  });
}

// ----- View switching -----
function showView(view) {
  state.view = view;
  els.homeView.hidden = view !== "home";
  els.albumView.hidden = view !== "album";
}

function openAlbum(id) {
  location.hash = id; // handled by the hashchange listener (also enables the browser Back button)
}

function goHome() {
  // Use history if we navigated here from home; otherwise just clear the hash.
  location.hash = "";
}

function applyRoute() {
  const id = decodeURIComponent(location.hash.replace(/^#/, ""));
  const dog = getDog(id);

  closeLightbox();

  if (dog) {
    state.dogId = dog.id;
    renderAlbum(dog);
    showView("album");
    document.title = `${dog.name} · Our Dogs`;
  } else {
    state.dogId = null;
    showView("home");
    document.title = "Our Dogs · Family Photo Gallery";
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ----- Lightbox -----
function openLightbox(index) {
  const dog = getDog(state.dogId);
  if (!dog) return;
  const count = dog.photos.length;
  state.lightboxIndex = (index + count) % count;

  const photo = dog.photos[state.lightboxIndex];
  els.lightboxImg.src = photo.src;
  els.lightboxImg.alt = photo.caption;
  els.lightboxImg.onerror = () => { els.lightboxImg.src = FALLBACK_IMG; };
  els.lightboxCaption.textContent = photo.caption;
  els.lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  els.lightboxClose.focus();
}

function closeLightbox() {
  if (state.lightboxIndex === null) return;
  state.lightboxIndex = null;
  els.lightbox.hidden = true;
  document.body.style.overflow = "";
}

function stepLightbox(delta) {
  if (state.lightboxIndex === null) return;
  openLightbox(state.lightboxIndex + delta);
}

// ----- Events -----
els.backBtn.addEventListener("click", goHome);
els.lightboxClose.addEventListener("click", closeLightbox);
els.lightboxPrev.addEventListener("click", () => stepLightbox(-1));
els.lightboxNext.addEventListener("click", () => stepLightbox(1));

els.lightbox.addEventListener("click", (e) => {
  if (e.target === els.lightbox) closeLightbox(); // click on the dark backdrop
});

document.addEventListener("keydown", (e) => {
  if (state.lightboxIndex !== null) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  } else if (e.key === "Escape" && state.view === "album") {
    goHome();
  }
});

window.addEventListener("hashchange", applyRoute);

// ----- Init -----
function init() {
  els.year.textContent = new Date().getFullYear();
  renderHome();
  applyRoute();
}

init();