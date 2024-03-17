const books = [];
const RENDER_EVENT = "render-books";
const STORAGE_KEY = "Books_App";
const SAVED_EVENT = "Save_Books";

document.addEventListener("DOMContentLoaded", function () {
  const submitform = document.getElementById("inputBook");

  submitform.addEventListener("submit", function (e) {
    e.preventDefault();

    addBooks();
    saveData();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  document.getElementById("searchSubmit").addEventListener("click", function (e) {
    e.preventDefault();

    const search = document.getElementById("searchBookTitle").value.toLowerCase();
    const article = document.querySelectorAll(".book_item  ");

    for (const book of article) {
      const title = book.firstElementChild.innerText.toLowerCase();
      if (title.includes(search)) {
        book.style.display = "block";
      } else {
        book.style.display = "none";
      }
    }
  });
});

function addBooks() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const years = document.getElementById("inputBookYear").value;
  const checkbox = document.getElementById("inputBookIsComplete");

  const checkReading = checkbox.checked;

  const generatedID = generateId();
  const booksObject = generateObjectBooks(generatedID, title, author, years, checkReading);
  books.push(booksObject);

  // console.log(checkReading.checked);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateObjectBooks(id, title, author, years, isCompleted) {
  return {
    id,
    title,
    author,
    years,
    isCompleted,
  };
}

function showBook(bookObject) {
  const title = document.createElement("h2");
  title.innerText = bookObject.title;

  const author = document.createElement("p");
  author.innerText = `Penulis: ${bookObject.author}`;

  const year = document.createElement("p");
  year.innerText = `Tahun: ${bookObject.years}`;

  const container = document.createElement("article");
  container.setAttribute("class", "book_item");
  container.append(title, author, year);

  container.setAttribute("id", `book-${bookObject.id}`);

  // ini untuk action button
  if (bookObject.isCompleted == true) {
    const button1 = document.createElement("button");
    button1.classList.add("green");
    button1.innerText = "Belum selesai dibaca ";
    button1.setAttribute("id", `${bookObject.id}`);

    button1.addEventListener("click", function () {
      undoButtonCompleted(bookObject.id);
    });

    const button2 = document.createElement("button");
    button2.classList.add("red");
    button2.innerText = "Hapus Buku";
    button2.setAttribute("id", `${bookObject.id}`);

    button2.addEventListener("click", function () {
      removeBookList(bookObject.id);
    });

    const action = document.createElement("div");
    action.classList.add("action");
    action.append(button1, button2);
    container.append(action);
  } else {
    //
    const button1 = document.createElement("button");
    button1.classList.add("green");
    button1.innerText = "Selesai dibaca ";
    button1.setAttribute("id", `${bookObject.id}`);

    button1.addEventListener("click", function () {
      booksCompleted(bookObject.id);
    });

    const button2 = document.createElement("button");
    button2.classList.add("red");
    button2.innerText = "Hapus Buku";
    button2.setAttribute("id", `${bookObject.id}`);

    button2.addEventListener("click", function () {
      removeBookList(bookObject.id);
    });

    const action = document.createElement("div");
    action.classList.add("action");
    action.append(button1, button2);
    container.append(action);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const uncompletedBookList = document.getElementById("incompleteBookshelfList");
  // console.log(uncompletedTODOList);
  uncompletedBookList.innerHTML = "";

  const completedBooksList = document.getElementById("completeBookshelfList");
  completedBooksList.innerHTML = "";

  // For Of digunakan untuk mengambil sebuah array menjadi 1 item yang masing-masing
  for (const item of books) {
    const elementBook = showBook(item);
    // uncompletedTODOList.append(elementBook);
    // console.log(elementBook);

    // console.log(item);
    // console.log(uncompletedTODOList);

    if (!item.isCompleted) {
      uncompletedBookList.append(elementBook);
      // console.log(item);
    } else {
      completedBooksList.append(elementBook);
    }
  }
});

function booksCompleted(booksId) {
  const BookTarget = findBook(booksId);

  if (BookTarget == null) return;

  BookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(booksId) {
  for (const BookItem of books) {
    if (BookItem.id === booksId) {
      return BookItem;
    }
  }
  return null;
}

// remove book
function removeBookList(booksId) {
  const bookTarget = findBookIndex(booksId);

  if (bookTarget == -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//
function undoButtonCompleted(booksId) {
  const BookTarget = findBook(booksId);

  if (BookTarget == null) return;

  BookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(todoId) {
  for (const index in books) {
    if (books[index].id === todoId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
