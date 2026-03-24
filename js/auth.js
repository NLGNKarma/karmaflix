(function () {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  function saveSession(profile) {
    localStorage.setItem('karmaflix.session', JSON.stringify(profile));
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();
      const error = loginForm.querySelector('.error');
      if (!email || !password || password.length < 6) {
        error.textContent = 'Veuillez saisir des identifiants valides (6 caractères min).';
        return;
      }
      saveSession({ username: email.split('@')[0], email });
      location.href = 'index.html';
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = registerForm;
      const error = form.querySelector('.error');
      if (form.password.value.length < 6) return (error.textContent = 'Mot de passe trop court.');
      if (form.password.value !== form.confirm.value) return (error.textContent = 'La confirmation ne correspond pas.');
      if (!form.terms.checked) return (error.textContent = 'Veuillez accepter les conditions.');
      saveSession({ username: form.username.value, email: form.email.value });
      location.href = 'index.html';
    });
  }
})();
