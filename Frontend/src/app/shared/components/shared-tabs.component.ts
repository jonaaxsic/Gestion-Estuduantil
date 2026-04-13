import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-shared-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule],
  template: `
    <mat-tab-group 
      [(selectedIndex)]="selectedIndex"
      (selectedIndexChange)="onTabChange($event)"
      class="shared-tabs"
      [animationDuration]="animationDuration">
      
      @for (tab of tabs; track tab.id) {
        <mat-tab>
          <ng-template mat-tab-label>
            @if (tab.icon) {
              <mat-icon class="tab-icon">{{ tab.icon }}</mat-icon>
            }
            <span class="tab-label">{{ tab.label }}</span>
          </ng-template>
        </mat-tab>
      }
    </mat-tab-group>
  `,
  styles: [`
    .shared-tabs {
      width: 100%;
    }
    
    :host ::ng-deep .mat-mdc-tab-group {
      --mdc-tab-indicator-active-indicator-color: var(--brand, #3d6fe8);
      --mat-tab-header-active-label-text-color: var(--brand, #3d6fe8);
      --mat-tab-header-active-focus-label-text-color: var(--brand, #3d6fe8);
      --mat-tab-header-active-hover-label-text-color: var(--brand, #3d6fe8);
      --mat-tab-header-inactive-label-text-color: var(--text-secondary, #5a6380);
      --mat-tab-header-label-text-font: 'DM Sans', sans-serif;
      --mat-tab-header-label-text-size: 0.875rem;
      --mat-tab-header-label-text-weight: 600;
    }
    
    :host ::ng-deep .mat-mdc-tab {
      --mdc-tab-label-label-text-font: 'DM Sans', sans-serif;
      --mdc-tab-label-label-text-size: 0.875rem;
      --mdc-tab-label-label-text-weight: 600;
      min-width: auto;
      padding: 0 20px;
      height: 48px;
    }
    
    :host ::ng-deep .mat-mdc-tab-labels {
      gap: 4px;
      background: var(--bg-card, #fff);
      padding: 4px;
      border-radius: 16px;
      border: 1px solid var(--border, #dde3f0);
    }
    
    :host ::ng-deep .mat-mdc-tab.mdc-tab {
      border-radius: 12px;
      margin: 0 2px;
    }
    
    :host ::ng-deep .mat-mdc-tab-body-content {
      padding: 0;
      overflow: hidden;
    }
    
    .tab-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
    
    .tab-label {
      white-space: nowrap;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      :host ::ng-deep .mat-mdc-tab {
        min-width: 72px;
        padding: 0 12px;
        height: 40px;
      }
      
      :host ::ng-deep .mat-mdc-tab-labels {
        padding: 4px;
        gap: 2px;
        border-radius: 12px;
      }
      
      .tab-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
      
      :host ::ng-deep .mat-mdc-tab-label-label-text-size: 0.75rem;
    }
  `]
})
export class SharedTabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() selectedIndex = 0;
  @Input() animationDuration = '200ms';
  @Output() tabChanged = new EventEmitter<string>();

  onTabChange(index: number): void {
    const selectedTab = this.tabs[index];
    if (selectedTab) {
      this.tabChanged.emit(selectedTab.id);
    }
  }
}