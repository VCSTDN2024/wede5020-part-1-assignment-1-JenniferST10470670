console.log("✅ JavaScript linked successfully!");
// -------------------- Part 3: Accordion (Essentials page) --------------------
document.addEventListener("DOMContentLoaded", function () {
  // Only run on essentials page (by filename or title)
  const onEssentials =
    location.pathname.toLowerCase().includes("essentials.html") ||
    document.title.toLowerCase().includes("essentials");

  if (!onEssentials) return;

  const buttons = document.querySelectorAll(".accordion-btn");
  const panels  = document.querySelectorAll(".accordion-panel");

  function closeAll() {
    buttons.forEach(btn => btn.setAttribute("aria-expanded", "false"));
    panels.forEach(p => p.hidden = true);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      const id = this.getAttribute("aria-controls");
      const panel = document.getElementById(id);

      // Single-open behaviour: close others then toggle this one
      closeAll();
      if (!expanded && panel) {
        this.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        this.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  });
});

