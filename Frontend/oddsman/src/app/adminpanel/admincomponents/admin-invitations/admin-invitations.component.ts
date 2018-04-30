import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { User, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-invitations',
  templateUrl: './admin-invitations.component.html',
  styleUrls: ['./admin-invitations.component.sass']
})
export class AdminInvitationsComponent implements OnInit {

  

  constructor(private route:ActivatedRoute, private _user: UserService) { }

  private name: string;
  private sub: any;

  users: User[] = [];
  msgs: Message[] = [];



  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.name = params['name'];
    });

    this._user.getUsers().subscribe(res => {
      this.users = res
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  
    
  inviteUser(user: User) {
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Godkendte anmodning', detail:'Deltager: ' + user.email});
  }

        declineUser(user: User) {
          this.msgs = [];
          this.msgs.push({severity:'info', summary:'Afviste anmodning', detail:'Deltager: ' + user.email});
}
}