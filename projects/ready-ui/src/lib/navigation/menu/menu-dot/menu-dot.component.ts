import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'ready-ui-menu-dot',
  templateUrl: './menu-dot.component.html',
  styleUrls: ['./menu-dot.component.scss']
})
export class MenuDotComponent implements OnInit {
  @Input()
  color: 'primary' | 'danger' = 'primary';

  @HostBinding('class.color--primary')
  get isPrimary() {
    return this.color === 'primary';
  }

  @HostBinding('class.color--danger')
  get isDanger() {
    return this.color === 'danger';
  }

  constructor() {}

  ngOnInit() {}
}
