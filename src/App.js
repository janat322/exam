import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [authorInputValue, setAuthorInputValue] = useState('');
  const [titleInputValue, setTitleInputValue] = useState('');
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3001/books')
      .then(response => {
        setBooks(response.data);
        setBookCount(response.data.length);
      })
      .catch(error => console.log(error));
  }, []);

  const addBook = () => {
    axios.post('http://localhost:3001/books', {
      author: authorInputValue,
      title: titleInputValue,
      read: false
    })
      .then(response => {
        const newBook = response.data;
        setBooks(prevBooks => [...prevBooks, newBook]);
        setAuthorInputValue('');
        setTitleInputValue('');
        setBookCount(prevCount => prevCount + 1);
      })
      .catch(error => console.log(error));
  };

  const deleteBook = id => {
    axios.delete(`http://localhost:3001/books/${id}`)
      .then(() => {
        setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
        setBookCount(prevCount => prevCount - 1);
      })
      .catch(error => console.log(error));
  };

  const toggleRead = (id, read) => {
    axios.patch(`http://localhost:3001/books/${id}`, {
      read: !read
    })
      .then(() => {
        setBooks(prevBooks =>
          prevBooks.map(book => {
            if (book.id === id) {
              return { ...book, read: !read };
            }
            return book;
          })
        );
      })
      .catch(error => console.log(error));
  };

  const editBook = (id, author, title) => {
    setAuthorInputValue(author);
    setTitleInputValue(title);
  };

  const markAsRead = id => {
    toggleRead(id, false);
  };

  const markAsUnread = id => {
    toggleRead(id, true);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">My Library</h1>

      <div className="flex justify-between items-center my-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Author:</label>
          <input
            type="text"
            className="border rounded py-2 px-3"
            placeholder="Enter author name"
            value={authorInputValue}
            onChange={event => setAuthorInputValue(event.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Title:</label>
          <input
            type="text"
            className="border rounded py-2 px-3"
            placeholder="Enter book title"
            value={titleInputValue}
            onChange={event => setTitleInputValue(event.target.value)}
          />
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addBook}
        >
          Add Book
        </button>
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Author</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Read</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td className="border px-4 py-2">{book.author}</td>
              <td className="border px-4 py-2">{book.title}</td>
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  checked={book.read}
                  onChange={() => toggleRead(book.id, book.read)}
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  onClick={() => editBook(book.id, book.author, book.title)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => deleteBook(book.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Book Count:</label>
        <span>{bookCount}</span>
      </div>
    </div>
  );
}

export default App;
