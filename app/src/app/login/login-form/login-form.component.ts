import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AuthError } from '../../api';

export interface ILoginFormData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  @Input() email = '';
  @Input() password = '';
  @Input() loading = false;
  @Input() error: AuthError | null = null;
  @Output() submit = new EventEmitter<ILoginFormData>();

  constructor() { }

  async onSubmit(event: Event) {
    event.stopPropagation();
    this.submit.emit({email: this.email, password: this.password});
  }
}
