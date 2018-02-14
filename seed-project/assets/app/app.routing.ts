import { Routes, RouterModule } from '@angular/router';

import { MessagesComponent } from './messages/messages.component';
import { AuthenticationComponent } from './auth/authentication.component';

const APP_ROUTES: Routes = [
    {path: '', redirectTo: '/messages', pathMatch: 'full'},
    {path: 'messages', component: MessagesComponent},
    {path: 'auth', component: AuthenticationComponent, loadChildren: './auth/auth.module#AuthModule'},  // implements lazy loading (aka load when you need it instead of imediately) string that points to file and module to lazily load
];

export const routing = RouterModule.forRoot(APP_ROUTES);