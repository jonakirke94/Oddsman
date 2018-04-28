import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {

    return this.http
      .post("http://localhost:3000/odds/", {
      }).subscribe(res => console.log('Worked'));
  }

}
