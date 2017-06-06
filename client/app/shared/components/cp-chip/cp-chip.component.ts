import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface IChip {
  id: number;
  label: string;
}

@Component({
  selector: 'cp-chip',
  templateUrl: './cp-chip.component.html',
  styleUrls: ['./cp-chip.component.scss']
})
export class CPChipComponent implements OnInit {
  @Input() chip: IChip;
  @Input() icon: string;
  @Input() withClose: boolean;
  @Input() withAvatar: boolean;
  @Output() handleClose: EventEmitter<number> = new EventEmitter();

  constructor() { }

  onHandleClose(chip) {
    this.handleClose.emit(chip.id);
  }

  ngOnInit() {
    if (!this.chip) {
      console.warn('Missing Chip input');
    }
    if (this.withAvatar && !this.icon) {
      console.warn('Missing Icon for Avatar');
    }
  }
}
