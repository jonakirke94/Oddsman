import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.sass']
})
export class AdminpanelComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
  }

}
