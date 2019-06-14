import { Subject } from 'rxjs';

export class Destroyable {
  destroy$: Subject<null>;

  emitDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
