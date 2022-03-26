// creazione database per il web service

const fs = require('fs')
const sqlite3 = require('sqlite3').verbose();

//elimina un eventuale precedente istanza
try { fs.unlinkSync("./prova.db") } catch (err) { }

const db = new sqlite3.Database('./prova.db');

fs.readFile('./database.json', 'utf8', (err, data) => {
  if (err) {
    console.log(`Error reading file from disk: ${err}`);
  } else {
    const database = JSON.parse(data);// parse JSON string to JSON object
    const categories = database.map(obj => obj.category)
    const activities = database.map(obj => obj.activities)

    db.serialize(() => {
      db.run(" \
      CREATE TABLE category ( \
        id INTEGER PRIMARY KEY AUTOINCREMENT, \
        name TEXT UNIQUE NOT NULL \
      );");
      db.run(" \
      CREATE TABLE activity ( \
        id INTEGER PRIMARY KEY AUTOINCREMENT, \
        name TEXT NOT NULL DEFAULT temporay_name, \
        category_id INTEGER, \
        FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE \
      );");

      //TODO: on delete cascade non funziona

      const stmt = db.prepare("INSERT INTO category (name) VALUES (?)");
      categories.map(category => stmt.run(category));
      stmt.finalize()

      categories.map((category, index) => {
        const s = db.prepare(`INSERT INTO activity (name, category_id) VALUES (?,${index + 1})`);
        activities[index].map(activity => s.run(activity))
        s.finalize()
      })

      db.each("SELECT * FROM category", (err, row) => console.log(row));
      db.all("SELECT  * FROM activity", (err, rows) => console.log(rows));
      db.run("PRAGMA foreign_keys=on;"); //needed for "on delete cascade" command
      
    });
    db.close();
  }
});

