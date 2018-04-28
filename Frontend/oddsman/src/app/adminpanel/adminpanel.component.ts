import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.sass']
})
export class AdminpanelComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {

    return this.http
      .post("http://localhost:3000/tournament/", {
      }).subscribe(res => console.log('Called admin endpoint!'));
  }

}
