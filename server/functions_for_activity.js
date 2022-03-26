const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./prova.db');


const getActivities = (req, res) => {
  db.all("select activity.name, activity.id, category_id, category.name as category_name \
  from activity, category where activity.category_id = category.id",function(err, rows) {
    if (err) {
      res.json([])
    } else {
      res.json(rows)
    }
  })
};


const getActivity = (req, res) => {
  db.all("SELECT * FROM activity WHERE id="+req.params.activityId,(err, rows) => {
    if (err)
      res.json({status: "SQL error"})
    else
      res.json(rows)
  })
}

const createActivity = (req,res) => {
  const stmt = db.prepare("INSERT INTO activity (name, category_id) VALUES (?,?)");
  const name = req.body.name
  const categoryId = parseInt(req.body.categoryId)
  if (name && categoryId) {
    stmt.run(name, categoryId)
    stmt.finalize()
    db.all("SELECT last_insert_rowid() AS rowid", (err,rows) => {
      res.json({
        id: rows[0].rowid,
        location: `/activites/${rows[0].rowid}`
      })
    })
  } else {
    res.json({status: 'error'})
  }
}

const deleteActivities = (req,res) => {
  db.run("DELETE FROM activity")
  db.run("UPDATE SQLITE_SEQUENCE SET SEQ= '0' WHERE NAME='activity'")
  res.json({deleted: 'true'})
}

const deleteActivity = (req,res) => {
  try {
    const {activityId} = req.params
    const stmt = db.prepare("DELETE FROM activity WHERE id = ?");
    stmt.run(activityId) //esecuzione della query passando i parametri
    stmt.finalize() //chiude la transazione, salva i dati
    res.json({idActivity: activityId})
  } catch (err) {
    res.json(err)
  }
}

const updateActivity = (req, res) => {
  const stmt = db.prepare(`UPDATE activity SET name = "${req.body.name}", category_id = (?) \
  WHERE id = ${req.params.activityId}`);
  stmt.run(req.body.category_id)
  stmt.finalize()
  res.json({request: 'PUT'})
}

module.exports = {getActivities, getActivity, createActivity, 
  deleteActivities, deleteActivity, updateActivity};
