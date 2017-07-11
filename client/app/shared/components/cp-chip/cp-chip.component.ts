import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface IChip {
  id: number;
  label: string;
}

interface IProps {
  icon: string;
  withClose: boolean;
  withAvatar: boolean;
}

@Component({
  selector: 'cp-chip',
  templateUrl: './cp-chip.component.html',
  styleUrls: ['./cp-chip.component.scss']
})
export class CPChipComponent implements OnInit {
  @Input() chip: IChip;
  @Input() props: IProps;
  @Output() handleClose: EventEmitter<number> = new EventEmitter();

  constructor() { }

  onHandleClose(chip) {
    this.handleClose.emit(chip.id);
  }

  ngOnInit() {
    if (!this.chip) {
      console.warn('Missing Chip input');
    }
    if (this.props.withAvatar && !this.props.icon) {
      console.warn('Missing Icon for Avatar');
    }
  }
}
