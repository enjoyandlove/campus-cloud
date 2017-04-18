import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-customizaton-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.scss']
})
export class CustomizationControlButtonsComponent implements OnInit {
  @Output() save: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
