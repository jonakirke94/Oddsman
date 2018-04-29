import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SortEvent } from 'primeng/components/common/sortevent';
import { User, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.sass']
})
export class AdminusersComponent implements OnInit {

  loading: boolean;

  users: User[] = [];

  cols: any[];


  constructor(private http: HttpClient, private _user: UserService) {}

  ngOnInit() {
    this.createCols();
    this.getUsers();
  }

  getUsers() {
      this._user.getUsers().subscribe(res => this.users = res);
  }
    
  createCols() {
    this.cols = [
        {field: 'id', header: '#'},
        {field: 'tag', header: 'Tag'},
        {field: 'name', header: 'Name'},
        {field: 'email', header: 'Email'}
    ];
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
}

}



