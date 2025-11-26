// detalhes.js
const params = new URLSearchParams(window.location.search);
const name = params.get("pokemon");

const img = document.getElementById("pokemon-img");
const nameEl = document.getElementById("pokemon-name");
const typesEl = document.getElementById("pokemon-types");
const abilitiesEl = document.getElementById("pokemon-abilities");
const statsEl = document.getElementById("pokemon-stats");
const movesEl = document.getElementById("pokemon-moves");
const evolutionEl = document.getElementById("pokemon-evolution");

// Lista de arquivos JSON divididos
const jsonFiles = [
  "files/dados_part1.json",
  "files/dados_part2.json",
  "files/dados_part3.json",
  "files/dados_part4.json",
  "files/dados_part5.json",
  "files/dados_part6.json"
];

async function fetchPokemonLocal(pokemonName) {
  try {
    let allPokemons = [];

    // Carrega todas as partes do JSON
    for (const file of jsonFiles) {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`Não foi possível carregar ${file}`);
      const partData = await response.json();
      allPokemons = allPokemons.concat(partData);
    }

    const pokemon = allPokemons.find(
      (p) => p.name.toLowerCase() === pokemonName.toLowerCase()
    );

    if (!pokemon) throw new Error("Pokémon não encontrado.");

    displayPokemon(pokemon);
    displayEvolution(pokemon);
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

function displayPokemon(p) {
  img.src = p.img;
  img.alt = p.name;
  img.width = 150;
  img.height = 150;
  img.style.objectFit = "contain";

  nameEl.textContent = p.name.toUpperCase();
  document.getElementById("pokemon-id").textContent = `ID: ${p.id}`;
  document.getElementById("pokemon-height").textContent = `Altura: ${p.height / 10} m`;
  document.getElementById("pokemon-weight").textContent = `Peso: ${p.weight / 10} kg`;
  document.getElementById("pokemon-species").textContent = `Espécie: ${p.species}`;

  typesEl.innerHTML = "";
  p.types.forEach((t) => {
    const div = document.createElement("div");
    div.textContent = t.toUpperCase();
    div.className = `type type-${t}`;
    typesEl.appendChild(div);
  });

  abilitiesEl.innerHTML = `<strong>Habilidades:</strong> ${p.abilities.join(", ")}`;

  statsEl.innerHTML =
    `<tr><th>Estatística</th><th>Valor</th></tr>` +
    p.stats
      .map((s) => `<tr><td>${s.name}</td><td>${s.base}</td></tr>`)
      .join("");

  movesEl.innerHTML =
    `<tr><th>Movimento</th><th>Como Aprende</th></tr>` +
    p.moves
      .map((m) => {
        const moveName = m.move.name;
        const vgd = m.version_group_details[m.version_group_details.length - 1];

        let method = "";
        let sortOrder = 0;
        switch (vgd.move_learn_method.name) {
          case "level-up":
            method = vgd.level_learned_at ? `Lvl ${vgd.level_learned_at}` : "Level Up";
            sortOrder = 1;
            break;
          case "machine":
            method = "TM / HM";
            sortOrder = 2;
            break;
          case "tutor":
            method = "Tutor";
            sortOrder = 3;
            break;
          case "egg":
            method = "Egg";
            sortOrder = 4;
            break;
          default:
            method = vgd.move_learn_method.name || "???";
            sortOrder = 5;
        }

        return {
          name: moveName,
          method,
          level: vgd.level_learned_at || 0,
          sortOrder,
        };
      })
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        if (a.sortOrder === 1) return a.level - b.level;
        return 0;
      })
      .map((m) => `<tr><td>${m.name}</td><td>${m.method}</td></tr>`)
      .join("");
}

function displayEvolution(pokemon) {
  if (!pokemon.evolution_chain) {
    evolutionEl.innerHTML = "Linha evolutiva não disponível.";
    return;
  }

  function parseChain(node, arr = []) {
    arr.push({ species: node.species, details: node.evolution_details });
    node.evolves_to.forEach((next) => parseChain(next, arr));
    return arr;
  }

  const chain = parseChain(pokemon.evolution_chain);

  evolutionEl.innerHTML = "";
  evolutionEl.style.display = "flex";
  evolutionEl.style.alignItems = "center";
  evolutionEl.style.gap = "10px";

  for (let i = 0; i < chain.length; i++) {
    const p = chain[i];
    const container = document.createElement("div");
    container.className = "evolution-item";

    const imgEvo = document.createElement("img");
    imgEvo.src = `https://img.pokemondb.net/sprites/home/normal/${p.species.name}.png`;
    imgEvo.alt = p.species.name;
    imgEvo.width = 80;
    imgEvo.height = 80;
    imgEvo.style.objectFit = "contain";
    imgEvo.onerror = () => {
      imgEvo.src = "img/fallback.png";
    };

    const nameSpan = document.createElement("span");
    nameSpan.textContent = p.species.name.toUpperCase();
    nameSpan.className = "evolution-name";

    container.appendChild(imgEvo);
    container.appendChild(nameSpan);
    evolutionEl.appendChild(container);

    if (i < chain.length - 1) {
      const arrowDiv = document.createElement("div");
      arrowDiv.className = "evolution-arrow";
      const details = chain[i + 1].details[0];
      if (details) {
        switch (details.trigger.name) {
          case "level-up":
            arrowDiv.textContent = details.min_level ? `Lvl ${details.min_level}` : "Level Up";
            break;
          case "use-item":
            if (details.item) {
              const itemName = details.item.name.toLowerCase().replace(/\s/g, "-");
              const methodSpan = document.createElement("span");
              methodSpan.textContent = `Use ${itemName.replace(/-/g, " ")}`;
              methodSpan.style.marginRight = "5px";
              const itemImg = document.createElement("img");
              itemImg.src = `https://img.pokemondb.net/sprites/items/${itemName}.png`;
              itemImg.alt = itemName;
              itemImg.width = 24;
              itemImg.height = 24;
              itemImg.style.verticalAlign = "middle";
              itemImg.onerror = () => {
                itemImg.src = "img/item-fallback.png";
              };
              arrowDiv.appendChild(methodSpan);
              arrowDiv.appendChild(itemImg);
            } else arrowDiv.textContent = "Use Item";
            break;
          case "trade":
            arrowDiv.textContent = "Trade";
            break;
          default:
            arrowDiv.textContent = details.trigger.name;
        }
      } else arrowDiv.textContent = "???";

      evolutionEl.appendChild(arrowDiv);
    }
  }
}

// Chama a função principal
if (name) fetchPokemonLocal(name.toLowerCase());
