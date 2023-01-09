import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'scibs';
  showSidebar = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
        this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const data = this.activatedRoute.firstChild?.snapshot.data;
        this.showSidebar = data?.['showSidebar'] || false;
      }
    });

  }
}
