import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <header class="header-bar">
      <div class="header-left">
        <button mat-icon-button class="mobile-menu-btn" (click)="menuToggled.emit()">
          <mat-icon>menu</mat-icon>
        </button>
        <mat-icon class="header-icon">{{ icon }}</mat-icon>
        <h1 class="header-title">{{ title }}</h1>
      </div>
      
      <div class="header-right">
        <ng-content></ng-content>
        
        <button mat-icon-button (click)="themeToggled.emit()" class="theme-toggle">
          <mat-icon>{{ isDark ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
        
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-rut" *ngIf="userRut">{{ userRut }}</span>
        </div>
        
        <button mat-icon-button (click)="logout.emit()" class="logout-btn" title="Cerrar sesión">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      background: var(--bg-header, #fff);
      border-bottom: 1px solid var(--border, #dde3f0);
      box-shadow: var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.08));
      position: sticky;
      top: 0;
      z-index: 50;
      gap: 12px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .header-icon {
      color: var(--brand, #3d6fe8);
      font-size: 26px;
    }

    .header-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary, #1a1f36);
      margin: 0;
      white-space: nowrap;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
    }

    .user-info {
      display: none;
    }

    .user-name {
      color: var(--text-primary, #1a1f36);
      font-weight: 600;
      font-size: 0.85rem;
    }

    .user-rut {
      color: var(--text-muted, #9099b8);
      font-size: 0.75rem;
    }

    .mobile-menu-btn {
      display: none;
      color: var(--text-secondary, #5a6380);
    }

    .theme-toggle,
    .logout-btn {
      color: var(--text-secondary, #5a6380);
    }

    .mobile-menu-btn:hover,
    .theme-toggle:hover,
    .logout-btn:hover {
      color: var(--brand, #3d6fe8);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .mobile-menu-btn {
        display: flex;
      }
    }

    @media (max-width: 768px) {
      .header-bar {
        padding: 10px 14px;
      }

      .header-title {
        font-size: 1rem;
      }

      .header-icon {
        font-size: 22px;
      }

      .user-rut {
        display: none;
      }
    }
  `]
})
export class SharedHeaderComponent {
  @Input() title = '';
  @Input() icon = 'school';
  @Input() userName = '';
  @Input() userRut = '';
  @Input() isDark = false;
  @Output() menuToggled = new EventEmitter<void>();
  @Output() themeToggled = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}