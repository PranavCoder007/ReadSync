import React,{useContext,useEffect,useState} from 'react';
import Librarybook from './librarybook';
import './library.css'
import Navbar from './Components/Navbar/Navbar.jsx'; 
import book1 from './assets/book1.jpg';
import book2 from './assets/book2.jpg';
import book3 from './assets/book3.jpg';
import book4 from './assets/book4.jpg';
import { UserContext } from './App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// const data = [
//     {
//       image: book1,
//       title: 'Rich Dad Poor Dad',
//       author: 'Robert Kiyosaki',
//     },
//     {
//       image: book2,
//       title: 'Cant Hurt Me',
//       author: 'David Goggins',
//     },
//     {
//       image: book3,
//       title: 'Harry Potter',
//       author: 'J.K. Rowling',
//     },
//     {
//       image: book4,
//       title: 'Power of the Subconscious Mind',
//       author: 'Joseph Murphy',
//     },
//     {
//         image: book1,
//         title: 'Temp',
//         author: 'Ayush aka Atom',
//       },
//   ];
const library = () => {
  const { userId ,token} = useContext(UserContext); 
  const [books, setBooks] = useState([]);  
  const [error, setError] = useState(null);
  const [storedUsername, setStoredUsername] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Get the username from localStorage
    const usernameFromStorage = localStorage.getItem('userlocal');
    if (usernameFromStorage) {
      setStoredUsername(usernameFromStorage);
    }
  }, []);
  useEffect(() => {
    console.log(userId+'akjbvd'+storedUsername);
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8000/library?userId=${storedUsername}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', 
        });

        const data = await response.json();
        // console.log(data.books);

        if (response.ok) {
          setBooks(data.books);
          console.log(data.books);
        } else {
          setError(data.message || 'Failed to load books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Error fetching books');
      }
    };

    if (storedUsername) {
      fetchBooks();  
    }
  }, [storedUsername]); 
  return (
    <div className='temp'>
      <Navbar />
    <div className="con">
     <div className='square'></div> 
      
      <div className="library-section">
        <h1>My Reads</h1>
        <div className="lib-diamond-line"></div>
        {error && <p className="error">{error}</p>}

        {books.length > 0 ? (
            books.map((book, index) => (
                <Librarybook book={book} key={index} />
            ))
          ) : (
            <p>No books found in your library</p>
          )}       
      </div>
      <div className="quote-section">
        <h3>Quotes</h3>
        <p>
          "One glance at a book and you hear the voice of another person, perhaps
          someone dead for 1,000 years. To read is to voyage through time."
          <br />– Carl Sagan
        </p>
        
        <p>
          "A book is a garden, an orchard, a storehouse, a party, a company by the way,
          a counselor, a multitude of counselors."
          <br />– Charles Baudelaire
        </p>
      </div>
    </div>
    </div>
  );
};

export default library;
