import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-services-delete',
  templateUrl: './services-delete.component.html',
  styleUrls: ['./services-delete.component.scss']
})
export class ServicesDeleteComponent implements OnInit {
  @Input() service: any;

  constructor() { }


  onDelete() {
    console.log(`Deleteing ${this.service}`);
  }

  ngOnInit() { }
}
