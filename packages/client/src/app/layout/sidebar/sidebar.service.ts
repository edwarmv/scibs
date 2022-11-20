import { Injectable } from '@angular/core';

@Injectable({
  providedIn: null,
})
export class SidebarService {
  collapsed = false;

  constructor() {}

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
