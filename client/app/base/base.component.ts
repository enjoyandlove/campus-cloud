/**
 * Base Component
 * Wraps all http GET in a promise
 */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'cp-base-component',
  template: '',
})
export class BaseComponent implements OnInit {
  private _isLoading = new Subject<boolean>();
  private _isLoading$ = this._isLoading.asObservable();

  constructor( ) {}

  fetchData(service: Observable<any>) {
    this._isLoading.next(true);
    return service
      .toPromise()
      .then(res => {
        this._isLoading.next(false);
        return res;
      })
      .catch(err => {
        this._isLoading.next(false);
        return err;
      });
  }

  isLoading(): Observable<boolean> {
    return this._isLoading$;
  }

  ngOnInit() { }
}
