import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService) {
    console.log(environment.production)
    console.log(environment.value)
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
