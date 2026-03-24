(function () {
  const skip = document.getElementById('skipIntro');
  const seen = localStorage.getItem('karmaflix.introSeen');

  function seedBrushAndLights() {
    const furTemplate = Array.from({ length: 31 }, (_, i) => {
      const left = (i * (100 / 31)).toFixed(2) + '%';
      const width = (1.8 + (i % 5) * 0.8).toFixed(2) + '%';
      const alpha = 12 + (i % 8) * 5;
      return `<span class="fur" style="--x:${left};--w:${width};--a:${alpha}%"></span>`;
    }).join('');

    document.querySelectorAll('.effect-brush').forEach((el) => (el.innerHTML = furTemplate));

    const colors = ['#ff0100', '#ffde01', '#ff00cc', '#04fd8f', '#ff9600', '#0084ff', '#f84006', '#01ffff'];
    const lamps = Array.from({ length: 28 }, (_, i) => {
      const left = (0.8 + i * 3.5).toFixed(2) + '%';
      const width = (0.7 + (i % 4) * 0.5).toFixed(2) + '%';
      const delay = (0.1 + (i % 12) * 0.12).toFixed(2) + 's';
      const dir = i % 2 === 0 ? 'lumieres-moving-left' : 'lumieres-moving-right';
      return `<span class="lamp" style="--x:${left};--w:${width};--d:${delay};--dir:${dir};--c:${colors[i % colors.length]}"></span>`;
    }).join('');

    const lights = document.querySelector('.effect-lumieres');
    if (lights) lights.innerHTML = lamps;
  }

  function go() {
    localStorage.setItem('karmaflix.introSeen', '1');
    location.href = 'login.html';
  }

  seedBrushAndLights();

  if (seen) {
    setTimeout(go, 250);
    return;
  }

  skip?.addEventListener('click', go);
  setTimeout(go, 3900);
})();
