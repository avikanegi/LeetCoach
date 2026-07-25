require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
    res.send("LeetCoach Backend is Running 🚀");
});

app.post("/hint", async (req, res) => {

    try {

        const problem = req.body;

        const prompt = `
You are an expert DSA mentor.

Problem:
${problem.title}

Difficulty:
${problem.difficulty}

Description:
${problem.description}

Generate exactly 3 hints.

Rules:
- Do not give the solution.
- Do not write code.
- Hint 1 should be subtle.
- Hint 2 should guide the student.
- Hint 3 may mention the data structure.

Return only the hints.
`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        res.json({
            hints: completion.choices[0].message.content
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to generate hints."
        });

    }

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});