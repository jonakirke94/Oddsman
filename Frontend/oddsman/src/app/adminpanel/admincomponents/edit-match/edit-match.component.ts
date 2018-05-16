import { Component, OnInit } from '@angular/core';
import { MatchService, Match } from '../../../services/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Message } from "primeng/components/common/api";

@Component({
    selector: 'app-edit-match',
    templateUrl: './edit-match.component.html',
    styleUrls: ['./edit-match.component.sass']
})
export class EditMatchComponent implements OnInit {

    matches: Match[];
    displayDialog: boolean;
    match: Match = {};
    selectedMatch: Match;
    newMatch: boolean;
    cols: any[];

    msgs: Message[] = [];

    private loadSubscription$: Subscription;


    constructor(private _match: MatchService) { }

    ngOnInit() {
        this.loadMatches();

        this.cols = [
            { field: 'Id', header: 'Id' },
            { field: 'MatchId', header: 'Kamp nr.' },
            { field: 'MatchName', header: 'Kamp' },
            { field: 'MatchDate', header: 'Start' },
            { field: 'Option1Odds', header: '1' },
            { field: 'Option2Odds', header: 'X' },
            { field: 'Option3Odds', header: '2' },
        ];
    }

    ngOnDestroy() {
        if (this.loadSubscription$) this.loadSubscription$.unsubscribe();
    }

    loadMatches() {
        this._match.getMissingMatches().subscribe(res => {
            this.matches = res;
        })
    }

    showDialogToAdd() {
        this.newMatch = true;
        this.match = {};
        this.displayDialog = true;
    }

    save() {
        this.loadSubscription$ = this._match.updateMatch(this.selectedMatch.Id, this.match).subscribe(res => {
            this.msgs = [];
            this.msgs.push({
              severity: "info",
              summary: "Indsatte kamp",
            });
            this.loadMatches();
        });
        this.displayDialog = false;
    }

    isMatchDate(col) {
        return col.field === "MatchDate";
    }
    
    onRowSelect(event) {
        this.newMatch = false;
        this.match = this.cloneMatch(event.data);
        this.displayDialog = true;
    }

    cloneMatch(m: Match): Match {
        let match = {};
        for (let prop in m) {
            if(prop === 'MatchDate') {
                match[prop] = new Date(m[prop]);
            } else {
            match[prop] = m[prop];
            }
        }
        return match;
    }

}


