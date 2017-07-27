import { Injectable } from '@angular/core';

interface ISnack {
  body: string;
  class: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

@Injectable()
export class CPSnackBarService {
  private _snack: ISnack;

  set snack(snack: ISnack) {
    this._snack = snack;
  }

  get snack() {
    return this._snack;
  }

  reset() {
    this.snack = {
      body: null,
      class: null
    };
  }
}
