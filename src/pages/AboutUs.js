import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Page.css';
import './AboutUs.css';

function AboutUs() {
  const [pokemonName, setPokemonName] = useState('ditto');
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchPokemon = async (name) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon no encontrado');
      }
      const data = await response.json();
      setPokemonData(data);
      setPokemonName(name);
    } catch (err) {
      setError(err.message);
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchPokemon(searchInput.trim());
    }
  };

  // Cargar Ditto por defecto al montar el componente
  React.useEffect(() => {
    fetchPokemon('ditto');
  }, []);

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <h1>Pokémon Explorer</h1>
        
        <div className="pokemon-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar Pokémon (ej: pikachu, charizard)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Buscar</button>
          </form>
        </div>

        {loading && <div className="loading">Cargando...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {pokemonData && (
          <div className="pokemon-card">
            <div className="pokemon-header">
              <h2>{pokemonData.name.toUpperCase()}</h2>
              <span className="pokemon-id">#{pokemonData.id}</span>
            </div>
            
            <img 
              src={pokemonData.sprites.other['official-artwork'].front_default} 
              alt={pokemonData.name}
              className="pokemon-image"
            />
            
            <div className="pokemon-info">
              <div className="info-section">
                <h3>Tipo</h3>
                <div className="types">
                  {pokemonData.types.map((type, index) => (
                    <span key={index} className={`type-badge ${type.type.name}`}>
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="info-section">
                <h3>Características</h3>
                <div className="characteristics">
                  <p><strong>Peso:</strong> {pokemonData.weight / 10} kg</p>
                  <p><strong>Altura:</strong> {pokemonData.height / 10} m</p>
                  <p><strong>Experiencia Base:</strong> {pokemonData.base_experience}</p>
                </div>
              </div>

              <div className="info-section">
                <h3>Habilidades</h3>
                <div className="abilities">
                  {pokemonData.abilities.map((ability, index) => (
                    <span key={index} className="ability-badge">
                      {ability.ability.name}
                      {ability.is_hidden && ' (Oculta)'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="info-section">
                <h3>Estadísticas</h3>
                <div className="stats">
                  {pokemonData.stats.map((stat, index) => (
                    <div key={index} className="stat-bar">
                      <div className="stat-info">
                        <span className="stat-name">{stat.stat.name}</span>
                        <span className="stat-value">{stat.base_stat}</span>
                      </div>
                      <div className="stat-progress">
                        <div 
                          className="stat-fill" 
                          style={{width: `${(stat.base_stat / 255) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
