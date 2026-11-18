const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const programmeGrid = document.querySelector('#programme-grid');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navLinks.classList.toggle('open', !isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

const observeReveals = () => {
  document.querySelectorAll('.reveal:not(.visible)').forEach((element) => revealObserver.observe(element));
};

const createProgrammeCard = (programme, index) => {
  const article = document.createElement('article');
  article.className = `programme-card reveal${programme.featured ? ' featured' : ''}`;

  const number = document.createElement('span');
  number.className = 'card-number';
  number.textContent = String(index + 1).padStart(2, '0');

  const icon = document.createElement('div');
  icon.className = 'card-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = programme.icon;

  const title = document.createElement('h3');
  title.textContent = programme.name;

  const description = document.createElement('p');
  description.textContent = programme.description;

  const link = document.createElement('a');
  link.href = '#admissions';
  link.setAttribute('aria-label', `Learn more about ${programme.name}`);
  link.textContent = 'Explore programme ';
  const arrow = document.createElement('span');
  arrow.textContent = '→';
  link.append(arrow);

  article.append(number, icon, title, description, link);
  return article;
};

const loadProgrammes = async () => {
  try {
    const response = await fetch('./data/programmes.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const programmes = await response.json();
    programmeGrid.replaceChildren(...programmes.map(createProgrammeCard));
    observeReveals();
  } catch (error) {
    const message = document.createElement('p');
    message.className = 'data-error';
    message.textContent = 'Programme data is temporarily unavailable. Please try again later.';
    programmeGrid.replaceChildren(message);
    console.error('Unable to load programme data:', error);
  }
};

const loadRelease = async () => {
  try {
    const response = await fetch('./build-info.json');
    if (!response.ok) return;
    const build = await response.json();
    document.querySelector('#release').textContent = `release: ${build.version}`;
  } catch {
    // Source mode intentionally falls back to "release: local".
  }
};

observeReveals();
loadProgrammes();
loadRelease();
