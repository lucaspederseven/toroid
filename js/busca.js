

const authenticate = async () => {
  const client_id = 'be0e5024646e487d9e7ff1bcc2e364f1';
  const client_secret = '9bb226d491494285a3c1215db9f8dc2b';

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
};

const searchArtists = async () => {
  const access_token = await authenticate();
  const searchInput = document.getElementById('searchInput').value.trim();
  if (searchInput === '') {
    alert('Erro: Digite um artista para continuar..');
    return;
  }

  const response = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, {
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  });
  const data = await response.json();
  
  if (data.artists.items.length === 0) {
    const noResultsMessage = document.getElementById('noResultsMessage');
    noResultsMessage.classList.remove('d-none');

    const cardWrapper = document.querySelector('.card-wrapper');
    cardWrapper.classList.add('d-none');
    return; 
  }
  
  const artistId = data.artists.items[0].id; 
  const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=BR`, {
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  });
  const topTracksData = await topTracksResponse.json();
  const topTracks = topTracksData.tracks.slice(0, 4); 

  displayTopTracks(topTracks);
  const noResultsMessage = document.getElementById('noResultsMessage');
  noResultsMessage.classList.add('d-none');
  const cardWrapper = document.querySelector('.card-wrapper');
  cardWrapper.classList.remove('d-none');
};

const displayTopTracks = (tracks) => {
  tracks.forEach((track, index) => {
    const card = document.getElementById(`card${index + 1}`);
    if (card) {
      const imageUrl = track.album.images[0].url;
      const trackName = track.name;
      
      const cardImage = card.querySelector('.card-img-top');
      const cardTrackName = card.querySelector('.card-track-name');

      if (cardImage && cardTrackName) {
        cardImage.src = imageUrl;
        cardTrackName.textContent = trackName;
      }
    }
  });
};
