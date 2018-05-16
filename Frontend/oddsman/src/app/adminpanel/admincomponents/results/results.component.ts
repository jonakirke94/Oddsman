import { Component, OnInit } from '@angular/core';
import { MatchService, Result } from '../../../services/match.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.sass']
})
export class ResultsComponent implements OnInit {

  results: Result[];
  displayDialog: boolean;
  result: Result = {};
  selectedResult: Result;
  newResult: boolean;
  cols: any[];

  private loadSubscription$: Subscription;

  constructor(private _match: MatchService) { }

  ngOnInit() {
    this.loadResults();

    this.cols = [
      { field: 'Id', header: 'Id' },
      { field: 'CorrectBet', header: 'Resultat' },
      { field: 'EndResult', header: 'Score' },

    ];
  }

  ngOnDestroy() {
    if (this.loadSubscription$) this.loadSubscription$.unsubscribe();
  }

  loadResults() {
   this._match.getMissingResults().subscribe(res => {
         this.results = res;
     }) 
  }

  showDialogToAdd() {
    this.newResult = true;
    this.result = {};
    this.displayDialog = true;
  }

  save() {
    this.loadSubscription$ = this._match.updateResult(this.selectedResult.Id, this.result).subscribe(res => {
      this.loadResults();
    });
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newResult = false;
    this.result = this.cloneResult(event.data);
    this.displayDialog = true;
  }

  cloneResult(r: Result): Result {
    let result = {};
    for (let prop in r) {
      result[prop] = r[prop];
    }
    return result;
  }


}
