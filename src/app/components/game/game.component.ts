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
  winner: boolean = false;

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
    //estrai un numero per saper chi inizia
    this.gameService.getRandomNumber(this.boardGameSize).subscribe({
      next: (data) => {
        console.log('***********************************');
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

  async play() {
    const esecurion = async () => {
      // se non esistono mosse sensate metti la pedina in una colonna casuale rispettando la gravità del gioco: chiama il metodo tryToPlaceRandomPawn()
      console.log('*********************');

      await this.tryPlaceRandomPawn();

      // Verifica prima se c'è un vincitore
      this.verifyVictory();
      console.log('Vinto?:', this.winner);
      console.log('Grid', this.grid);
      //se c'è un vincitore interrompi il gioco
      if (this.winner) {
        console.log(`${this.currentPlayer} ha vinto!`);
        return;
      }
      //se non c'è un vincitore controlla il pareggio
      else if (!this.gameService.draw(this.grid)) {
        //Se la partita non è finita cambia giocatore
        this.changePlayer(this.currentPlayer);
        setTimeout(esecurion, 300);
      } else {
        //se la partita è pareggiata interrompi il gioco
        console.log('Pareggio!');
        return;
      }
    };

    setTimeout(esecurion, 300);
  }

  // Metodo per provare a inserire la pedina in una colonna casuale
  async tryPlaceRandomPawn() {
    let placed = false;

    // Finché la pedina non viene piazzata correttamente
    const tryToPlace = () => {
      // Estrai un numero casuale per la colonna
      return new Promise<void>((resolve, reject) => {
        this.gameService.getRandomNumber(this.boardGameSize).subscribe({
          next: (data) => {
            const colIndexRandom = data;

            console.log(
              'Prova ad inserire nella colonna con indice',
              colIndexRandom
            );

            // Prova a piazzare la pedina, se riesce `placePawnRandomly` restituirà `true`
            placed = this.gameService.placePawnRandomly(
              colIndexRandom,
              this.numRow,
              this.grid,
              this.currentPlayer
            );

            if (!placed) {
              // Se non è riuscito, riprova
              console.log('Colonna piena');
              resolve(tryToPlace());
            } else {
              console.log(
                `Pedina inserita nella colonna con indice ${colIndexRandom} `
              );
              resolve();
            }
          },
          error: (err) => console.log(err),
        });
      });
    };

    // Inizia il ciclo
    await tryToPlace();
  }

  verifyVictory(): boolean {
    const won =
      this.gameService.forza4Horizontal(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      ) ||
      this.gameService.forza4Diagonal(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      ) ||
      this.gameService.forza4Vertical(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );

    if (won) {
      console.log('*****Hai vinto');
      this.winner = true;
      return true;
    } else {
      this.winner = false;
      console.log('Non hai ancora vinto');
    }
    return false;
  }
}
