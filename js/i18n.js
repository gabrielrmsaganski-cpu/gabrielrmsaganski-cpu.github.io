(function bootstrapI18n() {
  const SUPPORTED_LANGUAGES = ["en", "pt"];
  const STORAGE_KEY = "portfolio-language";
  const cache = new Map();
  const listeners = new Set();
  let currentLanguage = "en";

  function readPath(object, path) {
    return path.split(".").reduce((result, segment) => {
      if (result && Object.prototype.hasOwnProperty.call(result, segment)) {
        return result[segment];
      }
      return undefined;
    }, object);
  }

  async function loadLocale(language) {
    if (cache.has(language)) {
      return cache.get(language);
    }

    const response = await fetch(`./locales/${language}.json`);
    if (!response.ok) {
      throw new Error(`Unable to load locale: ${language}`);
    }

    const locale = await response.json();
    cache.set(language, locale);
    return locale;
  }

  function applyTextTranslations(locale) {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const value = readPath(locale, key);
      if (typeof value === "string") {
        node.textContent = value;
      }
    });
  }

  function applyAttributeTranslations(locale) {
    document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
      const mappings = node
        .getAttribute("data-i18n-attr")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

      mappings.forEach((mapping) => {
        const separatorIndex = mapping.indexOf(":");
        if (separatorIndex === -1) {
          return;
        }

        const attribute = mapping.slice(0, separatorIndex).trim();
        const key = mapping.slice(separatorIndex + 1).trim();
        const value = readPath(locale, key);

        if (typeof value === "string") {
          node.setAttribute(attribute, value);
        }
      });
    });
  }

  function applyMetaTranslations(locale) {
    const metaTitle = readPath(locale, "meta.title");
    const metaDescription = readPath(locale, "meta.description");
    const ogTitle = readPath(locale, "meta.ogTitle");
    const ogDescription = readPath(locale, "meta.ogDescription");
    const twitterTitle = readPath(locale, "meta.twitterTitle");
    const twitterDescription = readPath(locale, "meta.twitterDescription");

    if (metaTitle) {
      document.title = metaTitle;
      const titleNode = document.getElementById("pageTitle");
      if (titleNode) {
        titleNode.textContent = metaTitle;
      }
    }

    const descriptionNode = document.getElementById("metaDescription");
    if (descriptionNode && metaDescription) {
      descriptionNode.setAttribute("content", metaDescription);
    }

    const ogTitleNode = document.getElementById("metaOgTitle");
    if (ogTitleNode && ogTitle) {
      ogTitleNode.setAttribute("content", ogTitle);
    }

    const ogDescriptionNode = document.getElementById("metaOgDescription");
    if (ogDescriptionNode && ogDescription) {
      ogDescriptionNode.setAttribute("content", ogDescription);
    }

    const twitterTitleNode = document.getElementById("metaTwitterTitle");
    if (twitterTitleNode && twitterTitle) {
      twitterTitleNode.setAttribute("content", twitterTitle);
    }

    const twitterDescriptionNode = document.getElementById("metaTwitterDescription");
    if (twitterDescriptionNode && twitterDescription) {
      twitterDescriptionNode.setAttribute("content", twitterDescription);
    }

    const structuredDataNode = document.getElementById("structuredData");
    if (structuredDataNode) {
      structuredDataNode.textContent = JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: readPath(locale, "brand.name"),
          jobTitle: readPath(locale, "brand.subtitle"),
          url: "https://gabrielrmsaganski-cpu.github.io/",
          sameAs: [
            "https://github.com/gabrielrmsaganski-cpu",
            "https://www.linkedin.com/in/gabriel-saganski/"
          ]
        },
        null,
        2
      );
    }
  }

  function syncToggleState(language) {
    document.querySelectorAll("[data-language]").forEach((button) => {
      const isActive = button.getAttribute("data-language") === language;
      button.classList.toggle("language-switch__button--active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function applyLocale(locale, language) {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    applyTextTranslations(locale);
    applyAttributeTranslations(locale);
    applyMetaTranslations(locale);
    syncToggleState(language);
  }

  async function setLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return;
    }

    const locale = await loadLocale(language);
    currentLanguage = language;
    localStorage.setItem(STORAGE_KEY, language);
    applyLocale(locale, language);
    listeners.forEach((listener) => listener(locale, language));
  }

  function getStoredLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }

    const browserLanguage = navigator.language.toLowerCase();
    return browserLanguage.startsWith("pt") ? "pt" : "en";
  }

  function bindToggle() {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => {
        const language = button.getAttribute("data-language");
        if (language && language !== currentLanguage) {
          setLanguage(language);
        }
      });
    });
  }

  async function init() {
    await Promise.all(SUPPORTED_LANGUAGES.map((language) => loadLocale(language)));
    bindToggle();
    await setLanguage(getStoredLanguage());
  }

  function onChange(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  window.PortfolioI18n = {
    init,
    onChange,
    setLanguage,
    getCurrentLanguage() {
      return currentLanguage;
    }
  };
})();
