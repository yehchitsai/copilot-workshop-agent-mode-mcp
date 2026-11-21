// 待辦清單使用瀏覽器的 localStorage 保存資料，不需要網路或外部套件。
const STORAGE_KEY = 'offline-todo-list';
const THEME_STORAGE_KEY = 'offline-todo-list-theme';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const themeToggle = document.getElementById('theme-toggle');
const filterButtons = document.querySelectorAll('.btn-filter');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

let todos = loadTodos();
let activeFilter = 'all';
let themePreference = loadThemePreference();

// 讀取並檢查已保存的資料，避免損壞的內容影響清單顯示。
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((todo) =>
      todo &&
      typeof todo.id === 'string' &&
      typeof todo.text === 'string' &&
      typeof todo.completed === 'boolean'
    );
  } catch (error) {
    console.warn('讀取待辦清單失敗，將以空清單開始。', error);
    return [];
  }
}

// 將目前清單寫入瀏覽器儲存空間。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 讀取使用者的主題選擇；尚未選擇時交由系統設定決定。
function loadThemePreference() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    if (saved !== null) {
      console.warn('已忽略無效的主題設定。');
    }
  } catch (error) {
    console.warn('讀取主題設定失敗，將使用系統設定。', error);
  }

  return null;
}

// 套用手動選擇或作業系統目前使用的主題。
function applyTheme() {
  const isDark = themePreference
    ? themePreference === 'dark'
    : systemTheme.matches;

  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle.textContent = isDark ? '☀️ 淺色模式' : '🌙 深色模式';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

// 依照目前篩選條件重新繪製清單，未完成數量始終以全部資料計算。
function render() {
  list.replaceChildren();

  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === 'active') {
      return !todo.completed;
    }
    if (activeFilter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item completed' : 'todo-item';
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.className = 'todo-checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記「${todo.text}」為完成`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-delete';
    deleteButton.type = 'button';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = visibleTodos.length > 0;
  if (activeFilter === 'active') {
    emptyState.textContent = '沒有未完成的待辦事項。';
  } else if (activeFilter === 'completed') {
    emptyState.textContent = '沒有已完成的待辦事項。';
  } else {
    emptyState.textContent = '還沒有任何待辦事項,新增一個吧!';
  }

  const remaining = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${remaining} 項`;
}

// 新增一筆待辦，使用時間與隨機字串組成識別碼。
function addTodo(text) {
  todos.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    completed: false,
  });
  saveTodos();
  render();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  addTodo(text);
  input.value = '';
  input.focus();
});

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark'
    ? 'light'
    : 'dark';

  themePreference = nextTheme;
  applyTheme();
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (error) {
    console.warn('保存主題設定失敗；本次瀏覽期間仍會套用此設定。', error);
  }
});

systemTheme.addEventListener('change', () => {
  if (themePreference === null) {
    applyTheme();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      filterButton.setAttribute(
        'aria-pressed',
        String(filterButton === button)
      );
    });
    render();
  });
});

// 透過事件委派處理勾選與刪除操作。
list.addEventListener('click', (event) => {
  const target = event.target;
  const item = target.closest('.todo-item');
  if (!item) {
    return;
  }

  const { id } = item.dataset;
  if (target.matches('.todo-checkbox')) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: target.checked } : todo
    );
  } else if (target.matches('.btn-delete')) {
    todos = todos.filter((todo) => todo.id !== id);
  } else {
    return;
  }

  saveTodos();
  render();
});

applyTheme();
render();
