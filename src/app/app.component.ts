import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MODEL } from './model/dataModel';
import { CommonApiService } from './service/commonHttp';
import { Util } from './service/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  prefix = 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
    'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' +
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
    'PREFIX : <http://example/> '
  title = 'semanticweb';
  data: any[] = [];
  query!: string;
  hightOff: any = window.innerHeight;

  detail: boolean = false;
  detailTitle: string = '';
  resource: string = '';

  createFilm: boolean = false;

  findings: boolean = false;

  reasoner: boolean = false;


  constructor(
    private http: CommonApiService,
    private util: Util,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.load();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    // this.hightOff = event.target.innerHeight;
    this.hightOff = window.innerHeight;
    console.log(this.hightOff);

  }

  load() {
    this.http.onGetQuery(this.prefix +
      'SELECT ?a (SAMPLE(?B) AS ?b) (SAMPLE(?C) AS ?c) (SAMPLE(?D) AS ?d) (SAMPLE(?E) AS ?e) (SAMPLE(?F) AS ?f) (SAMPLE(?G) AS ?g) WHERE {' +
      '  ?a :hasTitle ?B.' +
      '  ?a :hasGenre ?C .' +
      '  ?a :hasLanguage ?D .' +
      '  ?a :hasImdbRating ?E .' +
      '  ?a :hasReleaseDate ?F.' +
      '  ?a :hasPlot ?G.' +
      '} GROUP BY ?a ', 'http://localhost:3030/SemanticWeb/query').subscribe((res) => {
        this.data = res.data;
      })
  }

  preprocessLink(object: string) {
    return object.slice(15, object.length);
  }

  onOpenInfo(title: string) {
    this.detail = true;
    this.createFilm = false;
    this.findings = false;
    this.reasoner = false;
    this.detailTitle = title;
    this.resource = title.replaceAll(' ', '_');
    console.log(this.resource);

  }

  onUpdateInfo(title: string) {

  }

  onRowDelete(title: string, index: any) {
    let query = this.prefix + ' DELETE {?s ?p ?o} ' +
      ' WHERE {?s a :Movie; ' +
      ' :hasTitle ' + '"' + title + '"; ' +
                  ' ?p ?o. ' +
      '}'
    console.log(query);
    this.data.splice(index, 1);
    console.log(this.data.length);

    this.http.onPostQuery(query, 'http://localhost:3030/SemanticWeb/update').subscribe(res => {
      console.log(res);
    })
    this.load();
  }

  onNew() {
    this.createFilm = true;
    this.detail = false;
    this.findings = false;
    this.reasoner = false;
  }

  onFindings() {
    this.findings = true;
    this.createFilm = false;
    this.detail = false;
    this.reasoner = false;
  }

  onReasoner() {
    this.reasoner = true;
    this.findings = false;
    this.createFilm = false;
    this.detail = false;
  }

  detailBack() {
    this.detail = false;
    this.data = []
    this.load()
  }

  createBack() {
    this.createFilm = false;
    this.data = []
    this.load()
  }

  findingsBack() {
    this.findings = false;
    this.data = [];
    this.load();
  }

  reasonerBack() {
    this.reasoner = false;
    this.data = [];
    this.load();
  }

  clear(table: Table) {
    table.clear();
  }
}
