function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

let revealObserver;
let navObserver;

function getProjectMedia(project) {
  return project.media || {
    eyebrow: project.category,
    summary: project.summary,
    image: "",
    alt: project.name,
    signals: (project.stack || []).slice(0, 3)
  };
}

function renderSignalTags(items, className = "media-tag") {
  return (items || [])
    .map((item) => `<span class="${className}">${escapeHtml(item)}</span>`)
    .join("");
}

function renderHeroSignals(locale) {
  const target = document.getElementById("heroSignals");
  target.innerHTML = locale.hero.signals
    .map(
      (signal, index) => `
        <article class="signal-card" data-reveal style="transition-delay:${index * 70}ms">
          <span class="signal-card__title">${escapeHtml(signal.title)}</span>
          <p class="signal-card__value">${escapeHtml(signal.value)}</p>
        </article>
      `
    )
    .join("");
}

function renderHeroPreview(locale) {
  const primaryTarget = document.getElementById("heroPreviewPrimary");
  const secondaryTarget = document.getElementById("heroPreviewSecondary");
  const featureProject =
    locale.flagshipProjects.find((project) => project.slug === "own-acquirer-panel") ||
    locale.flagshipProjects[0];
  const supportingProjects = locale.flagshipProjects.filter(
    (project) => project.slug !== featureProject.slug
  );
  const featureMedia = getProjectMedia(featureProject);

  primaryTarget.innerHTML = `
    <article class="hero-product hero-product--main" data-reveal>
      <div class="hero-product__chrome">
        <span class="hero-product__dots">
          <i></i><i></i><i></i>
        </span>
        <span class="hero-product__url">${escapeHtml(featureMedia.eyebrow)}</span>
      </div>
      <div class="hero-product__viewport">
        <img class="hero-product__image" src="${escapeHtml(featureMedia.image)}" alt="${escapeHtml(featureMedia.alt)}" loading="eager">
      </div>
      <div class="hero-product__overlay">
        <span class="card-kicker">${escapeHtml(locale.hero.visual.mapTitle)}</span>
        <strong>${escapeHtml(featureProject.name)}</strong>
        <p>${escapeHtml(featureMedia.summary)}</p>
        <div class="hero-product__signals">${renderSignalTags(featureMedia.signals)}</div>
      </div>
    </article>
  `;

  secondaryTarget.innerHTML = supportingProjects
    .map(
      (project, index) => {
        const media = getProjectMedia(project);

        return `
        <article class="hero-system-card hero-system-card--${escapeHtml(project.slug)}" data-reveal style="transition-delay:${index * 90}ms">
          <div class="hero-system-card__art">
            <img class="hero-system-card__image" src="${escapeHtml(media.image)}" alt="${escapeHtml(media.alt)}" loading="lazy">
          </div>
          <div class="hero-system-card__body">
            <span class="card-kicker">${escapeHtml(media.eyebrow)}</span>
            <strong>${escapeHtml(project.name)}</strong>
            <p>${escapeHtml(media.summary)}</p>
            <div class="hero-system-card__signals">${renderSignalTags(media.signals)}</div>
          </div>
        </article>
      `;
      }
    )
    .join("");

  const layersTarget = document.getElementById("heroPreviewLayers");
  layersTarget.innerHTML = locale.hero.visual.layers
    .map(
      (layer, index) => `
        <article class="preview-layer" data-reveal style="transition-delay:${index * 100}ms">
          <span class="preview-layer__label">${escapeHtml(layer.label)}</span>
          <strong>${escapeHtml(layer.value)}</strong>
        </article>
      `
    )
    .join("");
}

function renderFlagshipProjects(locale) {
  const target = document.getElementById("flagshipProjects");
  target.innerHTML = locale.flagshipProjects
    .map((project, index) => {
      const media = getProjectMedia(project);
      const stack = project.stack
        .map((item) => `<span class="badge">${escapeHtml(item)}</span>`)
        .join("");
      const highlights = project.highlights
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

      return `
        <article class="project-card project-card--${escapeHtml(project.slug)} ${index === 0 ? "project-card--feature" : ""}" data-reveal style="transition-delay:${index * 90}ms">
          <div class="project-card__media">
            <div class="project-card__media-surface">
              <img class="project-card__image" src="${escapeHtml(media.image)}" alt="${escapeHtml(media.alt)}" loading="lazy">
            </div>
            <div class="project-card__media-shade"></div>
            <div class="project-card__media-top">
              <span class="status-pill">${escapeHtml(project.status)}</span>
              <span class="media-chip">${escapeHtml(project.category)}</span>
            </div>
            <div class="project-card__media-body">
              <span class="card-kicker">${escapeHtml(media.eyebrow)}</span>
              <strong>${escapeHtml(project.name)}</strong>
              <p class="project-card__media-summary">${escapeHtml(media.summary)}</p>
              <div class="project-card__media-tags">${renderSignalTags(media.signals)}</div>
            </div>
          </div>

          <div class="project-card__body">
            <span class="card-kicker">${escapeHtml(project.category)}</span>
            <h3>${escapeHtml(project.name)}</h3>
            <p class="project-card__summary">${escapeHtml(project.summary)}</p>

            <div class="project-card__role">
              <span>${escapeHtml(locale.common.roleLabel)}</span>
              <p>${escapeHtml(project.role)}</p>
            </div>

            <div class="badge-row">${stack}</div>

            <div class="project-card__highlights">
              <span class="detail-label">${escapeHtml(locale.common.highlightsLabel)}</span>
              <ul class="project-highlights">${highlights}</ul>
            </div>

            <div class="project-card__links">
              <a class="project-link" href="#case-${escapeHtml(project.slug)}">${escapeHtml(locale.common.viewCaseStudy)}</a>
              <a class="project-link" href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noreferrer">${escapeHtml(locale.common.viewRepository)}</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderDomains(locale) {
  const target = document.getElementById("engineeringDomains");
  target.innerHTML = locale.domains
    .map(
      (domain, index) => `
        <article class="domain-card" data-reveal style="transition-delay:${index * 70}ms">
          <span class="card-kicker">${escapeHtml(locale.sections.domains.kicker)}</span>
          <h3>${escapeHtml(domain.title)}</h3>
          <p>${escapeHtml(domain.summary)}</p>
          <div class="detail-block">
            <span class="detail-label">${escapeHtml(locale.common.technologyLabel)}</span>
            <div class="badge-row">
              ${domain.technologies.map((item) => `<span class="badge badge--muted">${escapeHtml(item)}</span>`).join("")}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPhilosophy(locale) {
  const target = document.getElementById("architecturePhilosophy");
  target.innerHTML = locale.philosophy
    .map(
      (item, index) => `
        <article class="philosophy-card" data-reveal style="transition-delay:${index * 60}ms">
          <span class="philosophy-card__index">0${index + 1}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary)}</p>
        </article>
      `
    )
    .join("");
}

function renderCaseStudies(locale) {
  const target = document.getElementById("caseStudies");
  target.innerHTML = locale.caseStudies
    .map(
      (study, index) => `
        <article id="case-${escapeHtml(study.slug)}" class="case-study" data-reveal style="transition-delay:${index * 80}ms">
          <div class="case-study__header">
            <div>
              <span class="card-kicker">${escapeHtml(locale.common.caseStudyLabel)}</span>
              <h3>${escapeHtml(study.projectName)}</h3>
            </div>
            <a class="project-link" href="${escapeHtml(locale.flagshipProjects[index].repoUrl)}" target="_blank" rel="noreferrer">${escapeHtml(locale.common.viewRepository)}</a>
          </div>

          <div class="case-study__grid">
            <section class="case-study__block">
              <span class="detail-label">${escapeHtml(locale.common.contextLabel)}</span>
              <p>${escapeHtml(study.context)}</p>
            </section>
            <section class="case-study__block">
              <span class="detail-label">${escapeHtml(locale.common.problemLabel)}</span>
              <p>${escapeHtml(study.problem)}</p>
            </section>
            <section class="case-study__block">
              <span class="detail-label">${escapeHtml(locale.common.architectureLabel)}</span>
              <p>${escapeHtml(study.architecture)}</p>
            </section>
            <section class="case-study__block">
              <span class="detail-label">${escapeHtml(locale.common.decisionsLabel)}</span>
              <ul class="case-study__decisions">
                ${study.decisions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </section>
            <section class="case-study__block case-study__block--wide">
              <span class="detail-label">${escapeHtml(locale.common.outcomeLabel)}</span>
              <p>${escapeHtml(study.outcome)}</p>
            </section>
          </div>
        </article>
      `
    )
    .join("");
}

function renderStack(locale) {
  const target = document.getElementById("technologyStack");
  target.innerHTML = locale.stackGroups
    .map(
      (group, index) => `
        <article class="stack-card" data-reveal style="transition-delay:${index * 60}ms">
          <span class="card-kicker">${escapeHtml(group.name)}</span>
          <h3>${escapeHtml(group.name)}</h3>
          <div class="badge-row badge-row--stack">
            ${group.items.map((item) => `<span class="badge">${escapeHtml(item)}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderGitHubProjects(locale) {
  const target = document.getElementById("githubProjects");
  target.innerHTML = locale.githubProjects
    .map(
      (project, index) => `
        <article class="repo-card" data-reveal style="transition-delay:${index * 60}ms">
          <div class="repo-card__header">
            <div>
              <span class="card-kicker">${escapeHtml(project.category)}</span>
              <h3>${escapeHtml(project.name)}</h3>
            </div>
            <a class="project-link" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">${escapeHtml(locale.common.viewRepository)}</a>
          </div>
          <p>${escapeHtml(project.summary)}</p>
          <div class="badge-row">
            ${project.stack.map((item) => `<span class="badge badge--muted">${escapeHtml(item)}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderContact(locale) {
  const introTarget = document.getElementById("contactIntro");
  introTarget.innerHTML = `
    <p class="contact__availability">${escapeHtml(locale.contact.availability)}</p>
    <p class="contact__message">${escapeHtml(locale.contact.message)}</p>
  `;

  const linksTarget = document.getElementById("contactLinks");
  linksTarget.innerHTML = locale.contact.links
    .map(
      (link, index) => `
        <a class="contact-card" href="${escapeHtml(link.url)}" ${link.url.startsWith("mailto:") ? "" : 'target="_blank" rel="noreferrer"'} data-reveal style="transition-delay:${index * 70}ms">
          <span class="card-kicker">${escapeHtml(link.label)}</span>
          <strong>${escapeHtml(link.value)}</strong>
          <span>${escapeHtml(link.description)}</span>
        </a>
      `
    )
    .join("");
}

function renderFooter(locale) {
  document.getElementById("footerName").textContent = locale.footer.name;
  document.getElementById("footerTagline").textContent = locale.footer.tagline;
  document.getElementById("footerNote").textContent = locale.footer.note;
}

function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
  }

  document.querySelectorAll("[data-reveal]").forEach((node) => {
    if (!node.hasAttribute("data-reveal-bound")) {
      node.setAttribute("data-reveal-bound", "true");
      revealObserver.observe(node);
    }
  });
}

function initActiveNav() {
  if (navObserver) {
    return;
  }

  const navLinks = [...document.querySelectorAll(".nav__link")];
  const map = new Map(
    navLinks.map((link) => [link.getAttribute("href").slice(1), link])
  );

  navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      navLinks.forEach((link) => link.classList.remove("nav__link--active"));
      const active = map.get(visible.target.id);
      if (active) {
        active.classList.add("nav__link--active");
      }
    },
    { threshold: [0.24, 0.5, 0.8], rootMargin: "-20% 0px -60% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach((section) => {
    navObserver.observe(section);
  });
}

function renderLocale(locale) {
  renderHeroSignals(locale);
  renderHeroPreview(locale);
  renderFlagshipProjects(locale);
  renderDomains(locale);
  renderPhilosophy(locale);
  renderCaseStudies(locale);
  renderStack(locale);
  renderGitHubProjects(locale);
  renderContact(locale);
  renderFooter(locale);
  observeReveals();
}

async function boot() {
  try {
    window.PortfolioI18n.onChange(renderLocale);
    await window.PortfolioI18n.init();
    initActiveNav();
  } catch (error) {
    const target = document.getElementById("flagshipProjects");
    target.innerHTML = `<article class="project-card project-card--feature is-visible"><div class="project-card__body"><p class="project-card__summary">${escapeHtml(error.message)}</p></div></article>`;
  }
}

boot();
