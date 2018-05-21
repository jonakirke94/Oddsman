import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.sass']
})
export class AdminStatsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  // tslint:disable-next-line:member-ordering
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  // tslint:disable-next-line:member-ordering
  public doughnutChartData: number[] = [350, 450, 100];
  // tslint:disable-next-line:member-ordering
  public doughnutChartType = 'doughnut';


  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }


  // Bar Chart Js

  // tslint:disable-next-line:member-ordering
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  // tslint:disable-next-line:member-ordering
  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  // tslint:disable-next-line:member-ordering
  public barChartType = 'bar';
  // tslint:disable-next-line:member-ordering
  public barChartLegend = true;

  // tslint:disable-next-line:member-ordering
  public barChartData: any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  // events
  public chartClickedBar(e: any): void {
    console.log(e);
  }

  public chartHoveredBar(e: any): void {
    console.log(e);
  }
}
