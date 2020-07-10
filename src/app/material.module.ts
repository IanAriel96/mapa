import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule
  ],
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule
  ]
})
export class MaterialModule { }
