console.log("Hello, World!");

let API_KEY = 'AIzaSyDDdgZRtt__GDiz2RvkEWTEb7hR9AmF73Q';


const submitButton = document.getElementById("submitBtn");
const input = document.getElementById("prompt");
const result = document.querySelector(".result");
const fileInput = document.getElementById("chosenImage");

submitButton.addEventListener("click", async (e) => {
    e.preventDefault(); 

    result.innerHTML = "Recherche en cours...";

    let inputValue = input.value;
    let file = fileInput.files[0]; // Recup fichier au clic

    if (!file) {
        result.innerHTML = "Aucun fichier sélectionné.";
        return;
    }
    // fileReader pour lire le fichier localement
    let reader = new FileReader();
    console.log("file", file);
    reader.onload = async () => {
        try{
            let image = reader.result; 
        console.log("image", image);
        //split pour recuperer après la virgule : data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD etc...
        //avant la virgule c'est le type de l'image
        let type = image.split(",")[0]; // data:image/jpeg;base64
        console.log("type", type);
        //apres la virgule c'est le contenu de l'image
        let imageBase64 = reader.result.split(",")[1];

        let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                //envoi dans le body le contenu de l'image et la requete
                contents: [{ role: "user", parts: [{ inline_data: { mime_type: "image/jpeg", data: imageBase64 } }, { text: inputValue }] }]
            }),
        });

        if(!response.ok){
            throw new Error("erreur API", response.statusText);
        }


        let data = await response.json();
        console.log("data", data);
        result.innerHTML = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erreur.";
        console.log("candidates", data.candidates);
    } catch(error){
        console.log("erreur", error);
        result.innerHTML="erreur catchée";

    }
        }

    reader.readAsDataURL(file); // Lire le fichier et le convertir
});
