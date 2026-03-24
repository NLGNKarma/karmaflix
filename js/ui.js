(function () {
  const legal = 'Avertissement légal — KarmaFlix n’héberge aucun fichier vidéo sur ses serveurs dans cette interface de démonstration. Cette plateforme privée est conçue comme une bibliothèque visuelle et une maquette d’interface. Tout contenu réel doit être utilisé dans un cadre personnel, privé et légal, avec les droits appropriés.';
  const links = [
    ['index.html', 'Accueil'],
    ['library.html', 'Bibliothèque'],
    ['my-list.html', 'Ma liste'],
    ['top10.html', 'Top 10'],
    ['search.html', 'Nouveautés']
  ];

  function header() {
    const current = location.pathname.split('/').pop() || 'index.html';
    return `<header class="site-header" id="siteHeader">
      <div class="brand"><span class="brand-k"></span><span>KarmaFlix</span></div>
      <nav class="nav-links">${links.map(([href, label]) => `<a class="${current === href ? 'active' : ''}" href="${href}">${label}</a>`).join('')}</nav>
      <div class="header-actions">
        <button class="icon-btn" aria-label="Menu" id="burger">☰</button>
        <a class="icon-btn" href="search.html" aria-label="Recherche">⌕</a>
        <a class="icon-btn" href="profile.html" aria-label="Profil">◉</a>
      </div>
      <div class="mobile-menu" id="mobileMenu">${links.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</div>
    </header>`;
  }

  function footer() {
    return `<footer class="footer">${legal}</footer>`;
  }

  document.querySelectorAll('[data-kf-header]').forEach((el) => el.innerHTML = header());
  document.querySelectorAll('[data-kf-footer]').forEach((el) => el.innerHTML = footer());

  document.addEventListener('click', (e) => {
    const burger = e.target.closest('#burger');
    if (burger) document.getElementById('mobileMenu')?.classList.toggle('open');
  });

  window.addEventListener('scroll', () => {
    document.getElementById('siteHeader')?.classList.toggle('scrolled', window.scrollY > 20);
  });
})();
