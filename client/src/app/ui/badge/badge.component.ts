import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent implements OnInit {
  @Input()
  color:
    | 'blue'
    | 'pink'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'red'
    | 'purple'
    | 'gray' = 'red';

  @Input()
  colorStyle: 'light' | 'solid' = 'solid';

  constructor() {}

  ngOnInit(): void {}
}
