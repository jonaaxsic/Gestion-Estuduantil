import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shared-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="shared-card">
      <mat-card-header *ngIf="title || icon">
        <mat-icon mat-card-avatar *ngIf="icon" class="card-icon">{{ icon }}</mat-icon>
        <mat-card-title>{{ title }}</mat-card-title>
        <mat-card-subtitle *ngIf="subtitle">{{ subtitle }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
      
      <mat-card-actions *ngIf="showActions">
        <ng-content select="[card-actions]"></ng-content>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .shared-card {
      background: var(--bg-card, #fff);
      border-radius: 20px;
      border: 1px solid var(--border, #dde3f0);
      box-shadow: var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.08));
      margin-bottom: 16px;
    }

    :host ::ng-deep .mat-mdc-card-header {
      padding: 18px 24px;
      background: var(--bg-subtle, #f4f6fc);
      border-bottom: 1px solid var(--border, #dde3f0);
      border-radius: 20px 20px 0 0;
    }

    .card-icon {
      background: var(--brand-light, #3d6fe815);
      color: var(--brand, #3d6fe8);
      padding: 8px;
      border-radius: 12px;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    :host ::ng-deep .mat-mdc-card-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary, #1a1f36);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    :host ::ng-deep .mat-mdc-card-subtitle {
      color: var(--text-muted, #9099b8);
      font-size: 0.85rem;
    }

    :host ::ng-deep .mat-mdc-card-content {
      padding: 20px;
    }

    :host ::ng-deep .mat-mdc-card-actions {
      padding: 12px 16px;
      border-top: 1px solid var(--border, #dde3f0);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .shared-card {
        border-radius: 16px;
      }

      :host ::ng-deep .mat-mdc-card-header {
        padding: 14px 16px;
        border-radius: 16px 16px 0 0;
      }

      :host ::ng-deep .mat-mdc-card-content {
        padding: 16px;
      }

      :host ::ng-deep .mat-mdc-card-title {
        font-size: 0.95rem;
      }
    }
  `]
})
export class SharedCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() showActions = false;
}