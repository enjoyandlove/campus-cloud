import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-personas-tile-content',
  templateUrl: './tile-content.component.html',
  styleUrls: ['./tile-content.component.scss']
})
export class PersonasTileContentComponent implements OnInit {
  @Input() image: string;
  @Input() name: string;
  @Input() color: string;
  @Input() visible: boolean;

  constructor() {}

  ngOnInit(): void {}
}
