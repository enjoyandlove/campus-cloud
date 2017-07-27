import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit, Input } from '@angular/core';

interface IProps {
  body: string;
  class: string;
  autoClose: boolean;
  autoCloseDelay: number;
}

@Component({
  selector: 'cp-snackbar',
  templateUrl: './cp-snackbar.component.html',
  styleUrls: ['./cp-snackbar.component.scss']
})
export class CPSnackBarComponent implements OnInit {
  @Input() props: IProps;

  isActive$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() { }

  onClose() {
    this.isActive$.next(false);
    setTimeout(() => { this.isActive$.next(true); }, 1000);
  }

  ngOnInit() {
    this.props = Object.assign(
      {},
      this.props,
      {
        class: !this.props.class ? 'success' : this.props.class,
        autoClose: !this.props.autoClose ? true : this.props.autoClose,
        autoCloseDelay: !this.props.autoCloseDelay ? 2500 : this.props.autoCloseDelay,
      }
    );

    // if (this.props.autoClose) {
    //   setTimeout(() => { this.isActive$.next(false); }, this.props.autoCloseDelay);
    // }
  }
}
