let urlTypes = "https://pokeapi.co/api/v2/type";
let urlLocation = "https://pokeapi.co/api/v2/pokemon-habitat"
let typesList;
let pokemon;
let homeUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=100";
let pokemonList;
let displayedPokemons = [];

//todo 1 : regrouper dans une seule fonction les instructions qui permettent d'afficher la page d'accueil : lancer cette fonction au démarrage du site ou si on clique sur "accueil"

const homeButton = document.querySelector('.nav-link.active');
homeButton.addEventListener('click', homePage);

function homePage() {

    for (let i = 0; i < 3; i++) {
        let id = getRandomIntInclusive(1, 1025);
        let urlCarousel = `https://pokeapi.co/api/v2/pokemon/${id}`;
        fetch(urlCarousel)
            .then(response => response.json())
            .then(response => pokemon = response)
            .then(() => constructCarouselItem(pokemon, i));
    }
    fetch(homeUrl)
        .then(response => response.json())
        .then(response => pokemonList = response.results)
        .then(() => displayPokemonList(pokemonList, document.getElementById("section2")));
}

homePage();

//todo 2 : établir une fonction qui se déclenche quand on clique pour voir un pokemon : le contenu est alors remplacé par les stats du pokemon choisi, ainsi que par des liens vers ses évolutions, ou d'autres pokemons (du même type ou de la même génération...)

function StatsPokemon(pokemonDetails, parentElement) {
    let pokemonElement = createElementFromHtml(
        `<div class="card w-50 m-auto text-center">
            <img src="${pokemonDetails.sprites.other.home.front_default}" class="card-img-top" alt="${pokemonDetails.name}">
            <div class="card-body">
            <h3 class="card-title">${capitalize(pokemonDetails.name)}</h3>
            <h5>Features : </h5>
                     <p>Type: ${pokemonDetails.types.map(type => type.type.name).join(', ')}</p>
                     <p>Weight: ${pokemonDetails.weight}</p>
                     <p>Height: ${pokemonDetails.height}</p>
                    <p>Experience: ${pokemonDetails.base_experience}</p>
                    <p>Abilities: ${pokemonDetails.abilities.map(ability => ability.ability.name).join(', ')}</p>

                    <h5>Statistics : </h5>
                    <ul>
                        ${pokemonDetails.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                    </ul>
                    </div>
                    </div>`
    );
    parentElement.appendChild(pokemonElement);
}

function handleStats(pokemonId) {
    document.getElementById("carousel").innerHTML = "";
    document.getElementById("section2").innerHTML = "";
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => response.json())
        .then(pokemonDetails => {
            document.getElementById("section2").innerHTML = "";
            StatsPokemon(pokemonDetails, document.getElementById("section2"));
        });
}

//todo 3 : gérer la barre de recherche : on tape le nom d'un pokemon et on le recupère. Si le pokemon est inconnu Que se passe-t-il ?

document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="search"]');
    const searchTerm = searchInput.value.trim().toLowerCase();
    searchInput.value = '';
    if (searchTerm === '') {
        alert('Veuillez entrer un nom de Pokémon valide.');
        return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
        .then(response => {
            if (!response.ok) {
                alert('Aucun Pokémon trouvé avec ce nom.');
                homePage();
                throw new Error('Aucun Pokémon trouvé avec ce nom.');
            }
            return response.json();
        })
        .then(pokemonDetails => {
            document.getElementById("carousel").innerHTML = "";
            document.getElementById("section2").innerHTML = "";
            StatsPokemon(pokemonDetails, document.getElementById("section2"));
        })
        .catch(error => console.error('Erreur lors de la recherche de Pokémon:', error));
});


//todo 4 : dropdown par espèce, par forme...

function constructDropdown2() {
    let dropdownElement = document.getElementById("location-dropdown");
    dropdownElement.innerHTML = "";

    fetch(urlLocation)
        .then(response => response.json())
        .then(response => {
            response.results.forEach(location => {
                let locationElement = `<li><p class="dropdown-item" onclick="handleLocation('${habitat.name}')">${capitalize(location.name)}</p></li>`;
                dropdownElement.insertAdjacentHTML('beforeend', locationElement);
            });
        })
}


fetch(urlTypes)
    .then(response => response.json())
    .then(response => typesList = response)
    .then(() => constructDropdown1(typesList.results))
    .then(() => constructDropdown2(typesList.results));


/**
 * @param {array} arr 
*/

/**
 * @param {array} e 
 */

function handleType(e) {
    document.getElementById("carousel").innerHTML = "";
    document.getElementById("section2").innerHTML = "";
    let pokemonType = e.target.textContent.toLowerCase();
    console.log(`https://pokeapi.co/api/v2/type/${pokemonType}`);
    fetch(`https://pokeapi.co/api/v2/type/${pokemonType}`)
        .then(response => response.json())
        .then(response => {
            console.log(response.pokemon);
            let pokemonList = response.pokemon.map(pokemon => pokemon.pokemon);
            console.log(pokemonList);
            displayPokemonList(pokemonList, document.getElementById("section2"));
        });

}


/**
 * @param {array} arr 
 */

function constructDropdown1(arr) {
    document.getElementById("types-dropdown1").innerHTML = "";
    for (item of arr) {
        let itemElement = `<li><p class="dropdown-item" onclick="handleType(event)">${capitalize(item.name)}</p></li>`;
        document.getElementById("types-dropdown1").insertAdjacentHTML("beforeend", itemElement);
    }
}

/**
 * @param {integer} min 
 * @param {integer} max 
 * @returns 
 */

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {string} str 
 * @returns 
 */
function createElementFromHtml(str) {
    var divElement = document.createElement("div");
    divElement.innerHTML = str.trim();
    return divElement.firstChild;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function constructCarouselItem(pokemon, i) {
    let carouselItemHtml = `
        <div class="carousel-item ">
            <div class="card">
                <img src="${pokemon.sprites.other.home.front_default}" class="card-img-top w-50 m-auto" alt="${pokemon.name}">
                <div class="card-body">
                    <h5 class="card-title">${capitalize(pokemon.name)}</h5>
                    <a href="#" class="btn btn-primary" onclick="handleStats(${pokemon.id})">Statistics</a>
                </div>
            </div>
        </div>`;
    let carouselItemElement = createElementFromHtml(carouselItemHtml);
    if (i == 0) {
        carouselItemElement.classList.add("active");
    }

    document.getElementById("carousel").insertAdjacentElement("afterbegin", carouselItemElement);
}

function displayPokemonList(arr, parentElement) {
    parentElement.innerHTML = "";
    for (item of arr) {
        let pokemonItem;
        fetch(item.url)
            .then(response => response.json())
            .then(response => pokemonItem = response)
            .then(() => {
                let pokemonElement = createElementFromHtml(
                    `
                    <div class="card w-25 mt-3 text-center">
                        <img src="${pokemonItem.sprites.other.home.front_default}" class="card-img-top w-50 m-auto" alt="${pokemonItem.name}">
                        <div class="card-body">
                            <h5 class="card-title">${capitalize(pokemonItem.name)}</h5>
                            <button class="btn btn-primary go-somewhere-btn" data-pokemon-id="${pokemonItem.id}">Statistics</button>
                        </div>
                    </div>`
                );
                parentElement.insertAdjacentElement("beforeend", pokemonElement);
                const goSomewhereBtn = pokemonElement.querySelector('.go-somewhere-btn');
                goSomewhereBtn.addEventListener('click', () => handleStats(pokemonItem.id));
            })
    }
}
