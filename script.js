const apiBaseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// function defaultFn() {
// 	const defaultFood = 'Arrabiata';
// 	searchFn(defaultFood);
// }

document.getElementById('searchBtn')
	.addEventListener('click', () => {
		const userIn = document.getElementById('searchInput').value.trim();
		if (userIn !== '') {
			searchFn(userIn);
		} else {
			alert('Please enter a recipe name.');
		}
	});

document.addEventListener('click', (event) => {
	if (event.target.classList.contains('show-recipe-btn')) {
		const rId = event.target.getAttribute('data-id');
		modalFn(rId);
	}
	if (event.target.id === 'closeBtn') {
		closeModalFn();
	}
});

defaultFn();

function searchFn(query) {
	const url = `${apiBaseUrl}${query}`;
	fetch(url)
		.then(res => res.json())
		.then(tmp => {
			if (tmp.meals) {
				showRecpsFn(tmp.meals);
			} else {
				noRecFn();
			}
		})
		.catch(error => console.error('Error fetching recipes:', error));
}

function showRecpsFn(recipes) {
	const rCont = document.getElementById('recipeContainer');
	rCont.innerHTML = '';
	recipes.slice(0, 20).forEach(recipe => {
		const card = document.createElement('div');
		card.classList.add('animate__animated', 'animate__fadeIn', 'recipe-card');
		card.innerHTML = `
			<h3>${recipe.strMeal}</h3>
			<img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
			<p>${recipe.strArea}</p>
			<p>${recipe.strCategory}</p>
			<button class="show-recipe-btn" data-id="${recipe.idMeal}">Show Recipe</button>
		`;
		rCont.appendChild(card);
	});
	if (recipes.length === 1) {
		const card = rCont.firstChild;
		card.style.margin = 'auto';
	}
}

function noRecFn() {
	const rCont = document.getElementById('recipeContainer');
	rCont.innerHTML = '<p>No Recipe found</p>';
}

function modalFn(recipeId) {
	const modalContent = document.getElementById('modalContent');
	modalContent.innerHTML = '';
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
		.then(response => response.json())
		.then(data => {
			const recipe = data.meals[0];
			modalContent.innerHTML = `
				<h2>${recipe.strMeal}</h2>
				<h3>Instructions:</h3>
				<p>${formatFn(recipe.strInstructions)}</p>
			`;
			document.getElementById('recipeModal').style.display = 'block';
		})
		.catch(error => console.error('Error fetching recipe details:', error));
}

function formatFn(instructions) {
	return instructions.split('\r\n').filter(instruction => instruction.trim() !== '').join('<br>');
}

function closeModalFn() {
	document.getElementById('recipeModal').style.display = 'none';
}
