import { H as Hls } from "./hls-dru42stk.js";

const menuButton = document.querySelector(".menu-toggle");
const mobilePanel = document.querySelector(".mobile-panel");

if (menuButton && mobilePanel) {
  menuButton.addEventListener("click", () => {
    mobilePanel.classList.toggle("open");
  });
}

const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll(".hero-dot"));
let slideIndex = 0;

function showSlide(index) {
  if (!slides.length) return;
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, current) => {
    slide.classList.toggle("active", current === slideIndex);
  });
  dots.forEach((dot, current) => {
    dot.classList.toggle("active", current === slideIndex);
  });
}

if (slides.length) {
  showSlide(0);
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });
  window.setInterval(() => showSlide(slideIndex + 1), 5200);
}

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function applyCardFilter(root = document) {
  const input = root.querySelector("[data-filter-input]");
  const sort = root.querySelector("[data-sort-select]");
  const cards = Array.from(root.querySelectorAll("[data-title][data-year]"));
  const grid = root.querySelector("[data-card-grid]");
  const empty = root.querySelector("[data-empty-state]");

  if (!cards.length) return;

  const run = () => {
    const keyword = normalizeText(input ? input.value : "");
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = normalizeText(card.textContent + " " + card.dataset.title + " " + card.dataset.category);
      const matched = !keyword || haystack.includes(keyword);
      card.style.display = matched ? "" : "none";
      if (matched) visibleCount += 1;
    });

    if (sort && grid) {
      const sorted = cards.slice().sort((a, b) => {
        if (sort.value === "heat") return Number(b.dataset.heat) - Number(a.dataset.heat);
        if (sort.value === "title") return a.dataset.title.localeCompare(b.dataset.title, "zh-Hans-CN");
        return Number(b.dataset.year) - Number(a.dataset.year);
      });
      sorted.forEach((card) => grid.appendChild(card));
    }

    if (empty) {
      empty.style.display = visibleCount ? "none" : "block";
    }
  };

  if (input) input.addEventListener("input", run);
  if (sort) sort.addEventListener("change", run);
  run();
}

applyCardFilter(document);

const heroSearchForms = Array.from(document.querySelectorAll("[data-hero-search]"));
heroSearchForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const query = encodeURIComponent(input ? input.value.trim() : "");
    const prefix = form.dataset.prefix || "./";
    window.location.href = `${prefix}search.html${query ? `?q=${query}` : ""}`;
  });
});

const searchInput = document.querySelector("[data-filter-input]");
if (searchInput) {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q && !searchInput.value) {
    searchInput.value = q;
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function setupPlayer(video, source, mp4Source) {
  if (!video || video.dataset.ready === "1") return;
  video.dataset.ready = "1";

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
  } else if (Hls && Hls.isSupported()) {
    const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
    hls.loadSource(source);
    hls.attachMedia(video);
  } else if (mp4Source) {
    video.src = mp4Source;
  }
}

const playButtons = Array.from(document.querySelectorAll("[data-play-button]"));
playButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const wrap = button.closest(".video-wrap");
    const video = wrap ? wrap.querySelector("video") : null;
    if (!video) return;

    setupPlayer(video, button.dataset.stream, button.dataset.mp4);
    button.style.display = "none";

    try {
      await video.play();
    } catch (error) {
      video.setAttribute("controls", "controls");
    }
  });
});
