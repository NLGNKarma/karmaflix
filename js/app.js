(function () {
  const data = window.KarmaData;
  if (!data) return;

  const byId = Object.fromEntries(data.catalog.map((x) => [x.id, x]));
  const listKey = 'karmaflix.mylist';

  const getList = () => JSON.parse(localStorage.getItem(listKey) || '[]');
  const setList = (arr) => localStorage.setItem(listKey, JSON.stringify(arr));
  const inList = (id) => getList().includes(id);
  const toggleList = (id) => {
    const set = new Set(getList());
    set.has(id) ? set.delete(id) : set.add(id);
    setList([...set]);
    return set.has(id);
  };

  function card(item, rank) {
    const top = typeof rank === 'number' ? `<div class="rank">${rank + 1}</div>` : '';
    const btnText = inList(item.id) ? 'Retirer' : 'Ma liste';
    return `<article class="${top ? 'top-item' : ''}">${top}<a class="card" href="details.html?id=${item.id}">
      <img src="${item.image}" alt="${item.title}" loading="lazy" />
      <div class="card-overlay"><h3>${item.title}</h3><span class="chip">${item.type} • ${item.year}</span></div>
    </a>
    <button class="icon-btn" data-add="${item.id}">${btnText}</button></article>`;
  }

  function renderRow(target, ids, ranked = false) {
    if (!target) return;
    target.innerHTML = ids.map((id, i) => card(byId[id], ranked ? i : undefined)).join('');
  }

  function attachAdd() {
    document.querySelectorAll('[data-add]').forEach((btn) => {
      btn.onclick = () => {
        const added = toggleList(btn.dataset.add);
        btn.textContent = added ? 'Retirer' : 'Ma liste';
      };
    });
  }

  function revealOnScroll() {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')), { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  const page = document.body.dataset.page;

  if (page === 'home') {
    const heroItem = byId['orbital-run'];
    const hero = document.getElementById('hero');
    hero.style.backgroundImage = `url(${heroItem.backdrop})`;
    hero.querySelector('h1').textContent = heroItem.title;
    hero.querySelector('p').textContent = heroItem.description;
    hero.querySelector('[data-hero-link]').href = `details.html?id=${heroItem.id}`;

    renderRow(document.getElementById('top10Row'), data.sections.top10, true);
    renderRow(document.getElementById('newRow'), data.sections.nouveautes);
    renderRow(document.getElementById('popularRow'), data.sections.populaires);
    renderRow(document.getElementById('suggestRow'), data.sections.suggestions);
    renderRow(document.getElementById('franchiseRow'), data.sections.franchises);
    renderRow(document.getElementById('continueRow'), data.sections.continuer);
    renderRow(document.getElementById('lastRow'), data.sections.derniers);
  }

  if (page === 'library') {
    const grid = document.getElementById('libraryGrid');
    const filters = document.querySelectorAll('.filter-pill');
    const search = document.getElementById('librarySearch');

    const draw = (genre = 'Tous', query = '') => {
      const items = data.catalog.filter((item) => {
        const okGenre = genre === 'Tous' || item.genre.includes(genre) || item.type === genre;
        const q = query.toLowerCase();
        const okQuery = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
        return okGenre && okQuery;
      });
      grid.innerHTML = items.map((item) => card(item)).join('');
      attachAdd();
    };

    draw();
    filters.forEach((f) => f.onclick = () => {
      filters.forEach((x) => x.classList.remove('active'));
      f.classList.add('active');
      draw(f.dataset.filter, search.value);
    });
    search.oninput = () => draw(document.querySelector('.filter-pill.active').dataset.filter, search.value);
  }

  if (page === 'my-list') {
    const ids = getList();
    const wrap = document.getElementById('myListWrap');
    if (!ids.length) {
      wrap.innerHTML = '<div class="empty-state">Votre liste est vide. Ajoutez du contenu depuis la home, la bibliothèque ou la fiche détail.</div>';
    } else {
      wrap.classList.add('grid');
      wrap.innerHTML = ids.filter((id) => byId[id]).map((id) => card(byId[id])).join('');
      attachAdd();
    }
  }

  if (page === 'top10') {
    renderRow(document.getElementById('top10PageRow'), data.sections.top10, true);
  }

  if (page === 'details') {
    const params = new URLSearchParams(location.search);
    const item = byId[params.get('id')] || data.catalog[0];
    const hero = document.getElementById('detailsHero');
    hero.style.backgroundImage = `url(${item.backdrop})`;
    document.getElementById('dTitle').textContent = item.title;
    document.getElementById('dTag').textContent = item.tagline;
    document.getElementById('dMeta').textContent = `${item.type} • ${item.year} • ${item.duration} • ★ ${item.rating}`;
    document.getElementById('dDesc').textContent = item.description;
    document.getElementById('dPoster').src = item.image;
    const addBtn = document.getElementById('detailsAdd');
    addBtn.textContent = inList(item.id) ? 'Retirer de ma liste' : 'Ajouter à ma liste';
    addBtn.onclick = () => {
      const added = toggleList(item.id);
      addBtn.textContent = added ? 'Retirer de ma liste' : 'Ajouter à ma liste';
    };
    const sims = data.catalog.filter((x) => x.id !== item.id).slice(0, 5).map((x) => x.id);
    renderRow(document.getElementById('similarRow'), sims);
  }

  if (page === 'search') {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const historyKey = 'karmaflix.searchHistory';

    const saveHistory = (q) => {
      if (!q) return;
      const prev = JSON.parse(localStorage.getItem(historyKey) || '[]').filter((x) => x !== q);
      localStorage.setItem(historyKey, JSON.stringify([q, ...prev].slice(0, 6)));
    };

    const draw = () => {
      const q = input.value.toLowerCase();
      const items = data.catalog.filter((x) => x.title.toLowerCase().includes(q) || x.genre.join(' ').toLowerCase().includes(q));
      results.className = 'grid';
      results.innerHTML = items.map((x) => card(x)).join('');
      attachAdd();
      saveHistory(input.value.trim());
      const hist = JSON.parse(localStorage.getItem(historyKey) || '[]');
      document.getElementById('searchHistory').textContent = hist.length ? `Historique: ${hist.join(' • ')}` : 'Historique: vide';
    };

    input.oninput = draw;
    draw();
  }

  if (page === 'profile') {
    const session = JSON.parse(localStorage.getItem('karmaflix.session') || '{}');
    document.getElementById('pName').textContent = session.username || 'Utilisateur privé';
    document.getElementById('pEmail').textContent = session.email || 'compte-local@karmaflix.local';
    document.getElementById('logoutBtn').onclick = () => {
      localStorage.removeItem('karmaflix.session');
      location.href = 'login.html';
    };
  }

  attachAdd();
  revealOnScroll();
})();
