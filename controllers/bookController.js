import pool  from '../db/index.js'

export const addBook = async (req, res) => {
    const { title, author, published_year } = req.body;

try {

    const result = await pool.query(
        'INSERT INTO books (title, author, published_year) VALUES ($1, $2, $3) RETURNING *',
        [title, author, published_year]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "error: " + err });
  }
};

export const ShowBooks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: "error: " + err });
  }
};



export const ShowBookId = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      'SELECT * FROM books WHERE id = $1',
      [id]
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({message: "error: " + err });
  }
};



export const EditBook = async (req, res) => {
  const { title, author, published_year } = req.body;
  const id = req.params.id;

  try {
    await pool.query(
      'UPDATE books SET title=$1, author=$2, published_year=$3 WHERE id=$4',
      [title, author, published_year, id]
    );

    return res.status(200).json({ message: "Book Updated" });
  } catch (err) {
    return res.status(500).json({ message: "error: " + err });
  }
};



export const deleteBook = async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query(
      'DELETE FROM books WHERE id = $1',
      [id]
    );

    return res.status(200).json({ message: "Book Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "error: " + err });
  }
};

