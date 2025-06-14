import React, { useState, useEffect } from 'react';

// Translations for different languages
const translations = {
  en: { // Received Pronunciation (RP) dialect
    title: "Your Excellent To-Dos!",
    placeholder: "Enter a new task...",
    addBtn: "Add Task! ✨",
    noTasks: "There are no tasks at present. Kindly add one.",
    clearCompleted: "Clear Completed ✅",
    copyAll: "Copy All 📋",
    copiedMessage: "Excellent! Tasks copied! 📋",
    copyError: "Unable to copy. Kindly attempt again.",
    copyGenericError: "An error occurred while copying! 😔",
    lightMode: "Switch to Light Mode",
    darkMode: "Switch to Dark Mode",
    deleteTask: "Delete task:",
    dueDate: "Due Date:",
    dueTime: "Due Time:",
  },
  th: {
    title: "รายการสิ่งที่ต้องทำสุดเจ๋งของคุณ!",
    placeholder: "เพิ่มงานใหม่...",
    addBtn: "เพิ่มเลย! ✨",
    noTasks: "ยังไม่มีงานเลยเพื่อน! ไปทำกันเถอะ!",
    clearCompleted: "ล้างงานที่เสร็จแล้ว ✅",
    copyAll: "คัดลอกทั้งหมด 📋",
    copiedMessage: "ยอดเยี่ยม! คัดลอกรายการแล้ว! 📋",
    copyError: "คัดลอกไม่ได้ ลองอีกครั้งนะเพื่อน",
    copyGenericError: "โอ้! เกิดข้อผิดพลาดในการคัดลอก! 😔",
    lightMode: "สลับไปโหมดสว่าง",
    darkMode: "สลับไปโหมดมืด",
    deleteTask: "ลบงาน:",
    dueDate: "วันที่ครบกำหนด:",
    dueTime: "เวลาครบกำหนด:",
  },
  ga: { // Irish Gaelic
    title: "Na Cúraimí Pure Bril Agat!",
    placeholder: "Cuir tasc beag nua leis...",
    addBtn: "Cuir Leis! ✨",
    noTasks: "Níl aon tascanna fós, a chara! Dean é!",
    clearCompleted: "Glan Comhlánaithe ✅",
    copyAll: "Cóipeáil Gach Rud 📋",
    copiedMessage: "Go hiontach! Cóipeáladh na cúraimí! 📋",
    copyError: "Níorbh fhéidir a chóipeáil. Bain triail as arís, a chara.",
    copyGenericError: "Óch, earráid cóipeála! 😔",
    lightMode: "Athraigh go Mód Solais",
    darkMode: "Athraigh go Mód Dorcha",
    deleteTask: "Scrios cúram:",
    dueDate: "Dáta Dlítigh:",
    dueTime: "Am Dlítigh:",
  },
  gd: { // Scottish Gaelic
    title: "Na Gnìomhan Sgoinneil agad!",
    placeholder: "Cuir gnìomh beag ùr ris...",
    addBtn: "Cuir Ris! ✨",
    noTasks: "Chan eil gnìomhan ann fhathast, a charaid! Dèan e!",
    clearCompleted: "Glan Gnìomhan Crìochnaichte ✅",
    copyAll: "Dèan Lethbhreac de na h-Uile 📋",
    copiedMessage: "Sgoinneil! Gnìomhan air an lethbhreacadh! 📋",
    copyError: "Cha b' urrainn lethbhreac a dhèanamh. Feuch ris a-rithist, a chàirdean.",
    copyGenericError: "Och, mearachd lethbhreacach! 😔",
    lightMode: "Atharraich gu Modh Soilleir",
    darkMode: "Atharraich gu Modh Dorcha",
    deleteTask: "Sguab às gnìomh:",
    dueDate: "Ceann-latha dlìthichte:",
    dueTime: "Àm dlìthichte:",
  }
};

// Main App component
const App = () => {
  // State for managing todo items
  const [todos, setTodos] = useState([]);
  // State for the new todo input
  const [newTodo, setNewTodo] = useState('');
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);
  // State for showing a message (e.g., "Copied!")
  const [message, setMessage] = useState('');
  // State for current language, defaulting to English
  const [language, setLanguage] = useState('en');
  // States for new todo due date and time
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('');

  // Effect to load todos, dark mode, and language from local storage on initial render
  useEffect(() => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
      setTodos(storedTodos);
    } catch (e) {
      console.error("Failed to parse stored todos:", e);
      setTodos([]); // Reset if corrupted
    }

    try {
      const storedDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
      setDarkMode(storedDarkMode);
      if (storedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error("Failed to parse stored dark mode setting:", e);
      setDarkMode(false); // Default to light mode if corrupted
      document.documentElement.classList.remove('dark');
    }

    try {
      const storedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(storedLanguage);
    } catch (e) {
      console.error("Failed to parse stored language setting:", e);
      setLanguage('en'); // Default to English if corrupted
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to save todos to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Effect to save dark mode setting to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Effect to save language setting to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Get current translations based on selected language
  const t = translations[language];

  // Function to handle adding a new todo
  const addTodo = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (newTodo.trim() === '') {
      return; // Don't add empty todos
    }
    setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false, dueDate: newDueDate, dueTime: newDueTime }]);
    setNewTodo(''); // Clear input field
    setNewDueDate(''); // Clear date field
    setNewDueTime(''); // Clear time field
  };

  // Function to toggle the completion status of a todo
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Function to clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Function to copy all todos to clipboard
  const copyAllTodos = () => {
    const allTodosText = todos.map(todo => {
      let taskString = `${todo.completed ? '[x]' : '[ ]'} ${todo.text}`;
      if (todo.dueDate) {
        taskString += ` (Due: ${todo.dueDate}`;
        if (todo.dueTime) {
          taskString += ` at ${todo.dueTime}`;
        }
        taskString += `)`;
      }
      return taskString;
    }).join('\n');

    // Use document.execCommand for clipboard operations in the iframe
    const textarea = document.createElement('textarea');
    textarea.value = allTodosText;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setMessage(t.copiedMessage);
      } else {
        setMessage(t.copyError);
      }
    } catch (err) {
      setMessage(t.copyGenericError);
      console.error('Error copying text: ', err);
    }
    document.body.removeChild(textarea);

    // Clear message after a short delay
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    // Main container with dark mode classes
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter flex flex-col items-center p-4 transition-colors duration-300 relative">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        {`
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
              },
            },
          },
        };
        `}
      </script>

      {/* Message box for copy confirmation */}
      {message && (
        <div className="fixed top-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-50">
          {message}
        </div>
      )}

      {/* Top right controls: Dark mode toggle and Language dropdown */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-purple-500 dark:hover:bg-purple-600 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-purple-400"
          aria-label={darkMode ? t.darkMode : t.lightMode}
        >
          {darkMode ? (
            <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg> // Moon icon for dark mode
          ) : (
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 4a1 1 0 011 1v1a1 1 0 11-2 0V7a1 1 0 011-1zm-4 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm8-4a1 1 0 011 1v1a1 1 0 11-2 0V7a1 1 0 011-1zm-4-4a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm-4 4a1 1 0 011 1v1a1 1 0 11-2 0V7a1 1 0 011-1zM5 8a5 5 0 1010 0 5 5 0 00-10 0zm0 0a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg> // Sun icon for light mode
          )}
        </button>

        {/* Language Dropdown */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-400 transition-all duration-200"
          aria-label="Select language"
        >
          <option value="en">🏴󠁧󠁢󠁥󠁮󠁧󠁿</option> {/* Flag of England */}
          <option value="th">🇹🇭</option>
          <option value="ga">🇮🇪</option>
          <option value="gd">🏴󠁧󠁢󠁳󠁣󠁴󠁿</option>
        </select>
      </div>

      {/* Main todo list container */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 transition-colors duration-300 border border-gray-200 dark:border-gray-700 mt-16"> {/* Added mt-16 to push content down from controls */}
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800 dark:text-gray-200">
          <span role="img" aria-label="todo list">📝</span> {t.title}
        </h1>

        {/* Add new todo form */}
        <form onSubmit={addTodo} className="flex flex-col gap-3 mb-6">
          <input
            type="text"
            className="flex-grow p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-400 transition-all duration-200"
            placeholder={t.placeholder}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <div className="flex gap-2 items-center">
            <label htmlFor="dueDate" className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">{t.dueDate}</label>
            <input
              type="date"
              id="dueDate"
              className="flex-grow p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-400 transition-all duration-200"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="dueTime" className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">{t.dueTime}</label>
            <input
              type="time"
              id="dueTime"
              className="flex-grow p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-400 transition-all duration-200"
              value={newDueTime}
              onChange={(e) => setNewDueTime(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 dark:bg-purple-600 dark:hover:bg-purple-700 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-purple-400 mt-2"
          >
            {t.addBtn}
          </button>
        </form>

        {/* Todo list */}
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg py-8">
            {t.noTasks}
          </p>
        ) : (
          <ul className="space-y-3">
            {todos.map(todo => (
              <li
                key={todo.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg shadow-sm transition-all duration-200
                  ${todo.completed ? 'bg-gray-200 dark:bg-gray-700 line-through text-gray-500 dark:text-gray-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'}`
                }
              >
                <div className="flex-grow">
                  <span
                    onClick={() => toggleTodo(todo.id)}
                    className="cursor-pointer text-lg font-medium select-none"
                  >
                    {todo.text}
                  </span>
                  {(todo.dueDate || todo.dueTime) && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {todo.dueDate && `${t.dueDate} ${todo.dueDate}`}
                      {todo.dueDate && todo.dueTime && ' '}
                      {todo.dueTime && `${t.dueTime} ${todo.dueTime}`}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="mt-2 sm:mt-0 sm:ml-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 flex-shrink-0"
                  aria-label={`${t.deleteTask} ${todo.text}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm3 3a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Action buttons (Clear Completed, Copy All) */}
        {todos.length > 0 && (
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={clearCompleted}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 dark:bg-orange-500 dark:hover:bg-orange-600 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 dark:focus:ring-orange-400"
            >
              {t.clearCompleted}
            </button>
            <button
              onClick={copyAllTodos}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 dark:bg-teal-500 dark:hover:bg-teal-600 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 dark:focus:ring-teal-400"
            >
              {t.copyAll}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
