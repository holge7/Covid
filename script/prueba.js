window.onload = () =>{

    let tipo = 'bar';

    const ctx2 = document.getElementById('myChart').getContext('2d');
    const myChart2 = new Chart(ctx2, {
        data: {
            labels: ['Runnig', 'nose', 'Drinking', 'Green', 'Purple', 'Orange'],
            datasets: [{
                type: tipo,
                label: '# of Votes',
                data: [5, 19, 30, 50, 20, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
                fill:true,
                hoverOffset: 14
        }]
    },
    
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true
    }
});

document.getElementById("btn").addEventListener("click", ()=>{
    console.log(myChart2.data.datasets[0].type)
    myChart2.data.datasets[0].type = "doughnut";
    myChart2.update();
})

}

