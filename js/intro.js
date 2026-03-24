(function () {
  const skip = document.getElementById('skipIntro');
  const seen = localStorage.getItem('karmaflix.introSeen');

  function go() {
    localStorage.setItem('karmaflix.introSeen', '1');
    location.href = 'login.html';
  }

  if (seen) {
    setTimeout(go, 300);
    return;
  }

  skip?.addEventListener('click', go);
  setTimeout(go, 3800);
})();
