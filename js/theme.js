import { loadTheme, saveTheme } from "./storage.js?v=3";

// ========== Light/dark theme toggle ==========
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggle.textContent = theme === "dark" ? "☀️" : "🌙";
  toggle.setAttribute("aria-label", theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
}

const initialTheme = loadTheme(root.getAttribute("data-theme") || "light");
applyTheme(initialTheme);

toggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  saveTheme(next);
});
