import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  currentUser: User;
  title = 'Tech Evaluation System';
  status: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  logout() {
    this.status = false;
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  openEvent() {
    this.status = !this.status;
  }
}
