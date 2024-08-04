import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  realdata: any;
  cities: string[] = [];
  temperatures17: number[] = [];
  temperatures18: number[] = [];
  minimumTemp17: number | undefined;
  minimumTempCity17: string | undefined;
  maximumTemp17 : number | undefined;
  maximumTempCity17: string | undefined;
  minimumTemp18 : number | undefined;
  minimumTempCity18: string | undefined;
  maximumTemp18 : number | undefined;
  maximumTempCity18: string | undefined;
  variations: number[] = [];
  ContTempDetailsObj: { [key: string]: number } = {};

  constructor() {}

  ngAfterViewInit() {
    this.fetchData().then(() => {
      // Create bar chart
      const ctxBar = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
      if (ctxBar) {
        new Chart(ctxBar, {
          type: 'bar',
          data: {
            labels: this.cities,
            datasets: [
              {
                label: 'Temperatures 2017',
                data: this.temperatures17,
                borderWidth: 1,
                backgroundColor: '#002D62',
                borderColor: '#002D62',
              },
              {
                label: 'Temperatures 2018',
                data: this.temperatures18,
                borderWidth: 1,
                backgroundColor: 'purple',
                borderColor: 'purple',
              }
            ]
          },
          options: {
            scales: {
              x: {
                ticks: {
                  color: 'black' // Text color for x-axis
                },
                grid: {
                  color: 'black' // Grid color for x-axis
                }
              },
              y: {
                ticks: {
                  color: 'black' // Text color for y-axis
                },
                grid: {
                  color: 'black' // Grid color for y-axis
                },
                beginAtZero: true
              }
            }
          }
        });
      }
  
      // Create pie chart
      const ctxPie = (document.getElementById('variationsChart') as HTMLCanvasElement).getContext('2d');
      if (ctxPie) {
        new Chart(ctxPie, {
          type: 'pie',
          data: {
            labels: this.cities,
            datasets: [{
              label: 'Temperature Variations',
              data: this.variations,
              backgroundColor: this.cities.map(() => this.getRandomColor()), // Generate random colors
              borderColor: this.cities.map(() => '#ffffff'),
              borderWidth: 1,
            }]
          },
          options: {
            plugins: {
              legend: {
                position: 'top'
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return `${tooltipItem.label}: ${tooltipItem.raw}°C`;
                  }
                }
              }
            }
          }
        });
      }
  
      // Create horizontal bar chart
      const ctx = (document.getElementById('myBarChart') as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(this.ContTempDetailsObj),
            datasets: [{
              label: 'Average Temperature',
              data: Object.values(this.ContTempDetailsObj),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)', // Color for the first bar
                'rgba(54, 162, 235, 0.2)', // Color for the second bar
                'rgba(255, 206, 86, 0.2)', // Color for the third bar
               
              ],
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            indexAxis: 'y', // This makes the bar chart horizontal
            scales: {
              x: {
                beginAtZero: true
              }
            }
          }
        });
      }
    });
  }

  async fetchData(): Promise<void> {
    const response = await fetch('http://localhost:4200/tempAPI.json');
    this.realdata = await response.json();
    this.extractCities();
    this.extractTemperatures17();
    this.extractTemperatures18();
    this.calculateTemperatureVariations()
    this.calculateAVGforEachContinent();

  }

  extractCities(): void {
    this.cities = this.realdata.map((item: any) => item.city);
  }



  extractTemperatures17(): void {

    this.temperatures17 = this.realdata.map((item: any) => item.temp17);
    console.log(this.temperatures17);

    this.minimumTemp17 = this.temperatures17[0];
    this.minimumTempCity17 = this.realdata[0].city;
    this.maximumTemp17 = this.temperatures17[0];
    this.maximumTempCity17 = this.realdata[0].city;


    for (let i=1 ; i< this.temperatures17.length; i++ ) {

      if(this.temperatures17[i] < this.minimumTemp17) {

        this.minimumTemp17= this.temperatures17[i]
        
        this.minimumTempCity17 = this.realdata[i].city;
        
      }
    }

    for (let i=1 ; i< this.temperatures17.length; i++ ) {

      if(this.temperatures17[i] > this.maximumTemp17) {

        this.maximumTemp17= this.temperatures17[i]
        
        this.maximumTempCity17 = this.realdata[i].city;

        
      }
    }


  }



  extractTemperatures18(): void {

    this.temperatures18 = this.realdata.map((item: any) => item.temp18);

    this.minimumTemp18 = this.temperatures18[0];
    this.minimumTempCity18 = this.realdata[0].city;
    this.maximumTemp18 = this.temperatures18[0];
    this.maximumTempCity18 = this.realdata[0].city;


    for (let i=1 ; i< this.temperatures18.length; i++ ) {

      if(this.temperatures18[i] < this.minimumTemp18) {

        this.minimumTemp18= this.temperatures18[i]
        
        this.minimumTempCity18 = this.realdata[i].city;
        
      }
    }

    for (let i=1 ; i< this.temperatures18.length; i++ ) {

      if(this.temperatures18[i] > this.maximumTemp18) {

        this.maximumTemp18= this.temperatures18[i]
        
        this.maximumTempCity18 = this.realdata[i].city;

        
      }
    }
 }

 calculateTemperatureVariations(): void {
  // Ensure both arrays have the same length
  if (this.temperatures17.length !== this.temperatures18.length) {
    console.error('Temperature arrays must have the same length.');
    return;
  }

  this.variations = this.temperatures17.map((temp17, index) => {
    const temp18 = this.temperatures18[index];
    const variation = Math.abs(temp18 - temp17); // Calculate the absolute difference
    return variation;
  });

  console.log(this.variations);
}


getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


 calculateAVGforEachContinent(): void {
  
  // Asia
  const asiaData = this.realdata.filter((item: { continent: string; }) => item.continent === "Asia");
  
  const totalTemp17Asia = asiaData.reduce((sum: any, item: { temp17: any; }) => sum + item.temp17, 0);
  const avgTotalTemp17Asia = asiaData.length > 0 ? totalTemp17Asia / asiaData.length : 0; 
  
  const continentValueAsia = asiaData[0].continent;
  
  this.ContTempDetailsObj[continentValueAsia] = avgTotalTemp17Asia;

  //Africa
  const africaData = this.realdata.filter((item: { continent: string; }) => item.continent === "Africa");
  
  const totalTemp17Africa = africaData.reduce((sum: any, item: { temp17: any; }) => sum + item.temp17, 0);
  const avgTotalTemp17Africa = africaData.length > 0 ? totalTemp17Africa / africaData.length : 0; 
  
  const continentValueAfrica = africaData[0].continent;
  
  this.ContTempDetailsObj[continentValueAfrica] = avgTotalTemp17Africa;

 

  //Europe
  const europeData = this.realdata.filter((item: { continent: string; }) => item.continent === "Europe");
  
  const totalTemp17Europe = europeData.reduce((sum: any, item: { temp17: any; }) => sum + item.temp17, 0);
  const avgTotalTemp17Europe = europeData.length > 0 ? totalTemp17Europe / europeData.length : 0; 
  
  const continentValueEurope = europeData[0].continent;
  
  this.ContTempDetailsObj[continentValueEurope] = avgTotalTemp17Europe;

  console.log(this.ContTempDetailsObj)


  

}

}
