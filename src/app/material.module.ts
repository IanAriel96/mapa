import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule
  ],
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule
  ]
})
export class MaterialModule { }
