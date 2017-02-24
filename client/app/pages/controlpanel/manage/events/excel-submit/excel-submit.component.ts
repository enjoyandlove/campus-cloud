import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'cp-excel-submit',
    templateUrl: './excel-submit.component.html',
    styleUrls: ['./excel-submit.component.scss']
})
export class ExcelSubmitComponent implements OnInit {
    @Input() events: any[];

    constructor() { }

    ngOnInit() { }
}
