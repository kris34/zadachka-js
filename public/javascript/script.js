let toggled = false;

async function search() {
  const searchTerm = document.getElementById('searchInput').value;
  const response = await fetch(`/search?q=${searchTerm}`);
  const results = await response.json();
  const resultsContainer = document.getElementById('all-items');
  resultsContainer.innerHTML = '';

  if (results.length === 0 || searchTerm == '') {
    resultsContainer.innerHTML = '<p>No results found!</p>';
  } else {
    results.forEach((result) => {
      const resultItem = document.createElement('p');
      resultItem.innerHTML = `
      <div class="results">
      <p>Name: ${result.name}</p>
      <p>Duration: ${result.duration}</p>
      <p>URL: ${result.URL}</p>
      <p>Group Title: ${result.groupTitle} </p>
      <p>TVG ID: ${result.tvgId} </p>
      </div>
      `;
      resultsContainer.appendChild(resultItem);
    });
  }
  document.getElementById('searchInput').value = '';
}

async function getAll() {
  try {
    if (toggled == false) {
      const response = await fetch('/items');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const resultsContainer = document.getElementById('all-items');
      resultsContainer.innerHTML = ``;

      if (data.length === 0) {
        resultsContainer.innerHTML = '<p>No results found!</p>';
      } else {
        data.forEach((result) => {
          const resultItem = document.createElement('p');
          resultItem.innerHTML = `
        <div class="results">
        <p>Name: ${result.name}</p>
        <p>Duration: ${result.duration}</p>
        <p>URL: ${result.URL}</p>
        <p>Group Title: ${result.groupTitle} </p>
        <p>TVG ID: ${result.tvgId} </p>
        </div>
        `;
          resultsContainer.appendChild(resultItem);
          toggled = true;
        });
      }
    } else {
      document.getElementById('all-items').innerHTML = '';
      toggled = false;
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
