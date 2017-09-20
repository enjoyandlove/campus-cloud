/**
 * All session data should be set
 * as part of the g (global) Map
 */
import { Injectable } from '@angular/core';

export * from './user.interface';
export * from './school.interface';

@Injectable()
export class CPSession {
  public g = new Map();

  constructor() { }
};
