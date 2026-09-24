import { Component, signal } from '@angular/core';

const CONSENT_KEY = 'restoran_cookie_consent';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss'
})
export class CookieConsentComponent {
  visible = signal(!localStorage.getItem(CONSENT_KEY));

  accept(): void {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    this.visible.set(false);
  }

  decline(): void {
    localStorage.setItem(CONSENT_KEY, 'declined');
    this.visible.set(false);
  }
}
