import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { Subscription } from "rxjs/Subscription";
import {
  TournamentService,
  Request,
  Tour
} from "../../../services/tournament.service";

@Component({
  selector: "app-admin-requests",
  templateUrl: "./admin-requests.component.html",
  styleUrls: ["./admin-requests.component.sass"]
})
export class AdminRequestsComponent implements OnInit {
  private tourId;

  private params$: Subscription;
  private requests$: Subscription;
  private declined$: Subscription;
  private accepted$: Subscription;

  requests: Request[] = [];
  msgs: Message[] = [];
  loading: boolean;
  tournamentInfo = {};

  tournaments: Tour[];
  selectedTour: Tour;

  tournaments$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private _tourney: TournamentService
  ) {}

  ngOnInit() {
    this.params$ = this.route.params.subscribe(params => {
      this.tourId = params["id"];
      if (this.tourId) {
        this.getRequests(this.tourId);
      }
    });

    this.popoulateDropdown();
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
    if (this.requests$ && this.requests$ !== null) this.requests$.unsubscribe();
    if (this.declined$ && this.declined$ !== null) this.declined$.unsubscribe();
    if (this.accepted$ && this.accepted$ !== null) this.accepted$.unsubscribe();
    if (this.tournaments$ && this.tournaments$ !== null) this.tournaments$.unsubscribe();
  }

  getRequests(id) {
    this.loading = true;
    setTimeout(() => {
      this.requests$ = this._tourney
        .getTournamentRequests(id)
        .subscribe(res => {
          this.tournamentInfo = res;
          this.requests = res.requests;
          this.loading = false;
        });
    }, 500);
  }

  refresh() {
    const id = this.selectedTour.code ? this.selectedTour.code : this.tourId
    this.getRequests(id);
  }


  popoulateDropdown() {
    this.tournaments$ = this._tourney.getAll().subscribe(res => {
      const tourneys = res["data"];
      this.tournaments = tourneys.map(tour => {
        return {
          name: tour.Name,
          code: tour.Id
        };
      });
    });
  }

  acceptRequest(request: Request) {
    const tourId = this.tourId;
    const userId = request.userId;

    this.accepted$ = this._tourney
      .handleRequest("accepted", tourId, userId)
      .subscribe(res => {
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
    const tourId = this.tourId;
    const userId = request.userId;

    this.declined$ = this._tourney
      .handleRequest("declined", tourId, userId)
      .subscribe(res => {
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
