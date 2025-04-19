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
  
      return `/?${e.target.name}`;
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

        const response = await fetch(url);
        const data = await response.json();

        let filteredData = data;
        
        if (matchExactCategory) {
            filteredData = data.filter(category =>
                category.name.toLowerCase() === currentSearchTerm.toLowerCase()
            );
        }

        categoriesElement.innerHTML = filteredData.map((category) =>
            `<div>
                <p>
                <span class="category">${category.name}</span>

                </p>
            </div>`
        ).join('');

        console.log('Data:', data);
    } catch (error) {
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