import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink, 
    RouterLinkActive, 
    NgbCollapseModule, 
    NgbDropdownModule,  // Added dropdown module
    TranslateModule, 
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  //styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  currentUser: User | null = null;
  
  constructor(
    private translationService: TranslationService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}