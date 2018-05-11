import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { Subscription } from "rxjs/Subscription";
import {
  TournamentService,
  Request
} from "../../../services/tournament.service";

@Component({
  selector: "app-admin-invitations",
  templateUrl: "./admin-invitations.component.html",
  styleUrls: ["./admin-invitations.component.sass"]
})
export class AdminInvitationsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private _tourney: TournamentService
  ) {}

  private tourId;
  
  private params$: Subscription;
  private requests$: Subscription;
  private declined$: Subscription;
  private accepted$: Subscription

  requests: Request[] = [];
  msgs: Message[] = [];
  loading: boolean;
  tournamentInfo = {}



  ngOnInit() {
    this.params$ = this.route.params.subscribe(params => {
      this.tourId = params["id"];
      this.getRequests(this.tourId);
    });
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
    this.requests$.unsubscribe();

    if (this.declined$ && this.declined$ !== null) this.declined$.unsubscribe();
    if (this.accepted$ && this.accepted$ !== null) this.accepted$.unsubscribe();
  }

  getRequests(id) {
    this.loading = true;
    setTimeout(() => {
      this.requests$ = this._tourney.getTournamentRequests(id).subscribe(res => {
        this.tournamentInfo = res
        this.requests = res.requests;
        console.log(this.requests)
        this.loading = false;
      });
  }, 500);
}

  refresh() {
    this.getRequests(this.tourId);
  }



  acceptRequest(request: Request) {
    const tourId = this.tourId
    const userId = request.userId;

    this.accepted$ = this._tourney.handleRequest("accepted", tourId, userId).subscribe(res => {
      this.msgs = [];
      this.msgs.push({
        severity: "info",
        summary: "Godkendte anmodning",
        detail: "Deltager: " + request.userName
      });
      this.getRequests(this.tourId);
    });
  }

  declineRequest(request: Request) {
    const tourId = this.tourId
    const userId = request.userId;

    this.declined$ = this._tourney.handleRequest("declined", tourId, userId).subscribe(res => {
      this.msgs = [];
      this.msgs.push({
        severity: "warn",
        summary: "Afviste anmodning",
        detail: "Deltager: " + request.userName
      });
      this.getRequests(this.tourId);
    });
  } 
}
