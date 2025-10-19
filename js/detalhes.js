const params = new URLSearchParams(window.location.search);
const name = params.get("pokemon");

const img = document.getElementById("pokemon-img");
const nameEl = document.getElementById("pokemon-name");
const typesEl = document.getElementById("pokemon-types");
const abilitiesEl = document.getElementById("pokemon-abilities");
const statsEl = document.getElementById("pokemon-stats");
const movesEl = document.getElementById("pokemon-moves");
const evolutionEl = document.getElementById("pokemon-evolution");

async function fetchPokemon(pokemonName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if(!response.ok) throw new Error("Pokémon não encontrado");
    const data = await response.json();
    displayPokemon(data);
    fetchEvolution(data.species.url);
  } catch(error) {
    alert(error.message);
  }
}

function displayPokemon(pokemon) {
  img.src = pokemon.sprites.front_default || "";
  img.alt = pokemon.name;
  nameEl.textContent = pokemon.name.toUpperCase();

  document.getElementById("pokemon-id").textContent = `ID: ${pokemon.id}`;
  document.getElementById("pokemon-height").textContent = `Altura: ${pokemon.height / 10} m`;
  document.getElementById("pokemon-weight").textContent = `Peso: ${pokemon.weight / 10} kg`;
  document.getElementById("pokemon-species").textContent = `Espécie: ${pokemon.species.name}`;

  typesEl.innerHTML = "";
  pokemon.types.forEach(t => {
    const div = document.createElement("div");
    div.textContent = t.type.name.toUpperCase();
    div.className = `type type-${t.type.name}`;
    typesEl.appendChild(div);
  });

  abilitiesEl.innerHTML = `<strong>Habilidades:</strong> ${pokemon.abilities.map(a => a.ability.name).join(", ")}`;

  // Stats tabela
  statsEl.innerHTML = `<tr><th>Estatística</th><th>Valor</th></tr>` +
    pokemon.stats.map(s => `<tr><td>${s.stat.name}</td><td>${s.base_stat}</td></tr>`).join("");

  // Moves tabela com versão mais recente e ordenação
  movesEl.innerHTML = `<tr><th>Movimento</th><th>Como Aprende</th></tr>` +
    pokemon.moves
      .map(m => {
        // Pega a versão mais recente (último elemento)
        const vgd = m.version_group_details[m.version_group_details.length - 1];
        let method = "";
        let sortOrder = 0;

        switch(vgd.move_learn_method.name) {
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
            method = vgd.move_learn_method.name;
            sortOrder = 5;
        }

        return {
          name: m.move.name,
          method: method,
          level: vgd.level_learned_at || 0,
          sortOrder: sortOrder
        };
      })
      .sort((a, b) => {
        if(a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        if(a.sortOrder === 1) return a.level - b.level;
        if(a.sortOrder === 2) return a.tmNumber - b.tmNumber;
        return 0;
      })
      .map(m => `<tr><td>${m.name}</td><td>${m.method}</td></tr>`)
      .join("");
}

function parseEvolutionChain(chainNode, arr = []) {
  arr.push({
    name: chainNode.species.name,
    details: chainNode.evolution_details
  });

  chainNode.evolves_to.forEach(next => parseEvolutionChain(next, arr));
  return arr;
}

async function fetchEvolution(speciesUrl) {
  try {
    const response = await fetch(speciesUrl);
    const data = await response.json();
    const evoResponse = await fetch(data.evolution_chain.url);
    const evoData = await evoResponse.json();

    const chain = parseEvolutionChain(evoData.chain);

    evolutionEl.innerHTML = "";

    for (let i = 0; i < chain.length; i++) {
      const p = chain[i];
      const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
      const pokeData = await pokeResponse.json();

      const imgEvo = document.createElement("img");
      imgEvo.src = pokeData.sprites.front_default || "";
      imgEvo.alt = pokeData.name;
      imgEvo.className = "evolution-img";

      const span = document.createElement("span");
      span.textContent = pokeData.name.toUpperCase();
      span.className = "evolution-name";

      evolutionEl.appendChild(imgEvo);

      if (i < chain.length - 1) {
        const arrowDiv = document.createElement("div");
        arrowDiv.className = "evolution-arrow";

        const details = chain[i + 1].details[0];

        if (details) {
          switch(details.trigger.name) {
            case "level-up":
              arrowDiv.textContent = details.min_level ? `Lvl ${details.min_level}` : "Level Up";
              break;
            case "use-item":
              if (details.item) {
                const methodSpan = document.createElement("span");
                methodSpan.textContent = `Use ${details.item.name.replace("-", " ")}`;
                methodSpan.style.marginRight = "5px";

                const itemImg = document.createElement("img");
                itemImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${details.item.name}.png`;
                itemImg.alt = details.item.name;
                itemImg.style.width = "24px";
                itemImg.style.height = "24px";
                itemImg.style.verticalAlign = "middle";

                arrowDiv.appendChild(methodSpan);
                arrowDiv.appendChild(itemImg);
              } else {
                arrowDiv.textContent = "Use Item";
              }
              break;
            case "trade":
              arrowDiv.textContent = "Trade";
              break;
            default:
              arrowDiv.textContent = details.trigger.name;
          }
        } else {
          arrowDiv.textContent = "???";
        }

        evolutionEl.appendChild(arrowDiv);
      }
    }

  } catch (error) {
    evolutionEl.innerHTML = "Linha evolutiva não disponível.";
    console.error(error);
  }
}

if(name) fetchPokemon(name.toLowerCase());
