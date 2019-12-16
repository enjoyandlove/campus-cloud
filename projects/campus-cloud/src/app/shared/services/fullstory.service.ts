import { Injectable } from '@angular/core';

import { IUser, ISchool } from '@campus-cloud/session';

const FS: any = (window as any).FS;

@Injectable()
export class FullStoryService {
  constructor() {}

  static isAvailable() {
    return 'FS' in window;
  }

  static restart() {
    if (!this.isAvailable()) {
      return;
    }

    FS.restart();
  }

  static shutdown() {
    if (!this.isAvailable()) {
      return;
    }

    FS.shutdown();
  }

  static indentify(user: IUser, school: ISchool) {
    if (!this.isAvailable()) {
      return;
    }

    const { email, firstname, lastname, id } = user;

    FS.identify(id, {
      email: email,
      school: school.name,
      school_id: school.id,
      reviewsWritten_int: 14,
      displayName: `${firstname} ${lastname}`
    });
  }
}
