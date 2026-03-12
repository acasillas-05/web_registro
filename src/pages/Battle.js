import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Page.css';
import './Battle.css';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getStat = (pokemon, statName) => {
  const stat = pokemon.stats.find((item) => item.stat.name === statName);
  return stat ? stat.base_stat : 50;
};

const buildFighter = (pokemon) => ({
  name: pokemon.name,
  displayName: pokemon.name.toUpperCase(),
  sprite:
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    '',
  hp: 100,
  attack: getStat(pokemon, 'attack'),
  defense: getStat(pokemon, 'defense'),
  specialAttack: getStat(pokemon, 'special-attack'),
  specialDefense: getStat(pokemon, 'special-defense'),
  speed: getStat(pokemon, 'speed'),
  specialAttackCooldown: 0,
  specialDefenseCooldown: 0,
  shieldActive: false
});

function Battle() {
  const [leftInput, setLeftInput] = useState('pikachu');
  const [rightInput, setRightInput] = useState('charizard');
  const [leftPokemon, setLeftPokemon] = useState(null);
  const [rightPokemon, setRightPokemon] = useState(null);
  const [loadingPokemons, setLoadingPokemons] = useState(false);
  const [selectionError, setSelectionError] = useState('');
  const [battle, setBattle] = useState(null);

  const fetchPokemon = async (name) => {
    try {
      const response = await fetch(`${BASE_URL}/${name.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon no encontrado');
      }
      return await response.json();
    } catch {
      throw new Error(`No se pudo cargar a ${name}`);
    }
  };

  const loadSelectedPokemons = async (e) => {
    e.preventDefault();

    if (!leftInput.trim() || !rightInput.trim()) {
      setSelectionError('Debes ingresar los nombres de ambos Pokémon.');
      return;
    }

    setLoadingPokemons(true);
    setSelectionError('');
    setBattle(null);

    try {
      const [leftData, rightData] = await Promise.all([
        fetchPokemon(leftInput.trim()),
        fetchPokemon(rightInput.trim())
      ]);
      setLeftPokemon(leftData);
      setRightPokemon(rightData);
    } catch (error) {
      setSelectionError(error.message);
      setLeftPokemon(null);
      setRightPokemon(null);
    } finally {
      setLoadingPokemons(false);
    }
  };

  const startBattle = () => {
    if (!leftPokemon || !rightPokemon) {
      return;
    }

    const leftFighter = buildFighter(leftPokemon);
    const rightFighter = buildFighter(rightPokemon);
    const firstTurn = leftFighter.speed >= rightFighter.speed ? 'left' : 'right';

    setBattle({
      fighters: {
        left: leftFighter,
        right: rightFighter
      },
      turn: 1,
      activeKey: firstTurn,
      winnerKey: null,
      logs: []
    });
  };

  const playTurn = () => {
    setBattle((prevBattle) => {
      if (!prevBattle || prevBattle.winnerKey) {
        return prevBattle;
      }

      const actorKey = prevBattle.activeKey;
      const targetKey = actorKey === 'left' ? 'right' : 'left';

      const actor = { ...prevBattle.fighters[actorKey] };
      const target = { ...prevBattle.fighters[targetKey] };

      const availableActions = ['attack'];
      if (actor.specialAttackCooldown === 0) {
        availableActions.push('special-attack');
      }
      if (actor.specialDefenseCooldown === 0) {
        availableActions.push('special-defense');
      }

      const selectedAction = availableActions[randomBetween(0, availableActions.length - 1)];

      let actionLabel = '';
      let damage = 0;
      let actionFailed = false;
      let extraInfo = '';

      if (selectedAction === 'special-defense') {
        actionLabel = 'Defensa especial';
        actor.specialDefenseCooldown = 2;

        if (Math.random() < 0.25) {
          actionFailed = true;
          extraInfo = 'La defensa especial falló.';
        } else {
          actor.shieldActive = true;
          extraInfo = 'Activó un escudo para reducir el próximo daño recibido.';
        }
      } else {
        const missChance = selectedAction === 'special-attack' ? 0.25 : 0.2;
        actionLabel = selectedAction === 'special-attack' ? 'Ataque especial' : 'Ataque';

        if (selectedAction === 'special-attack') {
          actor.specialAttackCooldown = 3;
        }

        if (Math.random() < missChance) {
          actionFailed = true;
          extraInfo = `${actionLabel} falló.`;
        } else {
          const attackPower = selectedAction === 'special-attack' ? actor.specialAttack : actor.attack;
          const defensePower = target.defense;
          const ratioDamage = (attackPower / Math.max(defensePower, 1)) * 11;
          damage = Math.round(ratioDamage + randomBetween(6, 12));

          if (selectedAction === 'special-attack') {
            damage = Math.round(damage * 1.3);
          }

          if (target.shieldActive) {
            damage = Math.round(damage * 0.55);
            target.shieldActive = false;
            extraInfo = 'El oponente redujo el daño con su defensa especial.';
          }

          damage = Math.max(5, Math.min(45, damage));
          target.hp = Math.max(0, target.hp - damage);
        }
      }

      if (actor.specialAttackCooldown > 0 && selectedAction !== 'special-attack') {
        actor.specialAttackCooldown -= 1;
      }
      if (actor.specialDefenseCooldown > 0 && selectedAction !== 'special-defense') {
        actor.specialDefenseCooldown -= 1;
      }

      const winnerKey = target.hp === 0 ? actorKey : null;

      const newLog = {
        turn: prevBattle.turn,
        actor: actor.displayName,
        target: target.displayName,
        action: actionLabel,
        damage,
        remainingHp: target.hp,
        failed: actionFailed,
        extraInfo
      };

      return {
        fighters: {
          ...prevBattle.fighters,
          [actorKey]: actor,
          [targetKey]: target
        },
        turn: prevBattle.turn + 1,
        activeKey: winnerKey ? actorKey : targetKey,
        winnerKey,
        logs: [newLog, ...prevBattle.logs]
      };
    });
  };

  const resetBattle = () => {
    setBattle(null);
  };

  const winner = battle?.winnerKey ? battle.fighters[battle.winnerKey] : null;

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <h1 className="battle-title">Arena Pokemon por Turnos</h1>
        <p className="battle-subtitle">Elige dos Pokemon, inicia el combate y observa el resultado turno a turno.</p>

        <form className="battle-selector" onSubmit={loadSelectedPokemons}>
          <div className="selector-inputs">
            <div className="selector-group">
              <label htmlFor="pokemon-left">Pokemon 1</label>
              <input
                id="pokemon-left"
                type="text"
                value={leftInput}
                onChange={(event) => setLeftInput(event.target.value)}
                placeholder="Ej: pikachu"
                className="search-input"
              />
            </div>
            <div className="selector-group">
              <label htmlFor="pokemon-right">Pokemon 2</label>
              <input
                id="pokemon-right"
                type="text"
                value={rightInput}
                onChange={(event) => setRightInput(event.target.value)}
                placeholder="Ej: charizard"
                className="search-input"
              />
            </div>
          </div>
          <div className="selector-actions">
            <button type="submit" className="search-btn">Cargar Pokemon</button>
            <p className="helper-text">Ataque especial: cada 3 turnos. Defensa especial: cada 2 turnos.</p>
          </div>
        </form>

        {loadingPokemons && <div className="loading">Cargando Pokemon...</div>}
        {selectionError && <div className="error-message">{selectionError}</div>}

        {leftPokemon && rightPokemon && (
          <div className="selection-preview">
            <div className="preview-card">
              <h2>{leftPokemon.name.toUpperCase()}</h2>
              <img
                src={leftPokemon.sprites.other['official-artwork'].front_default}
                alt={leftPokemon.name}
                className="pokemon-image"
              />
            </div>
            <div className="preview-versus">VS</div>
            <div className="preview-card">
              <h2>{rightPokemon.name.toUpperCase()}</h2>
              <img
                src={rightPokemon.sprites.other['official-artwork'].front_default}
                alt={rightPokemon.name}
                className="pokemon-image"
              />
            </div>
          </div>
        )}

        <div className="battle-controls">
          <button
            type="button"
            className="search-btn"
            onClick={startBattle}
            disabled={!leftPokemon || !rightPokemon}
          >
            Iniciar Batalla
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={resetBattle}
            disabled={!battle}
          >
            Reiniciar
          </button>
        </div>

        {battle && (
          <div className="battle-board">
            <div className="battle-status">
              {battle.winnerKey
                ? 'La batalla ha terminado'
                : `Turno ${battle.turn}: ${battle.fighters[battle.activeKey].displayName}`}
            </div>

            <div className="fighters-grid">
              <div className={`fighter-card ${battle.activeKey === 'left' && !battle.winnerKey ? 'active' : ''}`}>
                <h3>{battle.fighters.left.displayName}</h3>
                <img src={battle.fighters.left.sprite} alt={battle.fighters.left.name} className="battle-pokemon" />
                <p className="hp-text">Vida: {battle.fighters.left.hp}%</p>
                <div className="hp-bar">
                  <div className="hp-fill" style={{ width: `${battle.fighters.left.hp}%` }}></div>
                </div>
                <p className="cooldown-text">
                  Ataque especial: {battle.fighters.left.specialAttackCooldown === 0 ? 'listo' : `${battle.fighters.left.specialAttackCooldown} turnos`}
                </p>
                <p className="cooldown-text">
                  Defensa especial: {battle.fighters.left.specialDefenseCooldown === 0 ? 'lista' : `${battle.fighters.left.specialDefenseCooldown} turnos`}
                </p>
              </div>

              <div className={`fighter-card ${battle.activeKey === 'right' && !battle.winnerKey ? 'active' : ''}`}>
                <h3>{battle.fighters.right.displayName}</h3>
                <img src={battle.fighters.right.sprite} alt={battle.fighters.right.name} className="battle-pokemon" />
                <p className="hp-text">Vida: {battle.fighters.right.hp}%</p>
                <div className="hp-bar">
                  <div className="hp-fill" style={{ width: `${battle.fighters.right.hp}%` }}></div>
                </div>
                <p className="cooldown-text">
                  Ataque especial: {battle.fighters.right.specialAttackCooldown === 0 ? 'listo' : `${battle.fighters.right.specialAttackCooldown} turnos`}
                </p>
                <p className="cooldown-text">
                  Defensa especial: {battle.fighters.right.specialDefenseCooldown === 0 ? 'lista' : `${battle.fighters.right.specialDefenseCooldown} turnos`}
                </p>
              </div>
            </div>

            <div className="battle-controls">
              <button
                type="button"
                className="search-btn"
                onClick={playTurn}
                disabled={Boolean(battle.winnerKey)}
              >
                Jugar Siguiente Turno
              </button>
            </div>

            {winner && (
              <div className="winner-box">
                <h2>GANADOR</h2>
                <img src={winner.sprite} alt={winner.name} className="winner-image" />
                <p>{winner.displayName}</p>
              </div>
            )}

            <div className="battle-log">
              <h3>Registro de combate</h3>
              {battle.logs.length === 0 && <p className="empty-log">Inicia la batalla y juega turnos para ver la pelea por pasos.</p>}
              {battle.logs.map((log, index) => (
                <div key={`${log.turn}-${index}`} className="log-item">
                  <p><strong>Turno {log.turn}</strong> - {log.actor}</p>
                  <p>Acción: {log.action}</p>
                  <p>Daño realizado: {log.damage}</p>
                  <p>Vida restante de {log.target}: {log.remainingHp}%</p>
                  {log.failed && <p className="fail-text">La acción falló.</p>}
                  {log.extraInfo && <p>{log.extraInfo}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Battle;
