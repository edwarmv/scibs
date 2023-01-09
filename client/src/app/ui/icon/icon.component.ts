import { Component, Input, OnInit } from '@angular/core';
import { IconFont, Icons } from './icon.enum';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  host: {
    class: 'flex',
  },
})
export class IconComponent implements OnInit {
  icon: string = this.scapeIcon('star');

  @Input()
  set name(name: Icons) {
    this.icon = this.scapeIcon(name);
  }

  constructor() {}

  ngOnInit(): void {}

  scapeIcon(name: Icons): string {
    return '&#x' + IconFont[name] + ';';
  }
}
