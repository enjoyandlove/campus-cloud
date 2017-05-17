import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

interface IItems {
  'label': string;
  'action': string;
}

@Component({
  selector: 'cp-dropdown',
  templateUrl: './cp-dropdown.component.html',
  styleUrls: ['./cp-dropdown.component.scss']
})
export class CPDropdownComponent implements OnInit {
  @Input() items: IItems[];
  @Input() reset: Observable<boolean>;
  @Input() selectedItem: any;
  @Input() isRequiredError: boolean;
  @Output() selected: EventEmitter<{'label': string, 'event': string}> = new EventEmitter();

  constructor() { }

  onClick(item) {
    this.selected.emit(item);
  }

  resetMenu() {
    this.selectedItem = this.items[0];
  }

  ngOnInit() {
    if (!this.reset) {
      this.reset = Observable.of(false);
    }

    this.reset.subscribe(reset => {
      if (reset) { this.resetMenu(); }
    });
    // console.log(this.items);
  }
}
