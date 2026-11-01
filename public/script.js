
const form = document.getElementById("surveyForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const survey = {
        name: document.getElementById("name").value,
        question1: document.getElementById("q1").value,
        question2: document.getElementById("q2").value,
        question3: document.getElementById("q3").value,
        question4: document.getElementById("q4").value
    };

    try {
        const response = await fetch("/api/surveys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(survey)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.textContent = "Thank you! Survey submitted successfully!";
        message.style.color = "green";

        form.reset();

    } catch (error) {
        message.textContent = "Submission failed. Please try again.";
        message.style.color = "red";
    }
});
