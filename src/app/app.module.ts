import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import {SplitterModule} from 'primeng/splitter';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {TableModule} from 'primeng/table';
import {MatMenuModule} from '@angular/material/menu';
import {ButtonModule} from 'primeng/button';
import { FilmdetailComponent } from './pages/filmdetail/filmdetail.component';
import { CreatefilmComponent } from './pages/createfilm/createfilm.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
// import { MatInputModule } from '@angular/material/input';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputNumberModule} from 'primeng/inputnumber';
import { DatePipe } from '@angular/common';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FindingsComponent } from './pages/findings/findings.component';
import { RuleengineComponent } from './pages/ruleengine/ruleengine.component';
import {AccordionModule} from 'primeng/accordion';

@NgModule({
  declarations: [
    AppComponent,
    FilmdetailComponent,
    CreatefilmComponent,
    FindingsComponent,
    RuleengineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InputTextareaModule,
    FormsModule,
    SplitterModule,
    ScrollPanelModule,
    TableModule,
    MatMenuModule,
    ButtonModule,
    BrowserAnimationsModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    InputNumberModule,
    ToastModule,
    AccordionModule
  ],
  providers: [DatePipe, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
