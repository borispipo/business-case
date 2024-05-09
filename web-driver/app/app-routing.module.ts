import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from '$wd/app.component';

const routes: Routes = [
  {
    path: 'web-driver',
    component: AppComponent,
    children: [
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
