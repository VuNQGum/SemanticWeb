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
  jsonld: string = '';

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
      ' DESCRIBE :Love_Without_Pity', 'http://localhost:3030/SemanticWeb').subscribe((res) => {
        this.data = res.data;
        console.log(this.data.error.text);
        if (res !== null) this.text = this.data.error.text.split('\n');
        this.HTTP.get<any>('http://localhost:8080/rule/convert?turtle=' + this.onXuli(this.text)).subscribe((res) => {
          this.jsonld = res;
          console.log(JSON.stringify(this.jsonld));

        })
      })
  }

  onFinding() {
    this.http.onDescribe(this.prefix +
      ' DESCRIBE :' + this.model, 'http://localhost:3030/SemanticWeb').subscribe((res) => {
        this.data = res.data;
        console.log(this.data.error.text);
        if (res !== null) {
          this.text = this.data.error.text.split('\n');
          this.HTTP.get<any>('http://localhost:8080/rule/convert?turtle=' + this.onXuli(this.text)).subscribe((res) => {
            this.jsonld = res;
            console.log(JSON.stringify(this.jsonld));

          })
        }
      })

      // const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8').set('response-type', 'text');
      // // const headers = new HttpHeaders().set('response-type', 'text').set('accept', 'text/rdf+n3;application/n3;text/n3');
      // return this.HTTP.get('http://localhost:3030/SemanticWeb/',
      //   { params: new HttpParams().set('query', ' DESCRIBE :Love_Without_Pity'), headers, responseType: 'text'}).subscribe(res => {
      //     console.log(res);

      //   })
  }

  loadScript(jsonld: string) {
    let node = document.createElement('script'); // creates the script tag
    node.innerHTML = jsonld;
    node.src = ''; // sets the source (insert url in between quotes)'
    node.type = 'application/ld+json'; // set the script type
    node.async = true; // makes script run asynchronously
    node.charset = 'utf-8';
    node.id = "jsonld"
    // append to head of document
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  deleteScript() {
    let node = document.getElementById("jsonld");
    node?.remove();
  }

  onXuli(turtle: string[]) {
    let text = turtle;
    text.splice(0, 7);
    let result = text.join(' ');
    console.log(result);

    return result;
  }

  onBackToList() {
    this.back.emit(true);
  }
}
