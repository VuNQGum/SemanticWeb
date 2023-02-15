import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Util {
  preprocessLink(object: string) {
    return object.slice(15, object.length);
  }
}
