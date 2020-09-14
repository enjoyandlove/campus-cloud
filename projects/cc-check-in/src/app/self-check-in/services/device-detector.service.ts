import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {

  constructor() { }

  isAndroid() {
    return navigator.userAgent.match(/Android/i);
  }

  isBlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
  }

  isIOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }

  isOpera() {
    return navigator.userAgent.match(/Opera Mini/i);
  }

  isWindows() {
    return navigator.userAgent.match(/IEMobile/i);
  }

  isMobile() {
    return navigator.userAgent.match(/Opera Mini|iPhone|iPad|iPod|BlackBerry|Android|IEMobile/i);
  }
}
