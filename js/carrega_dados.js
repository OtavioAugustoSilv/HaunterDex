const tableBody = document.querySelector("#pokemon-table tbody");
const loader = document.getElementById("loader");

let allPokemons = [];
let offset = 0;
const limit = 50;

// Lista de arquivos JSON divididos
const jsonFiles = [
  "files/dados_part1.json",
  "files/dados_part2.json",
  "files/dados_part3.json",
  "files/dados_part4.json",
  "files/dados_part5.json",
  "files/dados_part6.json"
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Função para carregar todas as partes do JSON
async function fetchAllJsonParts() {
  loader.textContent = "Carregando Pokémons...";

  try {
    for (const file of jsonFiles) {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`Não foi possível carregar ${file}`);
      const partData = await response.json();
      allPokemons = allPokemons.concat(partData);
    }

    // Ordena pelo ID
    allPokemons.sort((a, b) => a.id - b.id);

    tableBody.innerHTML = ""; // limpa tabela

    // Carrega o primeiro lote
    loadNextBatch();

    // Scroll infinito
    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadNextBatch();
      }
    });

  } catch (err) {
    loader.textContent = "Erro ao carregar Pokémons!";
    console.error(err);
  }
}

function loadNextBatch() {
  if (offset >= allPokemons.length) {
    loader.style.display = "none"; // todos carregados
    return;
  }

  const batch = allPokemons.slice(offset, offset + limit);
  const fragment = document.createDocumentFragment();

  batch.forEach(pokemon => {
    const row = document.createElement("tr");

    // Imagem
    const imgCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = pokemon.img;
    img.alt = pokemon.name;
    img.width = 80;
    img.height = 80;
    img.style.objectFit = "contain";
    img.onerror = () => { img.src = "img/fallback.png"; };
    imgCell.appendChild(img);
    row.appendChild(imgCell);

    // Nome com link
    const nameCell = document.createElement("td");
    const link = document.createElement("a");
    link.textContent = capitalize(pokemon.name);
    link.href = `detalhes.html?pokemon=${pokemon.name}`;
    link.style.textDecoration = "none";
    link.addEventListener("mouseover", () => link.style.textShadow = "0 0 10px #b24cff");
    link.addEventListener("mouseout", () => link.style.textShadow = "none");
    nameCell.appendChild(link);
    row.appendChild(nameCell);

    // Tipos
    const typeCell = document.createElement("td");
    typeCell.textContent = pokemon.types.map(t => capitalize(t)).join(" / ");
    row.appendChild(typeCell);

    // Número
    const numberCell = document.createElement("td");
    numberCell.textContent = `#${String(pokemon.id).padStart(3, "0")}`;
    row.appendChild(numberCell);

    fragment.appendChild(row);
  });

  tableBody.appendChild(fragment);
  offset += limit;
}

// Chama a função principal
fetchAllJsonParts();
