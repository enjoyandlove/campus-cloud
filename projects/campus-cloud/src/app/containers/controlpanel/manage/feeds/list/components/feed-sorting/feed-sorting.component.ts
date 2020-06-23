import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

interface SortingOption {
  value: string;
  label: string;
}

const options: SortingOption[] = [
  { value: 'added_time_epoch', label: 't_shared_most_recent' },
  { value: 'score', label: 't_shared_most_relevant' }
];

@Component({
  selector: 'cp-feed-sorting',
  templateUrl: './feed-sorting.component.html',
  styleUrls: ['./feed-sorting.component.scss']
})
export class FeedSortingComponent implements OnInit {
  options = options;
  selected: SortingOption;

  @Input()
  set sortingBy(sortingBy: string) {
    this.selected = this.options.find(({ value }) => sortingBy === value);
  }

  @Output()
  change: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
