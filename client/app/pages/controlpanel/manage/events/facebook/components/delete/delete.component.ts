import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-facebook-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class FacebookEventsDeleteComponent implements OnInit {
  @Input() link: any;

  constructor() { }

  ngOnInit() { }
}
