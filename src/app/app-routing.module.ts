import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { HomeComponent } from './components/Home/home.component';
import { AdminComponent } from './components/Admin/admin.component';
import { LoginComponent } from './components/Login/login.component';
import { AuthGuard } from './helpers/auth.guard';
import { TestsComponent } from './components/Tests/tests.component';
import { NewTestComponent } from './components/Tests/NewTestComponent/newTest.component';
import { ActiveTestComponent } from './components/Active-test/active-test.component';
import { ResultsComponent } from './components/Results/results.component';
import { TestResultsComponent } from './components/Results/TestResults/test-results.component';
import { NotFoundComponent } from './components/NotFound/not-found.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', canActivate: [AuthGuard], component: AdminComponent },
  { path: 'tests', canActivate: [AuthGuard], component: TestsComponent },
  {
    path: 'tests/newTest',
    canActivate: [AuthGuard],
    component: NewTestComponent,
  },
  {
    path: 'tests/editTest/:id',
    canActivate: [AuthGuard],
    component: NewTestComponent,
  },
  {
    path: 'results',
    canActivate: [AuthGuard],
    component: ResultsComponent,
  },
  {
    path: 'results/test/:id',
    canActivate: [AuthGuard],
    component: TestResultsComponent,
  },
  {
    path: 'activeTest/:id',
    canActivate: [AuthGuard],
    component: ActiveTestComponent,
  },
  { path: '404', component: NotFoundComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
