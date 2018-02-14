import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { Headers, Response, Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';   // to use .map()
import { ErrorService } from "../errors/error.service";


@Injectable()
export class AuthService {

    constructor(private http: Http, private errorService: ErrorService){}

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'}); // look at message.service for explanation

        // DEV change below link to https://localhost:3000/ ~~~ whatever for dev work
        return this.http.post('https://node-angular-messenger.herokuapp.com/user', body, {headers: headers})
            .map( (response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }
    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'}); // look at message.service for explanation

        // DEV change below link to https://localhost:3000/ ~~~ whatever for dev work
        return this.http.post(' https://node-angular-messenger.herokuapp.com/signin', body, {headers: headers})
            .map( (response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }
    logout(){
        localStorage.clear();   // removing the jwt (token) invalidates access to any restricted resources, so effectively logs you out
    }

    isLoggedIn(){
        return localStorage.getItem('token') != null;   // returns true if token exists, thus a logged in user
    }
}
