const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const {
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
} = require("./db");

const app = express();

// Secret to sign JWTs
const jwtSecret = "votre_secret_jwt";

// CORS middleware to allow requests from the React frontend
app.use(
  cors({
    origin: "http://localhost:5174", // URL of React application
    credentials: true,
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to verify the JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.sendStatus(403); // Invalid token
    }

    req.user = user; // Store user info in the request
    next();
  });
}

// Login route

//POST
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check user info in the database
    const user = await isInDb(email, password);
    if (user.isAuth) {
      // Generate a JWT for the authenticated user
      const accessToken = jwt.sign(
        { id: user.authID, name: user.userName },
        jwtSecret,
        { expiresIn: "1h" }
      );
      res.json({ success: true, accessToken });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Registration route
app.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const success = await insertToDb(name, email, password);

    if (success) {
      const user = await isInDb(email, password);
      if (user.isAuth) {
        const accessToken = jwt.sign(
          { id: user.authID, name: user.userName },
          jwtSecret,
          { expiresIn: "1h" }
        );
        res.json({ success: true, accessToken });
      }
    } else {
      res.status(400).json({ success: false, message: "Registration failed" });
    }
  } catch (error) {
    console.error("Error inserting into DB:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please retry.",
    });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  // With JWT, logout is handled client-side by deleting the token
  res.json({ success: true, message: "Logged out successfully" });
});

// Create a Question Card
app.post("/CQ", authenticateJWT, async (req, res) => {
  const { title, questions } = req.body;

  try {
    // Insert the new title and get the new ID
    const response = await insertNewTitle(title, req.user.id);
    // Insert questions using the new ID
    const response1 = await insertQuestions(response.new_id, questions);
    res.status(200).json({
      message: "Title and questions successfully inserted",
      data: response1,
    });
  } catch (error) {
    console.error("Error inserting title or questions:", error);
    res.status(500).json({
      message: "An error occurred while inserting title and questions",
      error: error.message,
    });
  }
});

// Create a Question
app.post("/Question", authenticateJWT, async (req, res) => {
  const { listid, q } = req.body;
  if (!listid || !q) {
    return res.status(400).json({ message: "listid and q are required." });
  }
  try {
    const response1 = await insertQuestions(listid, q);
    console.log("Insert Questions Response:", response1);
    res.status(201).json({
      message: "Questions successfully inserted.",
      data: response1,
    });
  } catch (error) {
    console.error("Error inserting questions:", error);
    res.status(500).json({
      message: "An error occurred while inserting questions.",
      error: error.message,
    });
  }
});

// Create a new game Table
app.post("/newTable", async (req, res) => {
  const { id } = req.body;
  const questions = await getQuestions(id);
  //console.log(questions);

  axios
    .post("http://localhost:8080/newTable", {
      questions: questions,
    })
    .then((response) => {
      console.log("Response:", response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// GET
// Route to check authentication
app.get("/check-auth", authenticateJWT, (req, res) => {
  res.json({ authenticated: !!req.user, user: req.user || null });
});

// Get Question Cards
app.get("/QCards", authenticateJWT, async (req, res) => {
  try {
    let qcards = [];
    let cards = await getQCards(req.user.id);

    for (const card of cards) {
      const questions = await getQuestions(card.id);
      const qcard = { card: card, questions: questions };
      qcards.push(qcard);
    }
    res.json(qcards);
  } catch (error) {
    console.error("Error fetching QCards:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE

// Delete a Question
app.delete("/Question/:questionId", authenticateJWT, async (req, res) => {
  const questionId = parseInt(req.params.questionId, 10);

  if (isNaN(questionId)) {
    return res.status(400).json({ message: "Invalid question ID." });
  }

  try {
    const result = await deleteQuestion(questionId);

    if (result) {
      res.status(200).json({ message: "Question successfully deleted." });
    } else {
      res.status(404).json({ message: "Question not found." });
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      message: "An error occurred while deleting the question.",
      error: error.message,
    });
  }
});

// Delete a Question Card
app.delete("/CQ/:qcatdID", authenticateJWT, (req, res) => {
  const QCARDID = parseInt(req.params.qcatdID);
  deleteCard(QCARDID);
});

// PATCH

// Modifiy a Title
app.patch("/Title", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.body;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const updateResult = await updateTitleInDatabase(id, title);

    return res.status(200).json({ message: updateResult.message });
  } catch (error) {
    console.error("Error updating title:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the title" });
  }
});

// Modify a Question
app.patch("/Question", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.body;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Title is required" });
    }
    const updateResult = await updateQuestionInDatabase(id, question);

    return res.status(200).json({ message: updateResult.message });
  } catch (error) {
    console.error("Error updating title:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the title" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
