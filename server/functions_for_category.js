const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./prova.db');

db.all("PRAGMA foreign_keys = ON"); //needed for the 'delete on cascade' functionality

const getCategories = (req,res) => {
  db.all("SELECT * FROM category",(err, rows) => {
    if (err) {
      res.json([])
    } else {
      res.json(rows)
    }
  })
}

const getCategory = (req, res) => {
  db.all("SELECT * FROM category WHERE id="+req.params.categoryId,(err, rows) => {
    if (err) {
      res.json({
        status: "SQL error"
      })
    } else {
      res.json(rows)
    }
  })
}

const getIdFromName = (req, res) => {
  db.all(`SELECT * FROM category WHERE name="${req.params.name}"`,(err, rows) => {
    if (err) {
      res.json({
        status: "SQL error"
      })
    } else {
      res.json(rows)
    }
  })
}

const createCategory = (req,res) => {
  const stmt = db.prepare("INSERT INTO category (name) VALUES (?)");
  const name = req.body.name
  stmt.run(name)
  stmt.finalize()
  db.all("SELECT last_insert_rowid() AS rowid", (err,rows) => {
    res.json({
      id: rows[0].rowid,
      location: `/categories/${rows[0].rowid}`
    })
  })
}

const deleteCategories = (req,res) => {
  db.run("DELETE FROM category")
  db.run("UPDATE SQLITE_SEQUENCE SET SEQ= '0' WHERE NAME='category'")
  res.json({deleted: 'true'})
}

const deleteCategory = (req,res) => {
  try {
    const {categoryId} = req.params
    const stmt = db.prepare("DELETE FROM category WHERE id = (?)");
    stmt.run(categoryId) //esecuzione della query passando i parametri
    stmt.finalize() //chiude la transazione, salva i dati
    res.json({
      idCategoria: categoryId
    })
  } catch (err) {
    res.json(err)
  }
}

const updateCategory = (req, res) => {
  const stmt = db.prepare(`UPDATE category SET name = (?) WHERE id = ${req.params.categoryId}`);
  stmt.run(req.body.name)
  stmt.finalize()
  res.json({request: 'PUT'})
}

module.exports = {getCategories, getCategory, getIdFromName, createCategory, 
  deleteCategories, deleteCategory, updateCategory};
