const REPOSITORY = 'Prathameshswami2722/DevOps-College-Website';
const API_ROOT = `https://api.github.com/repos/${REPOSITORY}`;

const elements = {
  refresh: document.querySelector('#refresh-dashboard'),
  lastUpdated: document.querySelector('#last-updated'),
  apiMessage: document.querySelector('#api-message'),
  productionStatus: document.querySelector('#production-status'),
  productionDetail: document.querySelector('#production-detail'),
  productionPill: document.querySelector('#production-pill'),
  pipelineStatus: document.querySelector('#pipeline-status'),
  pipelineDetail: document.querySelector('#pipeline-detail'),
  pipelinePill: document.querySelector('#pipeline-pill'),
  releaseVersion: document.querySelector('#release-version'),
  releaseDetail: document.querySelector('#release-detail'),
  openPrs: document.querySelector('#open-prs'),
  workflowLink: document.querySelector('#workflow-link'),
  runTrigger: document.querySelector('#run-trigger'),
  runCommit: document.querySelector('#run-commit'),
  runStarted: document.querySelector('#run-started'),
  runDuration: document.querySelector('#run-duration'),
  pipelineStages: document.querySelector('#pipeline-stages'),
  prodDeployment: document.querySelector('#prod-deployment'),
  prodRelease: document.querySelector('#prod-release'),
  commitList: document.querySelector('#commit-list'),
  healthControl: document.querySelector('#health-control'),
  copyFeedback: document.querySelector('#copy-feedback')
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: url.startsWith('https://api.github.com')
      ? { Accept: 'application/vnd.github+json' }
      : {}
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
};

const formatDuration = (start, end) => {
  if (!start || !end) return 'In progress';
  const seconds = Math.max(0, Math.round((new Date(end) - new Date(start)) / 1000));
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};

const formatRelativeTime = (dateValue) => {
  if (!dateValue) return 'Unknown';
  const seconds = Math.round((new Date(dateValue) - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (Math.abs(seconds) < 60) return formatter.format(seconds, 'second');
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, 'hour');
  return formatter.format(Math.round(hours / 24), 'day');
};

const humanize = (value) => String(value ?? 'unknown')
  .replaceAll('_', ' ')
  .replace(/\b\w/g, (character) => character.toUpperCase());

const stateClass = (state) => {
  if (state === 'success' || state === 'completed') return 'success';
  if (state === 'failure' || state === 'cancelled' || state === 'timed_out') return 'failure';
  if (state === 'in_progress' || state === 'queued' || state === 'pending') return 'progress';
  return 'loading';
};

const setPill = (element, label, state) => {
  element.textContent = label;
  element.className = `status-pill ${stateClass(state)}`;
};

const renderHealth = async () => {
  try {
    const health = await fetchJson('./health.json');
    if (health.status !== 'ok') throw new Error('Unhealthy response');
    elements.productionStatus.textContent = 'Operational';
    elements.productionDetail.textContent = `${health.service} responded successfully`;
    elements.prodDeployment.textContent = 'Healthy';
    elements.healthControl.textContent = 'Healthy';
    setPill(elements.productionPill, 'Healthy', 'success');
    return true;
  } catch {
    elements.productionStatus.textContent = 'Degraded';
    elements.productionDetail.textContent = 'Health endpoint could not be reached';
    elements.prodDeployment.textContent = 'Probe failed';
    elements.healthControl.textContent = 'Unavailable';
    setPill(elements.productionPill, 'Attention', 'failure');
    return false;
  }
};

const renderBuild = async () => {
  try {
    const build = await fetchJson('./build-info.json');
    elements.releaseVersion.textContent = build.version;
    elements.releaseDetail.textContent = `Built ${formatRelativeTime(build.builtAt)} from commit ${build.commit}`;
    elements.prodRelease.textContent = build.commit;
    return build;
  } catch {
    elements.releaseVersion.textContent = 'source mode';
    elements.releaseDetail.textContent = 'Build metadata appears after npm run build';
    elements.prodRelease.textContent = 'local';
    return null;
  }
};

const createStage = (job) => {
  const stage = document.createElement('div');
  const state = job.conclusion ?? job.status;
  stage.className = `stage ${stateClass(state)}`;

  const icon = document.createElement('span');
  icon.className = 'stage-icon';
  icon.textContent = state === 'success' ? '✓' : stateClass(state) === 'failure' ? '!' : '•';

  const copy = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = job.name;
  const detail = document.createElement('small');
  detail.textContent = `${humanize(state)} · ${formatDuration(job.started_at, job.completed_at)}`;
  copy.append(title, detail);
  stage.append(icon, copy);
  return stage;
};

const renderPipeline = async () => {
  const runs = await fetchJson(`${API_ROOT}/actions/runs?branch=main&per_page=20`);
  const run = runs.workflow_runs.find(({ name }) => name === 'CI/CD Pipeline') ?? runs.workflow_runs[0];
  if (!run) throw new Error('No workflow runs found');

  const state = run.conclusion ?? run.status;
  const stateLabel = humanize(state);
  elements.pipelineStatus.textContent = stateLabel;
  elements.pipelineDetail.textContent = `${run.name} · ${formatRelativeTime(run.created_at)}`;
  setPill(elements.pipelinePill, stateLabel, state);
  elements.workflowLink.href = run.html_url;
  elements.runTrigger.textContent = humanize(run.event);
  elements.runCommit.textContent = run.head_sha.slice(0, 7);
  elements.runStarted.textContent = formatRelativeTime(run.run_started_at ?? run.created_at);
  elements.runDuration.textContent = formatDuration(run.run_started_at ?? run.created_at, run.updated_at);

  const jobs = await fetchJson(`${API_ROOT}/actions/runs/${run.id}/jobs?per_page=100`);
  const deliveryJobs = jobs.jobs.filter(({ name }) => [
    'Validate, test and build',
    'Build container image',
    'Deploy to GitHub Pages'
  ].includes(name));
  elements.pipelineStages.replaceChildren(...deliveryJobs.map(createStage));
  return run;
};

const renderCommits = async () => {
  const commits = await fetchJson(`${API_ROOT}/commits?sha=main&per_page=5`);
  const rows = commits.map((commit) => {
    const row = document.createElement('li');
    const copy = document.createElement('div');
    const title = document.createElement('a');
    title.className = 'commit-title';
    title.href = commit.html_url;
    title.target = '_blank';
    title.rel = 'noreferrer';
    title.textContent = commit.commit.message.split('\n')[0];
    const meta = document.createElement('span');
    meta.className = 'commit-meta';
    meta.textContent = `${commit.commit.author.name} · ${formatRelativeTime(commit.commit.author.date)}`;
    const sha = document.createElement('span');
    sha.className = 'commit-sha';
    sha.textContent = commit.sha.slice(0, 7);
    copy.append(title, meta);
    row.append(copy, sha);
    return row;
  });
  elements.commitList.replaceChildren(...rows);
};

const renderPullRequests = async () => {
  const pulls = await fetchJson(`${API_ROOT}/pulls?state=open&per_page=100`);
  elements.openPrs.textContent = String(pulls.length);
};

const refreshDashboard = async () => {
  elements.refresh.classList.add('loading');
  elements.refresh.disabled = true;
  elements.apiMessage.textContent = 'Synchronizing operational data';

  const results = await Promise.allSettled([
    renderHealth(),
    renderBuild(),
    renderPipeline(),
    renderCommits(),
    renderPullRequests()
  ]);
  const failures = results.filter(({ status }) => status === 'rejected').length;

  elements.lastUpdated.textContent = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(new Date());
  elements.apiMessage.textContent = failures
    ? `${failures} data source${failures === 1 ? '' : 's'} unavailable; showing verified fallback state`
    : 'All operational data sources synchronized';
  elements.refresh.classList.remove('loading');
  elements.refresh.disabled = false;
};

elements.refresh.addEventListener('click', refreshDashboard);

document.querySelectorAll('.copy-button').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      elements.copyFeedback.textContent = 'Command copied to clipboard';
    } catch {
      elements.copyFeedback.textContent = 'Select the command text to copy it manually';
    }
    setTimeout(() => { elements.copyFeedback.textContent = ''; }, 2500);
  });
});

refreshDashboard();
