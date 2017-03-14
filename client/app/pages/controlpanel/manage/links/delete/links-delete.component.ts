import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-links-delete',
  templateUrl: './links-delete.component.html',
  styleUrls: ['./links-delete.component.scss']
})
export class LinksDeleteComponent implements OnInit {
  @Input() link: any;

  constructor() { }

  onDelete() {
    console.log('deleting...');
  }

  ngOnInit() { }
}
