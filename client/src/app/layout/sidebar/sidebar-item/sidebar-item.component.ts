import { Component, Input, OnInit } from '@angular/core';
import { Icons } from '@ui/icon/icon.enum';
import { SidebarService } from '../sidebar.service';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.scss']
})
export class SidebarItemComponent implements OnInit {
  @Input()
  path = '';

  @Input()
  icon: Icons = 'star';

  @Input()
  count = 25;

  constructor(public sidebarService: SidebarService) { }

  ngOnInit(): void {
  }

}
