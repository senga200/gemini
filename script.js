//const { GenerativeModel } = require("@google/generative-ai");



let API_KEY = 'AIzaSyDDdgZRtt__GDiz2RvkEWTEb7hR9AmF73Q';

//  bloc 1 : texte
const submitButtonText = document.getElementById("submitBtnText");
const inputText = document.getElementById("promptText");
const resultText = document.querySelector(".text-result");

// bloc 2 : image + texte
const submitButton = document.getElementById("submitBtn");
const input = document.getElementById("prompt");
const result = document.querySelector(".result");
const fileInput = document.getElementById("chosenImage");

// bloc 3 : agent film 
const propositionButtonsFilm = document.querySelectorAll(".propositionFilm");
const resultAgentFilm = document.querySelector(".agent-result-film");


// bloc 3 : agent quizz musique
const submitButtonAgent = document.getElementById("submitBtnAgent");
const resultAgent = document.querySelector(".agent-result");
const generatedQuestionElement = document.getElementById("questionGenerator");
const propositionButtons = document.querySelectorAll(".proposition");


// --------------- BLOC 1 : TEXTE ------------------
submitButtonText.addEventListener("click", async (e) => {
    e.preventDefault();

    resultText.innerHTML = "Recherche en cours...";
    let inputValue = inputText.value;

    try {
        let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: inputValue }] }]
            }),
        });

        if (!response.ok) {
            throw new Error("erreur API", response.statusText);
        }

        let data = await response.json();
        resultText.innerHTML = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erreur.";
    } catch (error) {
        console.log("erreur", error);
        resultText.innerHTML = "Erreur attrapée dans le bloc texte.";
    }
});
// --------------- BLOC 2 : IMAGE + TEXTE ------------------
submitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    result.innerHTML = "Recherche en cours...";
    let inputValue = input.value;
    let file = fileInput.files[0];

    if (!file) {
        result.innerHTML = "Aucun fichier sélectionné.";
        return;
    }

    let reader = new FileReader();

    reader.onload = async () => {
        try {
            let image = reader.result;
            let type = image.split(",")[0];
            let imageBase64 = image.split(",")[1];

            let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [
                            { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
                            { text: inputValue }
                        ]
                    }]
                }),
            });

            if (!response.ok) {
                throw new Error("erreur API", response.statusText);
            }

            let data = await response.json();
            result.innerHTML = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erreur.";
        } catch (error) {
            console.log("erreur", error);
            result.innerHTML = "Erreur attrapée dans le bloc image.";
        }
    };

    reader.readAsDataURL(file);
});

// --------------- BLOC 3 : AGENT PROPOSITION FILM------------------
propositionButtonsFilm.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
        e.preventDefault();

    for (const btn of propositionButtonsFilm) {
        btn.classList.remove("selected");
    }

    btn.classList.add("selected");
    resultAgentFilm.innerHTML = "Génération d'idée de film en cours...";

    let genre = btn.innerText.trim();
    console.log("Genre sélectionné :", genre);

    const prompt = `
    Tu es un assistant virtuel spécialisé dans la recommandation de films. Ta mission est de me proposer un film à regarder en fonction du genre que je t'indique.

    Si je te demande :
        "Propose-moi un film ${genre}."
        Tu me réponds :
        {
            "film": "Titre du film",
            "genre": "${genre}",
            "année": "Année de sortie",
            "synopsis": "Description du film."
        }

        Maintenant, propose-moi un film ${genre} en suivant le même format JSON strict, sans ajouter de commentaires ni de texte hors du JSON.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            }),
        });

        if (!response.ok) throw new Error("Erreur API : " + response.statusText);

        const data = await response.json();
        let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        // Nettoyage du JSON (suppression éventuelle des ```json et ```)
        resultText = resultText.replace(/```json|```/g, "").trim();
        
        const movie = JSON.parse(resultText);

        resultAgentFilm.innerHTML = `
        <strong>Film :</strong> ${movie.film} <br>
        <strong>Genre :</strong> ${movie.genre} <br>
        <strong>Année :</strong> ${movie.année} <br>
        <strong>Synopsis :</strong> ${movie.synopsis}
        `;
        resultAgentFilm.style.display = "block";
        console.log(movie);

    } catch (error) {
        console.error("Erreur attrapée :", error);
        resultAgentFilm.innerHTML = "❌ Une erreur est survenue lors de la génération.";
        resultAgentFilm.style.display = "block";
    }
    });
});

// --------------- BLOC 3 : AGENT QUIZZ MUSIQUE ------------------
submitButtonAgent.addEventListener("click", async (e) => {
    e.preventDefault();

    resultAgent.style.display = "none";
    resultAgent.innerHTML = "";
    propositionButtons.forEach((btn) => {
        btn.style.display = "none";
        btn.textContent = "";
    });

    generatedQuestionElement.innerHTML = "🎵 Génération de la question musicale en cours...🎵";
    generatedQuestionElement.style.display = "block";

    const prompt = `
    Tu es un générateur de questions de quiz musical, spécialisé dans la musique française et anglo-saxonne entre 1970 et 2000.

    Ta mission est de générer UNE SEULE question originale de type Trivial Pursuit, avec 4 propositions (A, B, C, D), dont une seule est correcte.

    Voici des exemples de ce qu'on attend de toi :

    Si je te demande :
    "Qui a sorti l'album 'Thriller' en 1982 ?"
    
    Tu me réponds :
    {
      "question": "Qui a sorti l'album 'Thriller' en 1982 ?",
      "propositions": ["Prince", "Michael Jackson", "Stevie Wonder", "Madonna"],
      "bonneReponse": "Michael Jackson"
    }
    
    Si je te demande :
    "Quel groupe a chanté 'Bohemian Rhapsody' ?"
    
    Tu me réponds :
    {
      "question": "Quel groupe a chanté 'Bohemian Rhapsody' ?",
      "propositions": ["Queen", "Pink Floyd", "The Beatles", "Led Zeppelin"],
      "bonneReponse": "Queen"
    }
    
    Si je te demande :
    "Quelle chanteuse française a interprété 'Joe le taxi' ?"
    
    Tu me réponds :
    {
      "question": "Quelle chanteuse française a interprété 'Joe le taxi' ?",
      "propositions": ["France Gall", "Mylène Farmer", "Vanessa Paradis", "Patricia Kaas"],
      "bonneReponse": "Vanessa Paradis"
    }

    Maintenant, génère UNE NOUVELLE question originale dans le même style, avec le même format JSON STRICTEMENT, sans ajouter de commentaires ni de texte hors du JSON.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            }),
        });

        if (!response.ok) throw new Error("Erreur API : " + response.statusText);

        const data = await response.json();
        let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        // Nettoyage du JSON (suppression éventuelle des ```json et ```)
        resultText = resultText.replace(/```json|```/g, "").trim();
        
        const quiz = JSON.parse(resultText);

        generatedQuestionElement.innerHTML = quiz.question;

        propositionButtons.forEach((btn, index) => {
            btn.textContent = quiz.propositions[index];
            btn.style.display = "inline-block";

            btn.onclick = () => {
                if (quiz.propositions[index] === quiz.bonneReponse) {
                    resultAgent.innerHTML = "✅ Bonne réponse !";
                    resultAgent.style.color = "green";
                } else {
                    resultAgent.innerHTML = `❌ Mauvaise réponse. `;
                    resultAgent.style.color = "red";
                }
                resultAgent.style.display = "block";
                console.log(`La bonne réponse est : ${quiz.bonneReponse}`);
            };
        });
    } catch (error) {
        console.error("Erreur attrapée :", error);
        resultAgent.innerHTML = "❌ Une erreur est survenue lors de la génération.";
        resultAgent.style.display = "block";
    }
});
