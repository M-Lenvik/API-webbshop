//Client-side/js/main.js
const categoriesElement = document.getElementById('categories');
const sortElement = document.getElementById('inputState');
const searchElement = document.getElementById('search');
const showAllButton = document.getElementById('showAll');

let currentSortOption = 'asc'; // Håller koll på aktuell sortering
let currentSearchTerm = ''; // Håller koll på aktuell sökning
let matchExactCategory = false;

const getQueryString = (e) => {
    if (e !== undefined) {
      console.log('Querystring', e.target)
      console.log(e.target.name)
      console.log(e.target.value)
      return `/?${e.target.name}=${e.target.value}`;
    }
  
    return ""
}

const fetchCategories = async (e) => {
    try {
        const url = new URL('http://localhost:3000/categories' + getQueryString(e));
        console.log('Querystring, fetchCategories:', getQueryString);

        if (currentSortOption) {
            url.searchParams.append('sort', currentSortOption);
        }

        if (currentSearchTerm) {
            url.searchParams.append('search', currentSearchTerm);
        }

        const [categoriesRes, productsRes] = await Promise.all([
            fetch(url),
            fetch('http://localhost:3000/products')
        ]);

        const categories = await categoriesRes.json();
        const products = await productsRes.json();
        let filteredCategories = categories;
        
        if (matchExactCategory) {
            filteredCategories = categories.filter(category =>
                category.name.toLowerCase() === currentSearchTerm.toLowerCase()
            );
        }
        //                <div class="products-container product-grid" style="display: none;"></div>
        // <div class="products-container product-grid">
        // bytt från 4 rader ned (53 i skrivande stund).    <div class="products-container" style="display: none;"></div>
        categoriesElement.innerHTML = filteredCategories.map((category) => `
            <div class="category-block" data-id="${category.id}">
                <h3 class="category-title">${category.name}</h3>
                <div class="products-container product-grid" style="display: none;"></div>

            </div>
        `).join('');
        console.log('Kategorier:', categories)
             

        document.querySelectorAll('.category-title').forEach(title => {
            title.addEventListener('click', async (event) => {
                const categoryBlock = event.target.closest('.category-block');
                const productsContainer = categoryBlock.querySelector('.products-container');
                const categoryId = parseInt(categoryBlock.dataset.id, 10);
        
                // Förhindra att produkterna hämtas om categoryId är ogiltigt
                if (!categoryId) {
                    console.error('Ogiltigt kategori-ID:', categoryId);
                    return;
                }
        
                try {
                    const response = await fetch(`http://localhost:3000/categories/${categoryId}/products`);  
                    const productsInCategory = await response.json();
        
                    // Kontrollera om det finns några produkter och rendera dem
                    if (productsInCategory.length > 0) {
                        productsContainer.innerHTML = productsInCategory.map(product => `
                            <div class="product">
                                <strong>${product.title}</strong><br>
                                <img src="/img/${product.image}" alt="${product.title}"><br>
                                ${product.description}<br>
                                Pris: ${product.price} kr<br>
                                
                                ${product.stock > 0 ? 
                                    `<span class="in-stock">Finns i lager</span>` 
                                    : `<span class="out-of-stock">Slutsåld</span>`
                                }
                            </div>
                        `).join('');
                    } 
                    //<img src="http://localhost:3000/img/${product.image}" alt="${product.title}">

                    else {
                        productsContainer.innerHTML = '<p>Det finns för närvarande inga produkter i denna kategori.</p>';
                    }
        
                    // Växla visning av produkterna
                    productsContainer.style.display = 
                    productsContainer.style.display === 'none' ? 'block' : 'none';
                } 
                catch (error) {
                    console.error('Fel vid hämtning av produkter:', error);
                    productsContainer.innerHTML = '<p>Kunde inte ladda produkter.</p>';
                }
            });
        });
        console.log('Produkter:', products);
    }

    catch (error) {
        categoriesElement.innerHTML = "Något gick fel hos oss, försök igen lite senare";
        console.log('Catch error:', error);
    }
};


/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*Buttons~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
sortElement.addEventListener('change', (event) => {
    currentSortOption = event.target.value;
    fetchCategories(); //Anropa fetchCategories med uppdaterade värden
});

searchElement.addEventListener('input', (event) => {
    currentSearchTerm = event.target.value;
    matchExactCategory = false; //Stäng av exakt matchning när användaren skriver något
    fetchCategories();
});

//Dynamiskt skapade knappar beroende på vilka kategorier som finns i databasen
const filterButtons = document.getElementById('filter-buttons');
async function renderFilterButtons() {
    try {
        const response = await fetch('http://localhost:3000/categories');
        const categories = await response.json();
        filterButtons.innerHTML = '';

        // Filtrera bort dolda/inaktiva kategorier
        const visibleCategories = categories.filter(category => {
            const notHidden = !category.hidden;
            const isActive = category.active !== false;
            return notHidden && isActive;
        });

        visibleCategories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.classList.add('category-filter-button');
            
            button.addEventListener('click', () => {
                currentSearchTerm = category.name;
                matchExactCategory = true;
                fetchCategories();
            });

            filterButtons.appendChild(button);
        });
    } 
    catch (error) {
        console.error('Kunde inte ladda filterknappar:', error);
        filterButtons.innerHTML = '<p>Fel vid hämtning av kategorier.</p>';
    }
}
//Visa alla knapparna
document.addEventListener('DOMContentLoaded', () => {
    renderFilterButtons();
  });

showAllButton.addEventListener('click', () => {
    currentSearchTerm = '';
    matchExactCategory = false;
    fetchCategories();
});

fetchCategories();