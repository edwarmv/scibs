import { Component, Inject, OnInit } from '@angular/core';
import { SnackBarOpts, SnackBarService, SNACK_BAR_DATA } from './snack-bar.service';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  constructor(
  @Inject(SNACK_BAR_DATA) public data: SnackBarOpts,
  private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.snackBarService.close();
  }
}
