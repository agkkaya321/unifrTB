const sqlite3 = require("sqlite3").verbose();

// Connect to the database
const db = new sqlite3.Database(
  "./users.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, // Ensures the database is created if it doesn't exist
  (error) => {
    if (error) {
      console.log("Erreur de connexion à la base de données:", error.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
  }
);

// SQL functions
async function insertToDb(nom, email, password) {
  const sql = "INSERT INTO users(nom, email, pass) VALUES (?, ?, ?);";
  try {
    await runQuery(sql, [nom, email, password]);
    return { success: true };
  } catch (err) {
    throw new Error(`Failed to insert user: ${err.message}`);
  }
}

async function isInDb(email, password) {
  const sql = "SELECT * FROM users WHERE email = ? AND pass = ?";
  try {
    const row = await getQuery(sql, [email, password]);
    if (row) {
      return { isAuth: true, authID: row.id, userName: row.nom };
    }
    return { isAuth: false };
  } catch (err) {
    throw new Error(`Error checking user: ${err.message}`);
  }
}

async function getQCards(userID) {
  const sql = "SELECT * FROM ldq WHERE pid = ?";
  try {
    const rows = await getAllQuery(sql, [userID]);
    return rows;
  } catch (err) {
    throw new Error(`Failed to get QCards: ${err.message}`);
  }
}

async function getQuestions(listeID) {
  const sql = "SELECT * FROM question WHERE listid = ?";
  try {
    const rows = await getAllQuery(sql, [listeID]);
    return rows;
  } catch (err) {
    throw new Error(`Failed to get questions: ${err.message}`);
  }
}

async function deleteQuestion(qID) {
  const sql = "DELETE FROM question WHERE id = ?";
  try {
    const changes = await runQuery(sql, [qID]);
    return {
      message: "Question deleted successfully",
      changes,
    };
  } catch (err) {
    throw new Error(`Failed to delete question: ${err.message}`);
  }
}

async function deleteCard(cID) {
  const sql = "DELETE FROM ldq WHERE id = ?";
  try {
    const changes = await runQuery(sql, [cID]);
    return {
      message: "Question deleted successfully",
      changes,
    };
  } catch (err) {
    throw new Error(`Failed to delete question: ${err.message}`);
  }
}

async function insertNewTitle(title, pid) {
  const insertSql = "INSERT INTO ldq (pid, nom) VALUES (?, ?);";
  try {
    const newId = await runQuery(insertSql, [pid, title]);
    return {
      message: "Title inserted successfully",
      new_id: newId,
    };
  } catch (err) {
    throw new Error(`Failed to insert title: ${err.message}`);
  }
}

async function insertQuestions(listid, questions) {
  const insertSql = "INSERT INTO question (listid, q) VALUES (?, ?)";
  try {
    for (const q of questions) {
      await runQuery(insertSql, [listid, q]);
    }
    return { message: "Questions inserted successfully" };
  } catch (err) {
    throw new Error(`Failed to insert questions: ${err.message}`);
  }
}

async function updateTitleInDatabase(id, title) {
  const sql = "UPDATE ldq SET nom = ? WHERE id = ?;";
  try {
    await runQuery(sql, [title, id]);
    return { message: "Title updated successfully" };
  } catch (err) {
    throw new Error(`Failed to update title: ${err.message}`);
  }
}

async function updateQuestionInDatabase(question, id) {
  if (!id || !question) {
    throw new Error("Both ID and question must be provided");
  }
  const sql = "UPDATE question SET q = ? WHERE id = ?;";
  try {
    const result = await runQuery(sql, [question, id]);
    return { success: true, message: "Question updated successfully" };
  } catch (err) {
    console.error("Database error:", err);
    throw new Error(`Failed to update question: ${err.message}`);
  }
}

/////////////////////////////////////////////////////////////////////////////////
//                          HELPER FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////
function runQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID || this.changes);
      }
    });
  });
}

function getQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function getAllQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Export functions
module.exports = {
  insertToDb,
  isInDb,
  getQCards,
  getQuestions,
  deleteQuestion,
  insertNewTitle,
  insertQuestions,
  deleteCard,
  updateTitleInDatabase,
  updateQuestionInDatabase,
};
