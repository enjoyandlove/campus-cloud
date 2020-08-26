import { Input, OnInit, Component, ViewChild } from '@angular/core';
import { ICase } from '../../../cases.interface';

@Component({
  selector: 'cp-note-view-modal',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss']
})
export class NoteViewComponent implements OnInit {
  @Input() case: ICase;

  constructor() {}

  resetModal() {
    $('#viewNote').modal('hide');
  }

  ngOnInit() {}
}
