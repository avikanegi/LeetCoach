console.log("Content script loaded!");
const titleElement = document.querySelector('a[href^="/problems/"]');
const difficultyElement = document.querySelector('[class*="difficulty-"]');

const paragraphs = document.querySelectorAll("p");

let description = "";

for (let i = 0; i < 3; i++) {
    description += `${paragraphs[i].textContent.trim()}\n\n`;
}

const problem = {
    title: titleElement.textContent.trim(),
    difficulty: difficultyElement.textContent.trim(),
    description: description
};

console.log("Title:", problem.title);
console.log("Difficulty:", problem.difficulty);
console.log("Description:\n" + problem.description);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received:", request);

    if (request.action === "getProblem") {
        console.log("Sending problem...");
        sendResponse(problem);
    }
});
