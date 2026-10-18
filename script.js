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

  //   Filter

  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-category]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      projectCards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });
    });
  });

  // Form Validation

  const form = document.querySelector("#contact-form");

  if (form) {
    const fields = {
      name: form.querySelector("#name"),
      email: form.querySelector("#email"),
      projectType: form.querySelector("#project-type"),
      message: form.querySelector("#message"),
    };
    const status = form.querySelector("#form-status");
    const submitButton = form.querySelector('button[type="submit"]');

    const validators = {
      name(value) {
        if (!value) return "Please enter your name.";
        if (value.length < 2) return "Name must be at least 2 characters.";
        if (value.length > 60) return "Name is too long.";
        if (!/^[a-zA-ZÀ-ÿ'’ -]+$/.test(value))
          return "Letters, spaces, hyphens and apostrophes only.";
        return "";
      },
      email(value) {
        if (!value) return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value))
          return "Enter a valid email, e.g. name@example.com.";
        return "";
      },
      projectType(value) {
        if (!value) return "Please choose a project type.";
        return "";
      },
      message(value) {
        if (!value) return "Please tell us a little about your project.";
        if (value.length < 20)
          return `At least 20 characters — ${20 - value.length} more to go.`;
        if (value.length > 1000) return "Please keep it under 1000 characters.";
        return "";
      },
    };

    function setError(field, message) {
      const errorEl = document.getElementById(`${field.id}-error`);
      const wrapper = field.closest(".form-field");

      field.setAttribute("aria-invalid", String(Boolean(message)));
      if (errorEl) errorEl.textContent = message;
      wrapper?.classList.toggle("has-error", Boolean(message));
      wrapper?.classList.toggle(
        "is-valid",
        !message && field.value.trim() !== "",
      );

      return !message;
    }

    function validateField(key) {
      const field = fields[key];
      return setError(field, validators[key](field.value.trim()));
    }

    function clearStatus() {
      if (!status) return;
      status.textContent = "";
      status.classList.remove("is-error", "is-success");
    }

    Object.entries(fields).forEach(([key, field]) => {
      const eventName = field.tagName === "SELECT" ? "change" : "input";

      field.addEventListener(eventName, () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(key);
        clearStatus();
      });

      field.addEventListener("blur", () => {
        if (field.value.trim() !== "") validateField(key);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const results = Object.keys(fields).map(validateField);
      const errorCount = results.filter((r) => !r).length;

      if (errorCount > 0) {
        if (status) {
          status.classList.add("is-error");
          status.classList.remove("is-success");
        }
        Object.values(fields)
          .find((f) => f.getAttribute("aria-invalid") === "true")
          ?.focus();
        return;
      }

      const firstName = fields.name.value.trim().split(" ")[0];
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Checking…";
      }

      window.setTimeout(() => {
        form.reset();
        Object.values(fields).forEach((field) => {
          field.removeAttribute("aria-invalid");
          field
            .closest(".form-field")
            ?.classList.remove("has-error", "is-valid");
        });

        if (status) {
          status.classList.remove("is-error");
          status.classList.add("is-success");
        }
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML =
            'Check my enquiry <span aria-hidden="true">↗</span>';
        }
      }, 900);
    });
  }

  // Footer year
  document.querySelectorAll(".year").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  // Scroll to top

  const topButton = document.querySelector(".back-to-top");

  if (topButton) {
    const updateTopButton = () => {
      topButton.classList.toggle("is-visible", window.scrollY > 450);
    };

    window.addEventListener("scroll", updateTopButton, { passive: true });
    updateTopButton();

    topButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    });
  }
});
