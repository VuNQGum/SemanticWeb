import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, OnChanges, Input } from '@angular/core';
import { CommonApiService } from 'src/app/service/commonHttp';
import { Util } from 'src/app/service/util';

@Component({
  selector: 'app-filmdetail',
  templateUrl: './filmdetail.component.html',
  styleUrls: ['./filmdetail.component.css']
})
export class FilmdetailComponent implements OnInit, OnChanges {
  @Output('detail_back') back = new EventEmitter<boolean>();
  @Input() detailTitle: string = '';
  @Input() resource: string = '';
  data: any;
  genres: any[] = [];
  languages: any[] = [];
  actors: any[] = [];
  director: any[] = [];

  prefix = 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
  'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' +
  'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
  'PREFIX : <http://example/> '

  constructor(
    private HTTP: HttpClient,
    private http: CommonApiService,
    private util: Util
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.http.onDescribe(this.prefix +
      ' DESCRIBE :' + this.resource, 'http://localhost:3030/SemanticWeb').subscribe((res) => {
        let data = res.data;
        if (res !== null) {
          let text = data.error.text.split('\n');
          this.HTTP.get<any>('http://localhost:8080/rule/convert?turtle=' + this.onXuli(text)).subscribe((res) => {
            let jsonld = JSON.stringify(res);
            this.deleteScript();
            this.loadScript(jsonld);
          })
        }
      })

    this.http.onGetQuery('PREFIX xsd: <http://www.w3.org/2001/XMLSchema%23> ' +
      'PREFIX owl: <http://www.w3.org/2002/07/owl%23> ' +
      'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23> ' +
      'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> ' +
      'PREFIX : <http://example/> ' +
      'SELECT ?a ?e ?f ?g WHERE { ' +
      '?a :hasTitle ' + "'" + this.detailTitle + "'" + ' . ' +
      '?a :hasGenre ?c . ' +
      '?a :hasLanguage ?d . ' +
      '?a :hasImdbRating ?e . ' +
      '?a :hasReleaseDate ?f. ' +
      '?a :hasPlot ?g. ' +
      '} LIMIT 20', 'http://localhost:3030/SemanticWeb/query').subscribe((res) => {
        this.data = res.data[0];
      });

    let query = 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema%23> ' +
      'PREFIX owl: <http://www.w3.org/2002/07/owl%23> ' +
      'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23> ' +
      'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> ' +
      'PREFIX : <http://example/> ' +
      'SELECT ?c WHERE { ?a :hasTitle  ' + "'" + this.detailTitle + "'" + '. ?a :hasGenre ?c. ' +
      '}';

    this.http.onGetQuery(query, 'http://localhost:3030/SemanticWeb/query').subscribe((res) => {
      res.data.forEach((element: any) => {
        this.genres.push(this.util.preprocessLink(element.c.value));
      });

    });

    this.http.onGetQuery('PREFIX xsd: <http://www.w3.org/2001/XMLSchema%23> ' +
      'PREFIX owl: <http://www.w3.org/2002/07/owl%23> ' +
      'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23> ' +
      'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> ' +
      'PREFIX : <http://example/> ' +
      'SELECT ?d WHERE { ?a :hasTitle  ' + "'" + this.detailTitle + "'" + '. ?a :hasLanguage ?d. ' +
      '}', 'http://localhost:3030/SemanticWeb/query').subscribe((res) => {
        res.data.forEach((element: any) => {
          this.languages.push(this.util.preprocessLink(element.d.value));
        });
      });

    this.http.onGetQuery('PREFIX xsd: <http://www.w3.org/2001/XMLSchema%23> ' +
      'PREFIX owl: <http://www.w3.org/2002/07/owl%23> ' +
      'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23> ' +
      'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> ' +
      'PREFIX : <http://example/> ' +
      'SELECT ?h WHERE { ?a :hasTitle  ' + "'" + this.detailTitle + "'" + '. ?a :hasActor ?h. ' +
      '}', 'http://localhost:3030/SemanticWeb/query').subscribe((res) => {
        res.data.forEach((element: any) => {
          this.actors.push(this.util.preprocessLink(element.h.value));
        });
      });

    this.http.onGetQuery('PREFIX xsd: <http://www.w3.org/2001/XMLSchema%23> ' +
      'PREFIX owl: <http://www.w3.org/2002/07/owl%23> ' +
      'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns%23> ' +
      'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23> ' +
      'PREFIX : <http://example/> ' +
      'SELECT ?i WHERE { ?a :hasTitle  ' + "'" + this.detailTitle + "'" + '. ?a :hasDirector ?i. ' +
      '}', 'http://localhost:3030/SemanticWeb/query').subscribe((res) => {
        res.data.forEach((element: any) => {
          this.director.push(this.util.preprocessLink(element.i.value));
        });
      });
  }

  loadScript(jsonld: string) {
    let node = document.createElement('script'); // creates the script tag
    node.innerHTML = jsonld;
    node.src = ''; // sets the source (insert url in between quotes)'
    node.type = 'application/ld+json'; // set the script type
    node.async = true; // makes script run asynchronously
    node.charset = 'utf-8';
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
