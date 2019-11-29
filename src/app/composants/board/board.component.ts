import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, Observer {

  private rows: number;
  private cols: number;
  private grille: Array<Array<Case>>;
  private difficulty: Difficulty;
  private _gameOver: boolean;

  constructor() { 
    this.rows = 19;
    this.cols = 19;
    this.grille = new Array<Array<Case>>();
    this.difficulty = Difficulty.MEDIUM;
    this.gameOver = false;
    this.initialize();
  }

  ngOnInit() {
  }

  initialize() {
    for(let i = 0; i < this.rows; i++) {
      this.grille[i] = new Array<Case>();

      for(let j = 0; j < this.rows; j++) {
        this.grille[i][j] = new Case();
        this.grille[i][j].addObs(this);
      }
    }
    this.setBoard();
  }

  setBoard() {
    let nbBombs = Math.trunc(this.rows * this.cols * this.difficulty / 100);
    while(nbBombs > 0) {
      let i = Math.floor(Math.random() * this.rows);
      let j = Math.floor(Math.random() * this.cols);
      if(!this.grille[i][j].bomb) {
        this.grille[i][j].bomb = true;
        nbBombs--;
      }
    }

    for(let row of this.grille) {
      for(let cell of row) {
        cell.nbBombAdj = this.calcNbBombAdj(this.grille.indexOf(row), row.indexOf(cell));
      }
    }
  }

  calcNbBombAdj(row: number, col: number): number {
    let count = 0;
    for(let i = -1; i <=1; i++) {
      for(let j = -1; j <=1; j++) {
        if(row + i >= 0 && row + i < this.rows && col + j >= 0 && col + j < this.cols) {
          if(this.grille[row + i][col + j].bomb) {
            count++;
          }
        }
      }
    }
    return count;
  }

  get gameOver(): boolean {
    return this._gameOver;
  }

  set gameOver(go: boolean) {
    this._gameOver = go;
    if(this.gameOver) {
      console.log("La partie est terminée!!!");
    }
  }

  clicked(cell: Case) {
    if(!this.gameOver) {
      cell.clicked = true;
    }
  }

  marked(cell: Case, e: Event) {
    e.preventDefault();
    cell.marked = true;
  }

  gameover(): void {
    this.gameOver = true;
  }

}

class Case implements Subject {

  private _clicked: boolean;
  private _marked: boolean;
  private _bomb: boolean;
  private _nbBombAdj: number;
  listObs: Array<Observer>;

  constructor() {
    this.clicked = false;
    this._marked = false;
    this.bomb = false;
    this.nbBombAdj = 0;
    this.listObs = new Array<Observer>();
  }

  get clicked(): boolean {
    return this._clicked;
  }

  set clicked(c: boolean) {
    this._clicked = c;
    if(this.bomb) {
      this.notify();
    }
  }

  get marked(): boolean {
    return this._marked;
  }

  set marked(c: boolean) {
    this._marked = !this._marked;
  }

  get bomb(): boolean {
    return this._bomb;
  }

  set bomb(b: boolean) {
    this._bomb = b;
  }

  get nbBombAdj(): number {
    return this._nbBombAdj;
  }

  set nbBombAdj(nb: number) {
    this._nbBombAdj = nb;
  }

  addObs(obs: Observer): void {
    this.listObs.push(obs);
  }


  notify(): void {
    for(let obs of this.listObs) {
      obs.gameover();
    }
  }

}

enum Difficulty {EASY = 5, MEDIUM = 10, HARD = 15, XTREM = 20}

interface Subject {
  listObs: Array<Observer>;
  addObs(o: Observer): void;
  notify(): void;
}

interface Observer {
  gameover(): void; // équivalent de update()
}