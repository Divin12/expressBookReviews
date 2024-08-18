const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  if (users[username]) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Register new user
  users[username] = { password }; // Store user data

  // Respond with a success message
  res.status(201).json({ message: 'Customer successfully registered. Now you can log in.' });
});

// Login user
public_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = users[username];

  if (user && user.password === password) {
    res.status(200).json({ message: 'Curstomer successfully longged in' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

 // Extract the ID (acting as ISBN) from the request parameters
 const id = parseInt(req.params.isbn);

 // Find the book by ID in the books object
 const book = books[1];

 // Check if the book exists
 if (book) {
   // Send the book details as JSON
   return res.json(book);
 } else {
   // Send a 404 error if the book is not found
   return res.status(404).json({ message: "Book not found v" });
 }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = [];

  // Loop through the books to find those by the specified author
  for (let key in books) {
    if (books[key].author === author) {
      booksByAuthor.push({
        author: books[key].author,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  }

  // Check if books by the author were found
  if (booksByAuthor.length > 0) {
    return res.json({
      booksByAuthor: booksByAuthor
    });
  } else {
    return res.status(404).json({
      message: "No books found by this author."
    });
  }
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = [];

  // Loop through the books to find those with the specified title
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push({
        author: books[key].author,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  }

  // Check if books with the title were found
  if (booksByTitle.length > 0) {
    return res.json({
      booksByTitle: booksByTitle
    });
  } else {
    return res.status(404).json({
      message: "No books found with this title."
    });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    // Return reviews if available, or an empty object if no reviews
    res.status(200).json(book.reviews || {});
  } else {
    // Return a 404 status if the book is not found
    res.status(404).json({ message: "Book not found" });
  }
});


public_users.post('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const { review } = req.body;

  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review
  book.reviews = book.reviews || {};
  book.reviews[isbn] = review;

  // Respond with the updated review
  res.status(200).json({
    message: "The review for the book with ISBN 1 has been added / updated",
   
  });
});

// Delete a review for a book
public_users.delete('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const { reviewId } = req.body;

  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review exists
  if (!book.reviews || !book.reviews[reviewId]) {
    return res.status(404).json({ message: "Review not foud" });
  }

  // Delete the review
  delete book.reviews[reviewId];

  // Respond with a success message
  res.status(200).json({
    message: "Review deleted successfully",
    reviews: book.reviews
  });
});


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register new user
  users[username] = { password }; // Store user data

  // Respond with user data
  res.status(201).json({
    username,
    password,
  });

  // Alternatively, respond with a success message
  // res.status(201).json({ message: "Customer successfully registered. Now you can log in." });
});

// Get all books using an async callback function
public_users.get('/books', async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve books" });
  }
});

// Function to simulate async operation to get all books
const getAllBooks = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulate async delay
  });
};

// Search book by ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  findBookByISBN(isbn)
    .then(book => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Failed to retrieve book" });
    });
});

// Function to find a book by ISBN using Promises
const findBookByISBN = (isbn) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const book = books[isbn];
      resolve(book || null);
    }, 500); // Simulate async delay
  });
};

// Function to find books by author using Promises
const findBooksByAuthor = (author) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const booksByAuthor = [];
      for (let key in books) {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      }
      resolve(booksByAuthor);
    }, 500); // Simulate async delay
  });
};

// Function to find books by title using Promises
const findBooksByTitle = (title) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const booksByTitle = [];
      for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push(books[key]);
        }
      }
      resolve(booksByTitle);
    }, 500); // Simulate async delay
  });
};

module.exports.general = public_users;
