const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks.then((bookList) => {
    res.send(JSON.stringify(bookList, null, 4));
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let filtered_books = [];
  for (let key in books) {
    if (books[key].author === author) {
      filtered_books.push(books[key]);
    }
  }
  res.send(filtered_books);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let filtered_books = [];
  for (let key in books) {
    if (books[key].title === title) {
      filtered_books.push(books[key]);
    }
  }
  res.send(filtered_books);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  // if review is empty {} return No reviews found for this book.
  if (Object.keys(books[isbn].reviews).length === 0) {
    return res.status(404).json({ message: "No reviews found for this book." });
  }
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
