import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  currentUser: User;
  title = 'Tech Evaluation System';
  isOpen: boolean = false;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  ngOnInit() {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      if (window.innerWidth > 768 && this.isOpen === true) {
        this.isOpen = !this.isOpen;
      }
    });
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private elem: ElementRef
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  logout() {
    this.isOpen = false;
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  toggleCollapse() {
    this.isOpen = !this.isOpen;
  }
}
