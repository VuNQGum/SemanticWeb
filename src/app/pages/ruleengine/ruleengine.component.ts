import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { FUSEKI } from 'src/app/constant/api';
import { CommonApiService } from 'src/app/service/commonHttp';
import { Util } from 'src/app/service/util';

@Component({
  selector: 'app-ruleengine',
  templateUrl: './ruleengine.component.html',
  styleUrls: ['./ruleengine.component.css']
})
export class RuleengineComponent {
  @Output('rule_back') back = new EventEmitter<boolean>();
  prefix = 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
    'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' +
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
    'PREFIX : <http://example/> '

  data: any;
  text: string[]=[];
  model: string = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
      private http: HttpClient,
      private util: Util,
      public datepipe: DatePipe,
      private messageService: MessageService
    ) { }
  ngOnInit() {
    this.onReasoner()
  }

  onReasoner() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    this.http.get('http://localhost:8080/rule/ruleengine', { headers, responseType: 'text'}).subscribe((res) => {
      this.data = res;
      console.log(this.data);
      this.text = res.split('.');
    })
  }

  onBackToList() {
    this.back.emit(true);
  }
}
