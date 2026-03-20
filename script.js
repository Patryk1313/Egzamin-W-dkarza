const sidebar = document.getElementById("sidebar");
const searchInput = document.getElementById("searchInput");
const sections = Array.from(document.querySelectorAll(".lesson"));
const navLinks = Array.from(document.querySelectorAll(".sidebar nav a"));
const progressFill = document.getElementById("progressFill");
const resultInfo = document.getElementById("resultInfo");

document.addEventListener("click", (event) => {
  const clickedInsideSidebar = sidebar.contains(event.target);
  if (!clickedInsideSidebar && window.innerWidth <= 1080) {
    sidebar.classList.remove("open");
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1080) {
      sidebar.classList.remove("open");
    }
  });
});

function setActiveLink() {
  const y = window.scrollY + 90;
  let activeId = "";

  sections.forEach((section) => {
    if (!section.classList.contains("hidden") && section.offsetTop <= y) {
      activeId = section.id;
    }
  });

  if (!activeId) {
    const firstVisible = sections.find((section) => !section.classList.contains("hidden"));
    activeId = firstVisible ? firstVisible.id : "";
  }

  navLinks.forEach((link) => {
    const target = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", target === activeId);
  });
}

function setReadingProgress() {
  if (!progressFill) {
    return;
  }

  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressFill.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
}

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

searchInput.addEventListener("input", () => {
  const query = normalize(searchInput.value.trim());
  let visibleCount = 0;

  sections.forEach((section) => {
    const corpus = normalize(section.innerText + " " + (section.dataset.keywords || ""));
    const visible = query === "" || corpus.includes(query);
    section.classList.toggle("hidden", !visible);
    if (visible) {
      visibleCount += 1;
    }
  });

  navLinks.forEach((link) => {
    const id = link.getAttribute("href").replace("#", "");
    const targetSection = document.getElementById(id);
    const visible = targetSection && !targetSection.classList.contains("hidden");
    link.style.display = visible ? "block" : "none";
  });

  if (resultInfo) {
    if (query === "") {
      resultInfo.textContent = "Wszystkie dzialy widoczne";
    } else if (visibleCount > 0) {
      resultInfo.textContent = `Widoczne dzialy: ${visibleCount}/${sections.length}`;
    } else {
      resultInfo.textContent = "Brak wynikow - sproboj innego hasla";
    }
  }

  setActiveLink();
  setReadingProgress();
});

window.addEventListener("scroll", () => {
  setActiveLink();
  setReadingProgress();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1080) {
    sidebar.classList.remove("open");
  }
  setActiveLink();
  setReadingProgress();
});

setActiveLink();
setReadingProgress();