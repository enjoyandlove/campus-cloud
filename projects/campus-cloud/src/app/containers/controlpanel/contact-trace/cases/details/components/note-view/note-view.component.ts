import { Input, OnInit, Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ICase } from '../../../cases.interface';

@Component({
  selector: 'cp-note-view-modal',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss']
})
export class NoteViewComponent implements OnInit {
  @Input() note: String;

  constructor() {}

  resetModal() {
    $('#viewNote').modal('hide');
  }

  ngOnInit() {}
}
