import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-callback',
  template: '<div class="container"><router-outlet></router-outlet></div>'
})
export class CallbackComponent implements OnInit {

  constructor( ) { }

  ngOnInit() { }
}
