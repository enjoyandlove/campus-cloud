import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cp-pagination',
  templateUrl: './cp-pagination.component.html',
  styleUrls: ['./cp-pagination.component.scss']
})
export class CPPaginationComponent implements OnInit {
  @Input() pageNext: boolean;
  @Input() pagePrev: boolean;
  @Input() pageNumber: number;
  @Output() next: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();

  constructor() {}

  onNext(): void {
    if (!this.pageNext) {
      return;
    }

    this.next.emit();
  }

  onPrevious(): void {
    if (!this.pagePrev) {
      return;
    }
    this.previous.emit();
  }

  ngOnInit() {
    this.pageNumber = this.pageNumber ? this.pageNumber : 1;
  }
}
