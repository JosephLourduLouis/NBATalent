let currentChart;

const TOP_PLAYER_IDS = [3, 77, 30, 86, 0, 123, 21, 15, 456, 479];

fetch('http://localhost:3000/api/stats')
  .then(res => res.json())
  .then(data => {
    const tableBody = document.querySelector('#stats-table tbody');

    // this should show only top 10 players
    const tablePlayers = data.filter(p => TOP_PLAYER_IDS.includes(p.player_id));
    tableBody.innerHTML = '';
    tablePlayers.forEach(player => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${player.player_id}</td>
        <td>${player.firstname}</td>
        <td>${player.lastname}</td>
        <td>${player.nationality}</td>
        <td>${player.season}</td>
        <td>${Number(player.ppg).toFixed(1)}</td>
        <td>${Number(player.apg).toFixed(1)}</td>
        <td>${Number(player.rpg).toFixed(1)}</td>
      `;
      tableBody.appendChild(row);
    });

    // to get the averages for international vs usa players
    const usa = data.filter(p => p.nationality === 'USA');
    const intl = data.filter(p => p.nationality !== 'USA');

    const avg = (group, key) => group.length ? group.reduce((a, b) => a + b[key], 0) / group.length : 0;

    const labels = ['USA', 'International'];
    const ppgData = [avg(usa, 'ppg').toFixed(1), avg(intl, 'ppg').toFixed(1)];
    const apgData = [avg(usa, 'apg').toFixed(1), avg(intl, 'apg').toFixed(1)];
    const rpgData = [avg(usa, 'rpg').toFixed(1), avg(intl, 'rpg').toFixed(1)];

    renderChart('ppgChart', 'Points Per Game (PPG)', labels, ppgData, ['#36A2EB', '#FF6384']);
    renderChart('apgChart', 'Assists Per Game (APG)', labels, apgData, ['#36A2EB', '#FF6384']);
    renderChart('rpgChart', 'Rebounds Per Game (RPG)', labels, rpgData, ['#36A2EB', '#FF6384']);

    const countData = [usa.length, intl.length];
    renderChart('countChart', 'Number of Players', labels, countData, ['#36A2EB', '#FF6384'], 'pie');

    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chart-container').forEach(div => {
          div.style.display = 'none';
        });
        document.getElementById(btn.dataset.target).style.display = 'block';
      });
    });

    document.querySelector('.chart-container').style.display = 'block';
  })
  .catch(err => {
    console.error('Failed to fetch stats:', err);
  });

function renderChart(canvasId, label, labels, data, colors, type = 'bar') {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (window[canvasId + 'Instance']) {
    window[canvasId + 'Instance'].destroy();
  }

  window[canvasId + 'Instance'] = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: type === 'pie'
        }
      },
      scales: type === 'bar' ? {
        y: {
          beginAtZero: true
        }
      } : {}
    }
  });
}
