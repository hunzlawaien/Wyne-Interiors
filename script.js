document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Typing Animation

  const typingText = document.querySelector("#typing-text");

  if (typingText && !reducedMotion.matches) {
    const phrases = (typingText.dataset.words || "").split("|").filter(Boolean);

    if (phrases.length > 1) {
      let phraseIndex = 0;
      let letterIndex = phrases[0].length;
      let deleting = true;

      const typeNext = () => {
        const phrase = phrases[phraseIndex];
        letterIndex += deleting ? -1 : 1;
        typingText.textContent = phrase.slice(0, letterIndex);

        let delay = deleting ? 48 : 85;

        if (letterIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 320;
        } else if (letterIndex === phrases[phraseIndex].length && !deleting) {
          deleting = true;
          delay = 2200;
        }

        window.setTimeout(typeNext, delay);
      };

      window.setTimeout(typeNext, 2200);
    }
  }

  // Dark Mode

  const themeButton = document.querySelector(".theme-toggle");

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (themeButton) {
      const dark = theme === "dark";

      themeButton.innerHTML = dark
        ? '<i class="fa-regular fa-sun"></i>'
        : '<i class="fa-regular fa-moon"></i>';

      themeButton.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode",
      );
    }
  }

  const savedTheme = localStorage.getItem("atelier-theme") || "light";
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  themeButton?.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("atelier-theme", nextTheme);
  });

  //   Image Sliders

  const slider = document.querySelector(".project-slider");

  if (slider) {
    const slides = [...slider.querySelectorAll(".slide")];
    const dots = [...slider.querySelectorAll(".slider-dots button")];
    const previous = slider.querySelector(".slider-prev");
    const next = slider.querySelector(".slider-next");

    if (slides.length && slides.length === dots.length) {
      let current = 0;
      let autoplay;

      function showSlide(index) {
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
          const active = i === current;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", String(!active));
          dots[i].classList.toggle("is-active", active);

          if (active) {
            dots[i].setAttribute("aria-current", "true");
          } else {
            dots[i].removeAttribute("aria-current");
          }
        });
      }

      function stopAutoplay() {
        window.clearInterval(autoplay);
      }

      function startAutoplay() {
        stopAutoplay();
        if (!reducedMotion.matches && !document.hidden) {
          autoplay = window.setInterval(() => showSlide(current + 1), 5500);
        }
      }

      previous?.addEventListener("click", () => {
        showSlide(current - 1);
        startAutoplay();
      });

      next?.addEventListener("click", () => {
        showSlide(current + 1);
        startAutoplay();
      });

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          showSlide(index);
          startAutoplay();
        });
      });

      slider.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          showSlide(current + (event.key === "ArrowRight" ? 1 : -1));
          startAutoplay();
        }
      });

      slider.addEventListener("mouseenter", stopAutoplay);
      slider.addEventListener("mouseleave", startAutoplay);
      slider.addEventListener("focusin", stopAutoplay);
      slider.addEventListener("focusout", (event) => {
        if (!slider.contains(event.relatedTarget)) startAutoplay();
      });
      document.addEventListener("visibilitychange", () => {
        document.hidden ? stopAutoplay() : startAutoplay();
      });

      startAutoplay();
    }
  }

  //   Counters

  const counters = document.querySelectorAll(".counter");

  function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";

    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";

    if (!Number.isFinite(target)) return;

    if (reducedMotion.matches) {
      counter.textContent = `${target}${suffix}`;
      return;
    }

    const start = performance.now();
    const duration = 1300;

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased)}${suffix}`;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 },
      );

      counters.forEach((counter) => observer.observe(counter));
    } else {
      counters.forEach(animateCounter);
    }
  }

  // FAQ

  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answer = document.getElementById(
        button.getAttribute("aria-controls"),
      );
      if (!answer) return;

      const opening = button.getAttribute("aria-expanded") !== "true";

      faqButtons.forEach((otherButton) => {
        const otherAnswer = document.getElementById(
          otherButton.getAttribute("aria-controls"),
        );

        otherButton.setAttribute("aria-expanded", "false");
        otherButton.querySelector("span").textContent = "+";
        if (otherAnswer) otherAnswer.hidden = true;
      });

      button.setAttribute("aria-expanded", String(opening));
      button.querySelector("span").textContent = opening ? "−" : "+";
      answer.hidden = !opening;
    });
  });
});
