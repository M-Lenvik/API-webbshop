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


        categoriesElement.innerHTML = filteredCategories.map((category) => `
            <div class="category-block" data-id="${category.id}">
                <h3 class="category-title">${category.name}</h3>
                <form class="category-form" data-id="${category.id}">
                  <input name="name" value="${category.name}" />
                  <button type="submit">Uppdatera kategori</button>
                </form>


                <div class="products-container product-grid" style="display: none;"></div>
            </div>
        `).join('');
        console.log('Kategorier:', categories)
             
        document.querySelectorAll('.category-title').forEach(title => {
            title.addEventListener('click', async (event) => {
                const categoryBlock = event.target.closest('.category-block');
                const productsContainer = categoryBlock.querySelector('.products-container');
                const categoryId = parseInt(categoryBlock.dataset.id, 10);
        
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
                        <div class="product">  <form class="product-form" data-id="${product.id}">
                            
  
                                <label>Titel: <input type="text" name="title" value="${product.title}" /></label><br>
                                <label>Bildfil: <input type="text" name="image" value="${product.image}" /></label><br>
                                <img src="/img/${product.image}" alt="${product.title}" /><br>

                        
                              
                                <label>Beskrivning:<br>
                                  <textarea name="description">${product.description}</textarea>
                                </label><br>
                        
                                <label>Pris: <input type="number" name="price" value="${product.price}" /></label><br>
                                <label>Lager: <input type="number" name="stock" value="${product.stock}" /></label><br>
                        
                                <p>${product.stock > 0 
                                  ? `<span class="in-stock">Finns i lager</span>` 
                                  : `<span class="out-of-stock">Slutsåld</span>`
                                }</p>
                        
                                <button class="updateProduct" type="submit">Uppdatera produkt</button>
                                <button class="deleteProduct" data-id="${product.id}" type="button">Radera produkt</button>
                            </form>  
                            </div>
                        
                        `).join('');
                    } 
                    

                    else {
                        productsContainer.innerHTML = `
                        <p>Det finns för närvarande inga produkter i denna kategori.</p>
                        <button class="deleteCategoryBtn" data-id="${categoryId}">Ta bort kategori</button>
                      `;
                    }
        
                    // Växla visning av produkterna
                    productsContainer.style.display = 
                    productsContainer.style.display === 'none' ? 'flex' : 'none';
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


/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*UPDATE~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
/******************************CATEGORIES**********************************/
document.addEventListener('submit', async (e) => {
  if (e.target.classList.contains('category-form')) {
    e.preventDefault();

    const form = e.target;
    const categoryId = form.dataset.id;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(`http://localhost:3000/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Något gick fel vid uppdatering');
      }

      fetchCategories(); // Ladda om uppdaterade kategorier
    } catch (error) {
      console.error('Fel vid uppdatering:', error);
      alert('Kunde inte uppdatera kategori');
    }
  }
});


/******************************PRODUCTS**********************************/
document.addEventListener('submit', async (event) => {
  // Kolla om det är ett formulär med klassen "product-form"
  if (event.target.classList.contains('product-form')) {

    const form = event.target; // Formuläret
    const productId = form.dataset.id; // Hämta produktens ID från formens data-id

    // Samla in allt som användaren fyllt i
    const formData = new FormData(form); // Gör om formuläret till ett objekt
    const updatedProduct = Object.fromEntries(formData.entries()); 
    // Gör om till ett vanligt JavaScript-objekt som t.ex.:
    // { title: "Ny titel", price: "199", ... }

    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Kunde inte uppdatera produkten');
        return;
      }

      alert('Produkten uppdaterades!');
      fetchCategories();

    } catch (error) {
      console.error('Något gick fel:', error);
      alert('Kunde inte uppdatera produkten just nu');
    }
  }
});
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*UPDATE~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/

/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*DELETE~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('deleteCategoryBtn')) {
      const categoryId = e.target.dataset.id;
  
      if (!categoryId) return;
  
      //Kontrollera om kategorin innehåller produkter
      try {
        const response = await fetch(`http://localhost:3000/categories/${categoryId}/products`);
        const productsInCategory = await response.json();
  
        if (productsInCategory.length > 0) {
          alert('Kan inte ta bort kategori som innehåller produkter.');
          return;
        }

        const confirmed = confirm('Den här kategorin är tom. Vill du ta bort den?');
        if (confirmed) {
          const deleteResponse = await fetch(`http://localhost:3000/categories/${categoryId}`, {
            method: 'DELETE',
          });
  
          if (deleteResponse.ok) {
            alert('Kategorin togs bort.');
            fetchCategories();
          } else {
            const err = await deleteResponse.json();
            alert(err.message || 'Misslyckades att ta bort kategori');
          }
        }
      } catch (error) {
        console.error('Fel vid kontroll/tillägg:', error);
        alert('Ett fel uppstod vid borttagning');
      }
    }
  });

const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Fel vid borttagning');
      }
  
      return true;
    } catch (error) {
      console.error('Kunde inte ta bort produkt:', error);
      alert(error.message);
      return false;
    }
  };

  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('deleteProduct')) {
      const productId = e.target.dataset.id;
  
      if (confirm('Är du säker på att du vill ta bort produkten?')) {
        const wasDeleted = await deleteProduct(productId);
        if (wasDeleted) {
          alert('Produkten togs bort');
          fetchCategories();
        }
      }
      console.log('Delete product:', productId);
    }
  });
/*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*DELETE~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/


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

// Dynamiskt skapade knappar beroende på vilka kategorier som finns i databasen
const filterButtons = document.getElementById('filter-buttons');

async function renderFilterButtons() {
    try {
        const response = await fetch('http://localhost:3000/categories');
        const categories = await response.json();
        filterButtons.innerHTML = '';

        categories.forEach((category) => {
            if (category.hidden || category.active === false) return;

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
    } catch (error) {
        console.error('Kunde inte ladda filterknappar:', error);
        filterButtons.innerHTML = '<p>Fel vid hämtning av kategorier.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderFilterButtons();
});

showAllButton.addEventListener('click', () => {
    currentSearchTerm = '';
    matchExactCategory = false;
    fetchCategories();
});

fetchCategories();