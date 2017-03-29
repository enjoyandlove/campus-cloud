import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-team-delete',
  templateUrl: './team-delete.component.html',
  styleUrls: ['./team-delete.component.scss']
})
export class TeamDeleteComponent implements OnInit {
  @Input() admin: any;

  constructor() { }

  onDelete() {
    console.log('deleting');
  }
  ngOnInit() { }
}
