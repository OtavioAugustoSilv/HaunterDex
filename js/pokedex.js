const tableBody = document.querySelector("#pokemon-table tbody");
const loader = document.getElementById("loader");

// Função para capitalizar nomes
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Buscar os primeiros 150 Pokémons da Kanto
async function fetchPokemons(limit = 1000000) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    );
    const data = await response.json();

    const pokemonList = data.results;
    for (let pokemon of pokemonList) {
      await fetchPokemonDetails(pokemon.url);
    }

    loader.style.display = "none";
  } catch (error) {
    loader.textContent = "Erro ao carregar Pokémons!";
    console.error(error);
  }
}

// Buscar detalhes de cada Pokémon
async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const row = document.createElement("tr");

    // Imagem
    const imgCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = data.sprites.front_default || "";
    img.alt = data.name;
    img.width = 80;
    imgCell.appendChild(img);
    row.appendChild(imgCell);

    // Nome
    // Nome com link
    const nameCell = document.createElement("td");
    const link = document.createElement("a");
    link.textContent = capitalize(data.name);
    link.href = `detalhes.html?pokemon=${data.name}`;
    link.style.color = "#d0a6ff"; // cor compatível com Haunter Dex
    link.style.textDecoration = "none";
    link.addEventListener(
      "mouseover",
      () => (link.style.textShadow = "0 0 10px #b24cff")
    );
    link.addEventListener("mouseout", () => (link.style.textShadow = "none"));
    nameCell.appendChild(link);
    row.appendChild(nameCell);

    // Tipo(s)
    const typeCell = document.createElement("td");
    typeCell.textContent = data.types
      .map((t) => capitalize(t.type.name))
      .join(" / ");
    row.appendChild(typeCell);

    // Número
    const numberCell = document.createElement("td");
    numberCell.textContent = `#${String(data.id).padStart(3, "0")}`;
    row.appendChild(numberCell);

    tableBody.appendChild(row);
  } catch (error) {
    console.error("Erro ao buscar detalhes do Pokémon:", error);
  }
}

// Inicia a listagem
fetchPokemons();
