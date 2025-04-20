//Client-side/js/main.js
const categoriesElement = document.getElementById('categories');
const sortElement = document.getElementById('inputState');
const searchElement = document.getElementById('search');
const filterAccessoriesButton = document.getElementById('filterAccessories');
const filterElectronicsButton = document.getElementById('filterElectronics');
const filterClothsButton = document.getElementById('filterCloths');
const filterLightsButton = document.getElementById('filterLights');
const filterFurnituresButton = document.getElementById('filterFurnitures');
const filterLinnenButton = document.getElementById('filterLinnen');
const filterShoesButton = document.getElementById('filterShoes');
const filterOutdoorFutnituresButton = document.getElementById('filterOutdoorFutnitures');
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
            <div class="products-container" style="display: none;"></div>
        </div>
      `).join('');
      console.log('Kategorier:', categories)
     

        document.querySelectorAll('.category-title').forEach(title => {
        title.addEventListener('click', (event) => {
            const categoryBlock = event.target.closest('.category-block');
            const productsContainer = categoryBlock.querySelector('.products-container');
            const categoryId = parseInt(categoryBlock.dataset.id, 10);

            const productsInCategory = products.filter(
                product => product.categories_id === categoryId
                
            );
    

            productsContainer.innerHTML = productsInCategory.length > 0
            ? productsInCategory.map(product => `
                <div class="product">
                    <strong>${product.title}</strong><br>
                    Pris: ${product.price} kr<br>
                    ${product.description}
                </div>
            `).join('')
            : '<p>Inga produkter i denna kategori.</p>';

            // Visa/dölj produkterna (växla visning)
            productsContainer.style.display =
                productsContainer.style.display === 'none' ? 'block' : 'none';
            });
    
        });
        console.log('Produkter:', products);
        }

        catch (error) {
            categoriesElement.innerHTML = "Något gick fel hos oss, försök igen lite senare";
            console.log('Catch error:', error);
        }
};

sortElement.addEventListener('change', (event) => {
    currentSortOption = event.target.value; // Uppdatera global variabel
    fetchCategories(); // Anropa fetchPosts med uppdaterade värden
});

searchElement.addEventListener('input', (event) => {
    currentSearchTerm = event.target.value; // Uppdatera global variabel
    matchExactCategory = false; // Stäng av exakt matchning när användaren skriver något
    fetchCategories();
});


filterAccessoriesButton.addEventListener('click', () => {
    currentSearchTerm = 'Accessoarer';
    matchExactCategory = true;
    fetchCategories();
});

filterElectronicsButton.addEventListener('click', () => {
    currentSearchTerm = 'Elektronik';
    matchExactCategory = true;
    fetchCategories();
});

filterClothsButton.addEventListener('click', () => {
    currentSearchTerm = 'Kläder';
    matchExactCategory = true;
    fetchCategories();
});

filterLightsButton.addEventListener('click', () => {
    currentSearchTerm = 'Lampor';
    matchExactCategory = true;
    fetchCategories();
});

filterFurnituresButton.addEventListener('click', () => {
    currentSearchTerm = 'Möbler';
    matchExactCategory = true;
    fetchCategories();
});

filterLinnenButton.addEventListener('click', () => {
    currentSearchTerm = 'Sängkläder';
    matchExactCategory = true;
    fetchCategories();
});

filterShoesButton.addEventListener('click', () => {
    currentSearchTerm = 'Skor';
    matchExactCategory = true;
    fetchCategories();
});

filterOutdoorFutnituresButton.addEventListener('click', () => {
    currentSearchTerm = 'Utemöbler';
    matchExactCategory = true;
    fetchCategories();
});

showAllButton.addEventListener('click', () => {
    currentSearchTerm = '';
    matchExactCategory = false;
    fetchCategories();
});

  fetchCategories();


/*
  const productsByCategoryElement = document.getElementById('products-by-category');

  const fetchCategoriesAndProducts = async () => {
      try {
          const [categoriesRes, productsRes] = await Promise.all([
              fetch('http://localhost:3000/categories'),
              fetch('http://localhost:3000/products')
          ]);
  
          const categories = await categoriesRes.json();
          const products = await productsRes.json();
  
          productsByCategoryElement.innerHTML = categories.map(category => {
              const productsInCategory = products.filter(
                  product => product.categories_id === category.id // ändra till rätt fältnamn om det skiljer sig
              );
  
              if (productsInCategory.length === 0) return '';
  
              return `
                  <div class="category-block">
                      <h3>${category.name}</h3>
                      ${productsInCategory.map(product => `
                          <div class="product">
                              <strong>${product.title}</strong><br>
                              Pris: ${product.price} kr<br>
                              ${product.description}
                          </div>
                      `).join('')}
                  </div>
              `;
          }).join('');
  
      } catch (err) {
          productsByCategoryElement.innerHTML = "Kunde inte ladda kategorier och produkter.";
          console.error(err);
      }
  };
  
  fetchCategoriesAndProducts();
  */

  /*
  categoriesElement.innerHTML = filteredCategories.map((category) => `
  <div class="category-block" data-id="${category.id}">
      <h3 class="category-title">${category.name}</h3>
      <div class="products-container" style="display: none;"></div>
  </div>
`).join('');

// Lägg till event listeners
document.querySelectorAll('.category-title').forEach(title => {
  title.addEventListener('click', (event) => {
      const categoryBlock = event.target.closest('.category-block');
      const productsContainer = categoryBlock.querySelector('.products-container');
      const categoryId = parseInt(categoryBlock.dataset.id, 10);

      const productsInCategory = products.filter(
          product => product.categories_id === categoryId
      );

      productsContainer.innerHTML = productsInCategory.length > 0
          ? productsInCategory.map(product => `
              <div class="product">
                  <strong>${product.title}</strong><br>
                  Pris: ${product.price} kr<br>
                  ${product.description}
              </div>
          `).join('')
          : '<p>Inga produkter i denna kategori.</p>';

      // Visa/dölj produkterna (växla visning)
      productsContainer.style.display =
          productsContainer.style.display === 'none' ? 'block' : 'none';
  });
});
*/