import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ready-ui-card-divider',
  templateUrl: './card-divider.component.html',
  styleUrls: ['./card-divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDividerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
