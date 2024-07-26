let pokemon = [];
let maxPokemon = -1;
let selection = [];
let selectedPokemon = 0;

function NextPokemon() {
    console.log("Transicionando al siguiente Pokémon");
    if (selectedPokemon == maxPokemon)
    {
        console.log("No hay más Pokémon siguientes a éste");
        return false;
    }
    else if (selectedPokemon > (maxPokemon - 3))
    {
        console.log("Siguiente Pokémon seleccionado, datos vacios rellenados");
        selectedPokemon--;
        selection.unshift(null);
        selection.pop();
        return true;
    }

    console.log("Siguiente Pokémon seleccionado");
    selection.push(pokemon[(++selectedPokemon) + 3]);
    selection.shift();
    return true;
}

function PreviousPokemon() {
    console.log("Transicionando al Pokémon anterior");

    if (selectedPokemon == 0)
    {
        console.log("No hay más Pokémon anteriores a éste");
        return false;
    }

    else if (selectedPokemon <= 3)
    {
        console.log("Pokémon anterior seleccionado, datos vacios rellenados");
        selectedPokemon--;
        selection.unshift(null);
        selection.pop();
        return true;
    }

    console.log("Pokémon anterior seleccionado");
    selection.unshift(pokemon[(selectedPokemon--) - 3]);
    selection.pop();
    return true;
}

const zeroPad = (num, places) => String(num).padStart(places, '0')

function setSrc(id, dat) {
    document.getElementById(id).src = dat;
}

function setAudioSrc(id, idAdd, dat) {
    document.getElementById(id + idAdd).src = dat;
    document.getElementById(id).load();
}

function setInnerText(id, dat) {
    document.getElementById(id).innerText = dat;
}

async function RecreateViewTable() {
    let list = document.getElementById("pokemon-list");
    list.innerHTML = '';
    
    const resp = await fetch(pokemon[selectedPokemon].url);
    if(!resp.ok) {
        throw new Error(`Ocurrió un error mientras se pedia el Pokemon ${pokemon[selectedPokemon].url}: ${resp.statusText}`);
    }
    const newpoke = await resp.json();

    setInnerText("pokemon-name", newpoke.name.charAt(0).toUpperCase() + newpoke.name.slice(1));
    setInnerText("pokemon-weight", String(newpoke.weight / 10) + "kg");
    setInnerText("pokemon-height", String(newpoke.height / 10) + "m");

    setSrc("pokemon-view-box", newpoke.sprites.front_default);
    setAudioSrc("pokemon-audio-legacy", "-src", newpoke.cries.legacy);
    setAudioSrc("pokemon-audio-latest", "-src", newpoke.cries.latest);

    for (const element of selection) {

        let table = document.createElement("table");
        table.className = "pokedex pokedex-list-element";
        
        let div = document.createElement("tr");
        table.appendChild(div);
        
        let pokeball = document.createElement("tr");
        let pokeSymbol = document.createElement("span");
        pokeSymbol.className = "pokedex pokedex-list-pokeball";
        pokeball.appendChild(pokeSymbol);

        let pokeId = document.createElement("th");
        let pokeName = document.createElement("th");
        
        console.log(`"Adding elements for: "`);
        console.log(element);
        
        if(element)
        {
            let id = element.url.substring(34, element.url.length - 1);
            pokeId.innerText = zeroPad(id, 4);
            pokeName.innerText = element.name.charAt(0).toUpperCase() + element.name.slice(1);
        }
        else
        {
            pokeId.innerText = "----";
            pokeName.innerText = "Sin Datos"
        }

        div.appendChild(pokeball);
        div.appendChild(pokeId);
        div.appendChild(pokeName);
        
        list.appendChild(table);
    }    
}

async function start() {
    const resp = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1302");
    if(!resp.ok) {
        throw new Error(`Ocurrió un error mientras se pedían los Pokemon: ${resp.statusText}`);
    }
    const json = await resp.json();
    pokemon = json.results;
    maxPokemon = pokemon.length - 1;    
    selection = [null, null, null, pokemon[0], pokemon[1], pokemon[2], pokemon[3]];
    
    document.getElementById("nav-next").onclick = async function nextAndUpdate() {
        console.log("Botón de Siguiente presionado");
        if (NextPokemon())
            await RecreateViewTable();
    };

    document.getElementById("nav-prev").onclick = async function prevAndUpdate() {
        console.log("Botón de Anterior presionado");
        if (PreviousPokemon())
            await RecreateViewTable();
    };
}

start().then(RecreateViewTable);