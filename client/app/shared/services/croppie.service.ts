/**
 * A wrapper around Croppie
 * https://foliotek.github.io/Croppie/
 */
import { Injectable } from '@angular/core';

const Croppie = require('croppie');

type Size = 'viewport' | 'original';
type Format = 'jpeg' | 'png' | 'webp';
type Type = 'canvas' | 'base64' | 'html' | 'blob' | 'rawcanvas';

type Degrees = 90 | 180 | 270 | -90 | -180 | -270;

interface IResultOptions {
  type: Type;
  size: Size;
  format: Format;
}

@Injectable()
export class CPCroppieService {
  instance: Croppie;

  constructor(host: HTMLElement, options) {
    this.instance = new Croppie(host, options);
  }

  bind(options: {
    url: string;
    points?: number[];
    orientation?: number;
    zoom?: number;
    useCanvas?: boolean;
  }): Promise<void> {
    return this.instance.bind(options);
  }

  result(options: IResultOptions) {
    const { type, size, format } = options;

    return this.instance.result({
      type,
      size,
      format,
    });
  }

  rotate(degrees: Degrees): void {
    this.instance.rotate(degrees);
  }

  destroy(): void {
    this.instance.destroy();
  }

  setZoom(value): void {
    this.instance.setZoom(value);
  }
}
