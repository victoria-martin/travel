// Ce qui est à l'écran. Un filtre se lit comme deux listes de mots — ceux qu'on veut voir, ceux
// qu'on veut hors de la liste — et non comme un état posé sur chacun des trente mots du
// vocabulaire : le panneau porte alors ce qui est filtré, jamais le catalogue.
// Les trois vocabulaires étant disjoints, un mot se suffit à lui-même ; son axe se retrouve en
// l'interrogeant dans l'une puis l'autre liste, comme `splitRest` le fait sur une puce de PLAN.md.
const FILTER_AXES = [
  { words: () => PLAN_STATUSES, of: (task) => [task.status] },
  { words: () => PLAN_PRIORITIES, of: (task) => [task.priority] },
  { words: () => PLAN_TYPES, of: (task) => task.types },
];

let included = [];
let excluded = [];
let showArchived = false;
let search = '';

const FILTER_LISTS = {
  include: { title: 'Inclure', words: () => included, set: (words) => (included = words) },
  exclude: { title: 'Exclure', words: () => excluded, set: (words) => (excluded = words) },
};

const axisOf = (label) =>
  FILTER_AXES.find((axis) => axis.words().some((word) => word.label === label));

const filterWord = (label) => planStatus(label) || planPriority(label) || planType(label);

const filterCount = () => included.length + excluded.length;

const allTasks = () => [
  ...board.tasks,
  ...board.archived.map((task) => ({ ...task, archived: true })),
];

const taskWords = (task) => [task.status, task.priority, ...task.types];

// Un mot inclus ouvre la liste à tous ceux de son axe ; deux axes se croisent. Un mot exclu sort la
// tâche quoi qu'il arrive.
function matchesWords(task) {
  const kept = FILTER_AXES.every((axis) => {
    const wanted = included.filter((label) => axisOf(label) === axis);
    return !wanted.length || axis.of(task).some((value) => wanted.includes(value));
  });
  return kept && !taskWords(task).some((label) => excluded.includes(label));
}

function visibleTasks() {
  const needle = search.trim().toLowerCase();
  return allTasks().filter((task) => {
    if (Boolean(task.archived) !== showArchived) return false;
    if (!matchesWords(task)) return false;
    if (!needle) return true;
    return `${task.title} ${task.body} ${task.section}`.toLowerCase().includes(needle);
  });
}

// Ce que chaque mot pèse dans la collection ouverte — le plan, ou les archivées.
function wordTallies() {
  const counts = {};
  allTasks()
    .filter((task) => Boolean(task.archived) === showArchived)
    .forEach((task) =>
      taskWords(task).forEach((label) => (counts[label] = (counts[label] || 0) + 1)),
    );
  return counts;
}

const dropWord = (label) =>
  Object.values(FILTER_LISTS).forEach((list) =>
    list.set(list.words().filter((entry) => entry !== label)),
  );

// Un mot ne vit que dans une liste : le poser d'un côté le retire de l'autre.
function addFilterWord(name, label) {
  dropWord(label);
  FILTER_LISTS[name].set([...FILTER_LISTS[name].words(), label]);
  closeFilterPicker();
  renderBoard();
}

function removeFilterWord(name, label) {
  const list = FILTER_LISTS[name];
  list.set(list.words().filter((entry) => entry !== label));
  renderBoard();
}

function clearFilters() {
  included = [];
  excluded = [];
  renderBoard();
}

function toggleArchived() {
  showArchived = !showArchived;
  renderBoard();
}

function setSearch(value) {
  search = value;
  renderBoard();
}
