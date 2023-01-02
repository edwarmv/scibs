import { Component, Inject } from '@angular/core';
import { TooltipOpts, TOOLTIP_DATA } from './tooltip.directive';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  constructor(
    @Inject(TOOLTIP_DATA) public data: TooltipOpts
  ) {}
}
