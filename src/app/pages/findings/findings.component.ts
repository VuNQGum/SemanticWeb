import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { FUSEKI } from 'src/app/constant/api';
import { CommonApiService } from 'src/app/service/commonHttp';
import { Util } from 'src/app/service/util';

@Component({
  selector: 'app-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.css']
})
export class FindingsComponent implements OnInit{
  @Output('findings_back') back = new EventEmitter<boolean>();
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
      private HTTP: HttpClient,
      private http: CommonApiService,
      private util: Util,
      public datepipe: DatePipe,
      private messageService: MessageService
    ) { }
  ngOnInit() {
    this.http.onDescribe(this.prefix +
      ' DESCRIBE :Love_Without_Pity', 'http://localhost:3030/SemanticWeb/').subscribe((res) => {
        this.data = res.data;
        console.log(this.data.error.text);
        if (res !== null) this.text = this.data.error.text.split('\n');
      })
  }

  onFinding() {
    this.http.onDescribe(this.prefix +
      ' DESCRIBE :' + this.model, 'http://localhost:3030/SemanticWeb/').subscribe((res) => {
        this.data = res.data;
        console.log(this.data.error.text);
        this.text = this.data.error.text.split('\n');
      })

      // const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8').set('response-type', 'text');
      // // const headers = new HttpHeaders().set('response-type', 'text').set('accept', 'text/rdf+n3;application/n3;text/n3');
      // return this.HTTP.get('http://localhost:3030/SemanticWeb/',
      //   { params: new HttpParams().set('query', ' DESCRIBE :Love_Without_Pity'), headers, responseType: 'text'}).subscribe(res => {
      //     console.log(res);

      //   })
  }

  onBackToList() {
    this.back.emit(true);
  }
}
