import { Component } from '@angular/core';
import { GameServiceService } from '../../services/game-service.service';
import { JsonPipe } from '@angular/common';

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
  columnIndexTarget: number = 0;
  draw: boolean = false;

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
    //azzara winner e draw
    this.winner = false;
    this.draw = false;
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
            placed = this.gameService.placePawn(
              this.currentPlayer,
              this.numRow,
              colIndexRandom,
              this.grid
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
      this.winner = true;
      console.log('*****Hai vinto');
      console.log('winner', this.winner);
      return true;
    } else {
      this.winner = false;
      console.log('Non hai ancora vinto');
      console.log('winner', this.winner);
    }
    return false;
  }

  blockOrWin() {
    const opponentPlayer = this.currentPlayer === 'CPU_1' ? 'CPU_2' : 'CPU_1';

    console.log('Provo a vincere');

    //Cerca un trio orizzontale per vincere
    let target = this.gameService.findTrioHorizontal(
      this.numRow,
      this.numCol,
      this.grid,
      this.currentPlayer
    );

    // Se non è stato trovato un trio orizzontale per vincere, controlla il trio diagonale
    if (!target.found) {
      target = this.gameService.findTrioDiagonal(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );
    }

    // Se non è stato trovato un trio diagonale per vincere, controlla il trio verticale
    if (!target.found) {
      target = this.gameService.findTrioVertical(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );
    }

    //Se il target è stato trovato assegna l'indice trovato a columnIndexTarget
    if (target.found) {
      console.log('Trovata combinazione per vincere');

      this.columnIndexTarget = target.colIndex;
      console.log(
        'Indice colonna da riempire per vincere',
        this.columnIndexTarget
      );

      return true;
    }

    console.log('Non sono riuscito a vincere. Provo a bloccare');

    // //Cerca un trio orizzontale per vincere
    target = this.gameService.findTrioHorizontal(
      this.numRow,
      this.numCol,
      this.grid,
      opponentPlayer
    );

    // Se non è stato trovato un trio orizzontale per bloccare, controlla il trio diagonale
    if (!target.found) {
      target = this.gameService.findTrioDiagonal(
        this.numRow,
        this.numCol,
        this.grid,
        opponentPlayer
      );
    }

    // Se non è stato trovato un trio diagonale per bloccare, controlla il trio verticale
    if (!target.found) {
      target = this.gameService.findTrioVertical(
        this.numRow,
        this.numCol,
        this.grid,
        opponentPlayer
      );
    }

    if (target.found) {
      console.log('Trovata combinazione per bloccare');

      this.columnIndexTarget = target.colIndex;
      console.log(
        'Indice colonna da riempire per vincere',
        this.columnIndexTarget
      );

      return true; // C'è una mossa vincente
    }

    console.log('Non sono riuscito a bloccare.');

    return false; // Nessuna mossa vincente trovata
  }

  

  tryToMakeTrio() {
    console.log('Provo a fare un tris');

    //Cerca un duo orizzontale per fare tris
    let target = this.gameService.findCoupleHorizontal(
      this.numRow,
      this.numCol,
      this.grid,
      this.currentPlayer
    );

    // Se non è stato trovato un duo orizzontale, controlla il duo diagonale
    if (!target.found) {
      target = this.gameService.findCoupleDiagonal(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );
    }

    // Se non è stato trovato un duo diagonale, controlla il duo verticale
    if (!target.found) {
      target = this.gameService.findCoupleVertical(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );
    }

    //Se il target è stato trovato assegna l'indice trovato a columnIndexTarget
    if (target.found) {
      console.log('Trovata combinazione per fare tris');

      this.columnIndexTarget = target.colIndex;
      console.log(
        'Indice colonna da riempire per fare tri',
        this.columnIndexTarget
      );

      return true;
    }

    console.log('Non sono riuscito a fare tris.');
    return false;
  }

  async play() {
    console.log('*********************');
    console.log(`E' il turno di ${this.currentPlayer}`);
    console.log(' Grid a inizio mossa', this.grid);
    // Vinci o blocca se possibile
    // se trova una combinazione vincente o da bloccare inserisci la pedina nella colonna trovata e mettila in basso garantendo la gravità del gioco
    if (this.blockOrWin()) {
      console.log('Block or Win trovato, posiziona per vincere o bloccare');
      this.gameService.placePawn(
        this.currentPlayer,
        this.numRow,
        this.columnIndexTarget,
        this.grid
      );
      //verifica se c'è stata una vincita/blocco o pareggio altrimenti cambia il giocatore
      if (await this.endOrChangePlayer()) return;
    }
    //se non è stata trovata una combinazione vincente o da bloccare, controlla se è possibile fare un tris
    else if (this.tryToMakeTrio()) {
      console.log('Trovata combinazione per fare tris');
      this.gameService.placePawn(
        this.currentPlayer,
        this.numRow,
        this.columnIndexTarget,
        this.grid
      );
      if (await this.endOrChangePlayer()) return;
    }
    //se non è stata trovata una combinazione per fare tris, inserisci la pedina casualmente
    else {
      //pedina casuale
      await this.tryPlaceRandomPawn();
      if (await this.endOrChangePlayer()) return;
    }

    // // se non è stata trovata una combinazione vincente o da bloccare, controlla se è possibile fare un tris

    // //se trova una combinazione per fare un tris sensato, mette la pedina
    // if (this.tryToMakeTrio()) {
    //   this.gameService.placePawn(
    //     this.currentPlayer,
    //     this.numRow,
    //     this.columnIndexTarget,
    //     this.grid
    //   );
    //     if(await this.endOrChangePlayer()) return

    // } else if(){
    //   //pedina casuale
    //   await this.tryPlaceRandomPawn();
    //   //verifica pareggio
    //   if (this.gameService.draw(this.grid)) {
    //     console.log('Pareggio!');
    //     this.draw = true;
    //     return;
    //   }

    //   //cambio giocatore
    //   this.changePlayer(this.currentPlayer);
    //   return;
    // }
  }

  async endOrChangePlayer() {
    // verifica vittoria
    this.verifyVictory();
    if (this.winner) {
      console.log(`${this.currentPlayer} ha vinto!`);
      return true; // partita finita
    }

    // verifica pareggio
    if (this.gameService.draw(this.grid)) {
      console.log('Pareggio!');
      this.draw = true;
      return true; // partita finita
    }

    // cambio giocatore
    this.changePlayer(this.currentPlayer);
    return false; // continua il gioco
  }

  // async play() {
  //   console.log('*********************');
  //   console.log(`E' il turno di ${this.currentPlayer}`);
  //   console.log(' Grid a inizio mossa', this.grid);
  //   // Vinci o blocca se possibile
  //   // se trova una combinazione vincente o da bloccare inserisci la pedina nella colonna trovata e mettila in basso garantendo la gravità del gioco
  //   if (this.blockOrWin()) {
  //     console.log('Block or win trovato, posiziona in maniera sensata');
  //     this.gameService.placePawn(
  //       this.currentPlayer,
  //       this.numRow,
  //       this.columnIndexTarget,
  //       this.grid
  //     );
  //     console.log(' Grid aggiornata', this.grid);
  //   } else {
  //     console.log('Nessun block or win quindi posiziona casualmente');
  //     await this.tryPlaceRandomPawn(); //pedina casuale
  //   }

  //   //verifica vittoria
  //   this.verifyVictory();
  //   if (this.winner) {
  //     console.log(`${this.currentPlayer} ha vinto!`);
  //     return;
  //   }

  //   //verifica pareggio
  //   if (this.gameService.draw(this.grid)) {
  //     console.log('Pareggio!');
  //     this.draw = true;
  //     return;
  //   }
  //   //cambio giocatore
  //   this.changePlayer(this.currentPlayer);

  //   console.log('Grid a fine mossa', this.grid);
  // }
}
