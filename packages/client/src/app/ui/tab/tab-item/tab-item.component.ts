import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.scss']
})
export class TabItemComponent implements OnInit {
  @Input()
  path = '';

  @Input()
  showCounter = false;

  @Input()
  count = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
