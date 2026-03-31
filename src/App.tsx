import { FormEvent, useMemo, useState } from 'react';

type TaskStatus = 'completed' | 'not_completed';
type FilterType = 'all' | 'completed' | 'not_completed';

type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  isOpen: boolean;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Подготовить проект',
    description: 'Подготовить проект для демки',
    status: 'not_completed',
    isOpen: false,
  },
  {
    id: 2,
    title: 'Проверить функционал',
    description: 'Проверить функционал приложения перед демкой',
    status: 'completed',
    isOpen: false,
  },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'completed'
            ? task.status === 'completed'
            : task.status === 'not_completed';

      const matchesSearch =
        normalizedQuery.length === 0
          ? true
          : task.title.toLowerCase().includes(normalizedQuery) ||
            task.description.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search, tasks]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      return;
    }

    setTasks((currentTasks) => [
      {
        id: Date.now(),
        title: normalizedTitle,
        description: normalizedDescription,
        status: 'not_completed',
        isOpen: false,
      },
      ...currentTasks,
    ]);

    setTitle('');
    setDescription('');
  };

  const toggleTaskDescription = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, isOpen: !task.isOpen } : task,
      ),
    );
  };

  const toggleTaskStatus = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'completed' ? 'not_completed' : 'completed',
            }
          : task,
      ),
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  return (
    <main className="page">
      <h1>ToDoList</h1>

      <form onSubmit={handleSubmit} className="form">
        <div>
          <label htmlFor="title">Название задачи</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
          />
        </div>

        <button type="submit">Добавить задачу</button>
      </form>

      <section className="controls">
        <div>
          <label htmlFor="search">Поиск</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="По названию или описанию"
          />
        </div>

        <div className="filters">
          <button type="button" onClick={() => setFilter('all')}>
            Все задачи
          </button>
          <button type="button" onClick={() => setFilter('completed')}>
            Вып. задачи
          </button>
          <button type="button" onClick={() => setFilter('not_completed')}>
            Не вып. задачи
          </button>
        </div>
      </section>

      <section>
        {filteredTasks.length === 0 ? (
          <p>Задачи не найдены.</p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li key={task.id} className="task-item">
                <button
                  type="button"
                  className="task-title"
                  onClick={() => toggleTaskDescription(task.id)}
                >
                  {task.title}
                </button>

                <p>Статус: {task.status === 'completed' ? 'выполнено' : 'не выполнено'}</p>

                {task.isOpen && <p>{task.description || 'Описание отсутствует.'}</p>}

                <div className="task-actions">
                  <button type="button" onClick={() => toggleTaskStatus(task.id)}>
                    Изменить статус
                  </button>
                  <button type="button" onClick={() => deleteTask(task.id)}>
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
