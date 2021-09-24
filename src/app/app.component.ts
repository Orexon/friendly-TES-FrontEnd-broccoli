import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock';

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

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  @ViewChild('navBar') navBar: ElementRef;

  ngOnInit() {}

  ngAfterViewInit() {
    if (window.innerWidth > 768 && this.isOpen === true) {
      this.isOpen = !this.isOpen;
      enableBodyScroll(this.navBar.nativeElement);
    } else if (window.innerWidth > 768 && this.isOpen === false) {
      enableBodyScroll(this.navBar.nativeElement);
    }

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      if (window.innerWidth > 768 && this.isOpen === true) {
        this.isOpen = !this.isOpen;
        enableBodyScroll(this.navBar.nativeElement);
      } else if (window.innerWidth > 768 && this.isOpen === false) {
        enableBodyScroll(this.navBar.nativeElement);
      }
    });
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
    clearAllBodyScrollLocks();
  }

  logout() {
    this.isOpen = false;
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  toggleCollapse() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      disableBodyScroll(this.navBar.nativeElement);
    } else {
      enableBodyScroll(this.navBar.nativeElement);
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = !this.isOpen;
    }
  }
}
