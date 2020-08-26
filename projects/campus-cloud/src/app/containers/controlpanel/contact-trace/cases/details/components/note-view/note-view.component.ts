import { Input, OnInit, Component } from '@angular/core';

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
