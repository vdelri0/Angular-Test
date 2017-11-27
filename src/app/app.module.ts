import { MaterializeModule } from 'angular2-materialize';
import { ColumnComponent } from './table/column/column.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { LogService } from './table/shared/log.service';
import { ConnectionBackend } from '@angular/http/src/interfaces';
import { HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    ColumnComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterializeModule,
    HttpModule,
    ChartsModule
  ],
  providers: [
    LogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
