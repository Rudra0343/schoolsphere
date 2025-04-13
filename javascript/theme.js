// Theme handling
function initTheme() {
  const toggleBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  // Apply saved theme on page load
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleBtn.querySelector('i').textContent = "brightness_7";
  }

  // Handle theme toggle
  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleBtn.querySelector('i').textContent = isDark ? "brightness_7" : "brightness_4";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);