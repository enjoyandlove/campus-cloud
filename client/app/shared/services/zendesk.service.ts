import { CPI18nService } from './i18n.service';
import { Injectable } from '@angular/core';

import { isProd } from './../../config/env';

declare var zEmbed: {
  // zEmbed can queue functions to be invoked when the asynchronous script has loaded.
  (callback: () => void): void;

  // ... and, once the asynchronous zEmbed script is loaded, the zEmbed object will
  // expose the widget API.
  activate?(options: any): void;
  hide?(): void;
  identify?(user: any): void;
  setHelpCenterSuggestions?(options: any): void;
  setLocale?(locale: string): void;
  show?(): void;
};

interface IVisibilityQueueItem {
  resolve: any;
  reject: any;
  methodName: string;
}

@Injectable()
export class ZendeskService {
  private isLoaded: boolean;
  private visibilityDelay: number;
  private visibilityQueue: IVisibilityQueueItem[];
  private visibilityTimer: any;

  static zdRoot() {
    const french = 'fr';
    const english = 'en-us';
    const locale = CPI18nService.getLocale();
    const root = 'https://support.readyeducation.com/hc';

    return locale === 'fr-CA' ? `${root}/${french}` : `${root}/${english}`;
  }

  constructor() {
    this.isLoaded = false;
    this.visibilityDelay = 500; // Milliseconds.
    this.visibilityQueue = [];
    this.visibilityTimer = null;

    if (isProd) {
      zEmbed((): void => {
        this.isLoaded = true;
        this.flushVisibilityQueue();
      });
    }
  }

  public activate(options: any): Promise<void> {
    return this.promisify('activate', [options]);
  }

  public hide(): Promise<void> {
    return this.promisifyVisibility('hide');
  }

  public identify(user: any): Promise<void> {
    return this.promisify('identify', [user]);
  }

  public setHelpCenterSuggestions(options: any): Promise<void> {
    if (isProd) {
      return this.promisify('setHelpCenterSuggestions', [options]);
    }
  }

  public setLocale(locale: string): Promise<void> {
    // CAUTION: This method is provided for completeness; however, it really
    // shouldn't be invoked from this Service. Really, it should be called from
    // within the script that loads the bootstrapping script.
    return this.promisify('setLocale', [locale]);
  }

  public show(): Promise<void> {
    return this.promisifyVisibility('show');
  }

  private flushVisibilityQueue(): void {
    // The queue contains the Resolve and Reject methods for the associated Promise
    // objects. We need to iterate over the queue and fulfill the Promises.
    while (this.visibilityQueue.length) {
      const item = this.visibilityQueue.shift();

      // If the queue is still populated after the .shift(), then we are NOT on the
      // last item. As such, we're going to resolve this Promise without actually
      // calling the underlying zEmbed method.
      if (this.visibilityQueue.length) {
        console.warn('Skipping queued method:', item.methodName);
        item.resolve();

        // If the queue is empty after the .shift(), then we are on the LAST ITEM,
        // which is the one we want to actually apply to the page.
      } else {
        this.tryToApply(item.methodName, [], item.resolve, item.reject);
      }
    }
  }

  private promisify(methodName: string, methodArgs: any[]): Promise<void> {
    const promise = new Promise<void>((resolve: Function, reject: Function): void => {
      zEmbed((): void => {
        this.tryToApply(methodName, methodArgs, resolve, reject);
      });
    });

    return promise;
  }

  private promisifyVisibility(methodName: string): Promise<void> {
    const promise = new Promise<void>((resolve: Function, reject: Function): void => {
      this.visibilityQueue.push({
        resolve: resolve,
        reject: reject,
        methodName: methodName
      });

      // If the zEmbed object hasn't loaded yet, there's nothing more to do -
      // the pre-load state will act as automatic debouncing.
      if (!this.isLoaded) {
        return;
      }

      // If we've made it this far, it means the zEmbed object has fully
      // loaded. As such, we need to explicitly debounce the show / hide method
      // calls by delaying the flushing of our internal queue.
      clearTimeout(this.visibilityTimer);

      this.visibilityTimer = setTimeout(
        (): void => {
          this.flushVisibilityQueue();
        },

        this.visibilityDelay
      );
    });

    return promise;
  }

  private tryToApply(
    methodName: string,
    methodArgs: any[],
    resolve: Function,
    reject: Function
  ): void {
    try {
      zEmbed[methodName](...methodArgs);
      resolve();
    } catch (error) {
      reject(error);
    }
  }
}
