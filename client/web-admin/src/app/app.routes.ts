import { Routes } from '@angular/router';
import { DeliveryComponent } from './delivery/delivery.component';
import { PackageComponent } from './package/package.component';

export const routes: Routes = [
    { path: 'package', component: PackageComponent},
    { path: 'delivery', component: DeliveryComponent },
];
