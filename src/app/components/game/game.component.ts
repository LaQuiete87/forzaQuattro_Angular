import { Component } from '@angular/core';
import { GameServiceService } from '../../services/game-service.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  currentPlayer: string = '';
  grid: string[][] = [];
  boardGameSize: string = '';
  numRow: number = 0;
  numCol: number = 0;
  numRandom: number = 0;
  randomNumber: number[] = [];

  constructor(private gameService: GameServiceService) {}

  ngOnInit() {}

  //Cambio giocatore
  changePlayer(currentPlayer: string) {
    if (currentPlayer === 'CPU_1') {
      this.currentPlayer = 'CPU_2';
    } else {
      this.currentPlayer = 'CPU_1';
    }
  }

  //Dato un numero casuale se pari inizia CPU_1
  whoStarts(num: number): void {
    if (num % 2 == 0) {
      this.currentPlayer = 'CPU_1';
    } else {
      this.currentPlayer = 'CPU_2';
    }
  }

  //Genera il tabellone di gioco
  generateBoardGame(size: string) {
    this.boardGameSize = size;
    this.grid = []; // Svuota la griglia

    if (size === '5x5') {
      // Creazione della griglia 5x5
      for (let i = 0; i < 5; i++) {
        const row = Array(5).fill(null); // Crea una riga di 5 celle
        this.grid.push(row);
      }
      this.numRow = 5;
      this.numCol = 5;
    } else if (size === '7x6') {
      // Creazione della griglia 7x6
      for (let i = 0; i < 6; i++) {
        const row = Array(7).fill(null); // Crea una riga di 6 celle
        this.grid.push(row);
      }
      this.numRow = 6;
      this.numCol = 7;
    }

    console.log('Righe e colonne', this.numRow, this.numCol);
  }

  playerColor(currentPlayer: string) {
    if (currentPlayer === 'CPU_1') {
      return { 'background-color': 'yellow' };
    }
    if (currentPlayer === 'CPU_2') {
      return { 'background-color': 'red' };
    }
    return;
  }

  play() {
    //estrai un numero per saper chi inizia
    this.gameService.getRandomNumber(this.boardGameSize).subscribe({
      next: (data) => {
        console.log('Num', data);
        console.log('Grid', this.grid);
        this.numRandom = data;
        //se il numero è pari inizia CPU_1 altrimenti CPU_2
        this.whoStarts(this.numRandom);
        console.log('Inizia', this.currentPlayer);
      },
      error: (err) => console.log(err),
      complete: () => console.log('Task completato'),
    });

// se non esistono mosse sensate metti la pedina in una colonna casuale rispettando la gravità del gioco: chiama il metodo tryToPlaceRandomPawn()
this.tryPlaceRandomPawn()

 
  }

  // Metodo per provare a inserire la pedina in una colonna casuale
tryPlaceRandomPawn() {
  let placed = false;

  // Finché la pedina non viene piazzata correttamente
  const tryToPlace = () => {
    // Estrai un numero casuale per la colonna
    this.gameService.getRandomNumber(this.boardGameSize).subscribe({
      next: (data) => {
        const colIndexRandom = data;
        console.log('Prova ad inserire nella colonna con indice', colIndexRandom);

        // Prova a piazzare la pedina, se riesce `placePawnRandomly` restituirà `true`
        placed = this.gameService.placePawnRandomly(colIndexRandom, this.numRow, this.grid, this.currentPlayer);

        if (!placed) {
          // Se non è riuscito, riprova
          console.log('Colonna piena');
          tryToPlace();
        } else {
          console.log(`Pedina inserita nella colonna con indice ${colIndexRandom} `);
        }
      },
      error: (err) => console.log(err)
    });
  };

  // Inizia il ciclo
  tryToPlace();
}
}
