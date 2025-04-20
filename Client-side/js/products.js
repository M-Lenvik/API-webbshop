// Select the element where the error message will be displayed
const categoriesElement = document.getElementById('categories');

const fetchCategoryById = async () => {
    try {
        const response = await fetch ('http://localhost:3000/posts' + '/' + id);

        const data = await response.json();
        console.log('data från API:', data);
        const category = data; // Nu får du själva posten som ett objekt
        console.log('test', category);

                // Skapa en sträng med alla "planting"-värden
                
                

                const taskHtml = category.products.map(product => {
                    console.log('tasks:', category.products);
            return `
                <div class="task">
                    <p><strong>Plantering:</strong> ${product.title}</p>
                    <p><strong>Gjort:</strong> ${product.description ? "Ja" : "Nej"}</p>
                </div>
            `;
        }).join('');

        categoriesElement.innerHTML = 
            `<div>
                <p>
                <span class="type">${category.name}</span>
                                </p>
                <ul>
                ${taskHtml}
                </ul>
                <p>
                <span> <a href="index.html">Tillbaka</a></span>
                </p>
            </div>`


    } catch (error) {
        categoriesElement.innerHTML = "Något gick fel hos oss, försök igen lite senare";
        console.log('Catch error:', error);
    }
};


// 🔹 Ladda in poster från början
fetchCategoryById();
