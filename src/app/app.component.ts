import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

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

  @ViewChild('navBar') scrollTarget: ElementRef;

  ngOnInit() {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      if (window.innerWidth > 768 && this.isOpen === true) {
        this.isOpen = !this.isOpen;
        enableBodyScroll(this.scrollTarget.nativeElement);
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
    if (this.isOpen) {
      disableBodyScroll(this.scrollTarget.nativeElement);
    } else {
      enableBodyScroll(this.scrollTarget.nativeElement);
    }
  }
}
