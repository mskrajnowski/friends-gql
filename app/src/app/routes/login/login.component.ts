import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Auth, AuthError, InvalidCredentialsError } from '../../api';
import { ILoginFormData } from '../../login';

@Component({
  selector: 'app-route-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  error: AuthError | null = null;
  nextUrl: string = '/';

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.nextUrl = params['next'] || '/';

      if (this.auth.isAuthenticated) {
        this.router.navigateByUrl(this.nextUrl);
      }
    });
  }

  async onSubmit({email, password}: ILoginFormData) {
    try {
      this.loading = true;
      await this.auth.authenticate(email, password);
      this.router.navigateByUrl(this.nextUrl);
    } catch (err) {
      this.error = err;
    }

    this.loading = false;
  }
}
