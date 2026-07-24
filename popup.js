let currentProblem = null;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    if (!tabs[0]) {
        console.log("No active tab found.");
        return;
    }

    chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getProblem" },
        (response) => {

            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }

            if (!response) {
                console.log("No response received.");
                return;
            }

            // Save the problem for AI later
            currentProblem = response;

            // Show title
            document.getElementById("problem").textContent = response.title;

            // Show difficulty
            document.getElementById("difficulty").textContent = response.difficulty;

            // Show description
            const shortDescription =
                response.description.length > 180
                    ? response.description.substring(0, 180) + "..."
                    : response.description;

            document.getElementById("description").textContent = shortDescription;

            // Color the difficulty badge
            const difficulty = document.getElementById("difficulty");

            if (response.difficulty === "Easy") {
                difficulty.style.backgroundColor = "#d4edda";
                difficulty.style.color = "#155724";
            } else if (response.difficulty === "Medium") {
                difficulty.style.backgroundColor = "#ffeeba";
                difficulty.style.color = "#856404";
            } else if (response.difficulty === "Hard") {
                difficulty.style.backgroundColor = "#f8d7da";
                difficulty.style.color = "#721c24";
            }
        }
    );
});

// When the button is clicked
document.getElementById("hintBtn").addEventListener("click", async () => {

    if (!currentProblem) {
        alert("Problem data not loaded yet.");
        return;
    }

    document.getElementById("hintBtn").disabled = true;
    document.getElementById("hintBtn").textContent = "Generating...";

    try {

        const hints = await getHints(currentProblem);

        document.getElementById("hintBox").style.display = "block";
        document.getElementById("hintText").textContent = hints;

    } catch (error) {

        console.error(error);

        document.getElementById("hintBox").style.display = "block";
        document.getElementById("hintText").textContent =
            "❌ Failed to generate hints.";

    }

    document.getElementById("hintBtn").disabled = false;
    document.getElementById("hintBtn").textContent = "Generate Again";

});