const categoriesElement = document.getElementById('categories');


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

        const response = await fetch(url);
        const data = await response.json();

        categoriesElement.innerHTML = data.map((category) =>
            `<div>
                <p>
                <span class="name">${category.name}</span>
                </p>
            </div>`
        ).join('');

        console.log('Data:', data);
    } catch (error) {
        categoriesElement.innerHTML = "Något gick fel hos oss, försök igen lite senare";
        console.log('Catch error:', error);
    }
};

  fetchCategories();