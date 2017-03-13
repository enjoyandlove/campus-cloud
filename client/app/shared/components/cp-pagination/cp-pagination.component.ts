import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-pagination',
  templateUrl: './cp-pagination.component.html',
  styleUrls: ['./cp-pagination.component.scss']
})
export class CPPaginationComponent implements OnInit {
  @Input() total: number;
  @Input() pageNumber: number;
  @Output() next: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();

  constructor() { }

  onNext(): void {
    this.next.emit();
  }

  onPrevious(): void {
    this.previous.emit();
  }

  ngOnInit() {
    console.log(this);
    this.pageNumber = this.pageNumber ? this.pageNumber : 1;
  }
}
