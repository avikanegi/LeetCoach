const API_KEY = "YOUR_API_KEY";

async function getHints(problem) {

    const prompt = `
You are a DSA mentor.

Problem:
${problem.title}

Difficulty:
${problem.difficulty}

Description:
${problem.description}

Generate exactly 3 hints.

Rules:
- Don't reveal the solution.
- Don't write code.
- Hint 1 should be subtle.
- Hint 2 should guide the approach.
- Hint 3 can mention the data structure.

Return ONLY the hints.
`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    return data.candidates[0].content.parts[0].text;

}