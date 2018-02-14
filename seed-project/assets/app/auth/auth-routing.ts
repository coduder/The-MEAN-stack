import { Routes, RouterModule } from "@angular/router";

import { SigninComponent } from "./signin.component";
import { LogoutComponent } from "./logout.component";
import { SignupComponent } from "./signup.component";

const AUTH_ROUTES: Routes = [
    {path: '', redirectTo: 'signup', pathMatch: 'full'},    
    {path: 'signin', component: SigninComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'logout', component: LogoutComponent},
];

export const authRouting = RouterModule.forChild(AUTH_ROUTES);
