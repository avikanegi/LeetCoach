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

console.log(req.body.description);
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
- Do not reveal the solution.
- Do not write code.
- Hint 1 should be subtle.
- Hint 2 should guide the student.
- Hint 3 may mention the data structure.

Return ONLY valid JSON.

Format exactly like this:

{
  "hints": [
    "Hint 1",
    "Hint 2",
    "Hint 3"
  ]
}

Do not include markdown.
Do not include explanation.
Return only raw JSON.
Do not use markdown formatting.
Do not add any explanation.
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

       const aiResponse = completion.choices[0].message.content;

// Convert the JSON string returned by the AI into a JavaScript object
const parsed = JSON.parse(aiResponse);

res.json(parsed);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to generate hints."
        });

    }

});
app.post("/explain", async (req, res) => {

    try {

        const { title, difficulty, description, code } = req.body;

        const prompt = `
You are an expert DSA mentor.

Problem:
${title}

Difficulty:
${difficulty}

Description:
${description}

Student's Code:
${code}

Your job:
- Explain what is wrong with the student's approach.
- Point out logical mistakes.
- Mention missing edge cases if any.
- Do NOT provide the full solution.
- Do NOT rewrite the code.
- Give guidance instead.

Respond in plain English.
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
            feedback: completion.choices[0].message.content
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to analyze code."
        });

    }

});
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});