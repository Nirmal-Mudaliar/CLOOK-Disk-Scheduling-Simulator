var clookChart = document.getElementById("Clook-Chart").getContext('2d');
var chart = new Chart(clookChart, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'C-LOOK Disk Scheduling Sequence',
      data: [],
      backgroundColor: "skyblue",
      borderColor: "blue",
      borderWidth: 2,
      hoverBackgroundColor: 'skyblue',
      hoverBorderColor: 'black',
      fill: false,
      lineTension: 0,
      pointRadius: 5
    }]
  },
  plugins: [{
    id: "canvas_Background_color",
    beforeDraw: (chart) => {
      const cht = chart.canvas.getContext('2d');
      cht.save();
      cht.globalCompositeOperation = 'destination-over';
      cht.fillStyle = 'lightblue';
      cht.fillRect(0, 0, chart.width, chart.height);
      cht.restore();
    }
  }],
  options: {
    title: {
      display: true,
      position: "top",
      text: "C-Look Algorithm Graph",
      fontSize: 20,
      fontColor: "green"
    },
    layout: {
      padding: 10
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "black",
          boxWidth: 42,
        },
        title: {
          color: "yellow"
        }
      },
    },
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        position: 'top',
        max: 100,
        grid: {
          color: 'red',
          borderColor: 'grey',
          tickColor: 'red'
        },
        ticks: {
          color: 'red',
        }
      },
      y: {
        grid: {
          display: false,
          color: 'red',
          borderColor: 'red',
          tickColor: 'red'
        },
        ticks: {
          color: 'red',
        }
      }
    },
  }
});

function execute() {
  if(clook() === false) return;
  seekSequence.reverse();
  seekSequence.push(headPosition);
  seekSequence.reverse();
  let n = seekSequence.length;
  clearPoints(chart);
  chart.options.scales.x.max = diskSize;
  for (let i=0; i<n; i++) {
    chart.data.labels.push(i);
  }
  chart.update();
  for (let i=0; i<n; i++) {
    setTimeout(function() {
      addPoints(chart, seekSequence[i]);
    }, 1000*i);
  }
}

function clearPoints(chart) {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
}

function addPoints(chart, seekSeqce) {
  chart.data.datasets[0].data.push(seekSeqce);
  chart.update();
}
