import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-delete-admin-modal',
  templateUrl: './delete-admin-modal.component.html',
  styleUrls: ['./delete-admin-modal.component.scss']
})
export class ServicesDeleteAdminModalComponent implements OnInit {
  @Input() admin: any;

  constructor() { }

  onDelete() {
    console.log('On Delete');
  }

  ngOnInit() { }
}
