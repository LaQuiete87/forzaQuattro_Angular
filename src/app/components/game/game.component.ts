import { Component, HostListener } from '@angular/core';
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
  columnIndexTarget: number = 0;
  draw: boolean = false;
  gameInProgress: boolean = false;

  screenSize: number | null; //BP: 576px, 768px, 992px, 1200px
  matchStatistics = {
    players: [
      {
        name: 'Giallo',
        numTurns: 0,
        numDuplicates: 0,
        numStreaks: 0,
        numBlocks: 0,
      },
      {
        name: 'Rosso',
        numTurns: 0,
        numDuplicates: 0,
        numStreaks: 0,
        numBlocks: 0,
      },
    ],
  };

  constructor(private gameService: GameServiceService) {
    this.screenSize = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenSize = event.target.innerWidth;
    console.log(this.screenSize);
  }

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

  //Genera il tabellone di gioco in base alla dimensione scelta
  generateBoardGame(size: string) {
    //azzera tutti i dati di gioco
    this.resetGame();
    //estrai un numero casuale per saper chi inizia
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

  //Resetta i dati di gioco
  resetGame() {
    this.winner = false;
    this.draw = false;
    this.matchStatistics = {
      players: [
        {
          name: 'Giallo',
          numTurns: 0,
          numDuplicates: 0,
          numStreaks: 0,
          numBlocks: 0,
        },
        {
          name: 'Rosso',
          numTurns: 0,
          numDuplicates: 0,
          numStreaks: 0,
          numBlocks: 0,
        },
      ],
    };
  }

  //Fa partire una nuova partita
  playAgain() {
    this.resetGame();
    this.boardGameSize = '';
    this.gameInProgress = false;
  }
  //Gestisce il colore delle pedine e le dimensioni delle celle
  playerColor(cell: string) {
    if (this.screenSize! < 400) {
      if (cell === 'CPU_1') {
        return {
          'background-image': 'url("/img/Pedina_Gialla.png")',
          width: '38px',
          height: '38px',
        };
      }

      if (cell === 'CPU_2') {
        return {
          'background-image': 'url("/img/Pedina_rossa.png")',
          width: '38px',
          height: '38px',
        };
      }
      if (cell === null) {
        return {
          'background-image': 'url("/img/Cella_vuota.png")',
          width: '38px',
          height: '38px',
        };
      }
    }

    if (this.screenSize! < 576) {
      if (cell === 'CPU_1') {
        return {
          'background-image': 'url("/img/Pedina_Gialla.png")',
          width: '52px',
          height: '52px',
        };
      }

      if (cell === 'CPU_2') {
        return {
          'background-image': 'url("/img/Pedina_rossa.png")',
          width: '52px',
          height: '52px',
        };
      }
      if (cell === null) {
        return {
          'background-image': 'url("/img/Cella_vuota.png")',
          width: '52px',
          height: '52px',
        };
      }
    }

    if (this.screenSize! < 768) {
      if (cell === 'CPU_1') {
        return {
          'background-image': 'url("/img/Pedina_Gialla.png")',
          width: '70px',
          height: '70px',
        };
      }

      if (cell === 'CPU_2') {
        return {
          'background-image': 'url("/img/Pedina_rossa.png")',
          width: '70px',
          height: '70px',
        };
      }
      if (cell === null) {
        return {
          'background-image': 'url("/img/Cella_vuota.png")',
          width: '70px',
          height: '70px',
        };
      }
    }

    if (this.screenSize! < 995) {
      if (cell === 'CPU_1') {
        return {
          'background-image': 'url("/img/Pedina_Gialla.png")',
          width: '90px',
          height: '90px',
        };
      }

      if (cell === 'CPU_2') {
        return {
          'background-image': 'url("/img/Pedina_rossa.png")',
          width: '90px',
          height: '90px',
        };
      }
      if (cell === null) {
        return {
          'background-image': 'url("/img/Cella_vuota.png")',
          width: '90px',
          height: '90px',
        };
      }
    }

    if (cell === 'CPU_1') {
      return {
        'background-image': 'url("/img/Pedina_Gialla.png")',
        width: '130px',
        height: '130px',
      };
    }

    if (cell === 'CPU_2') {
      return {
        'background-image': 'url("/img/Pedina_rossa.png")',
        width: '130px',
        height: '130px',
      };
    }
    if (cell === null) {
      return {
        'background-image': 'url("/img/Cella_vuota.png")',
        width: '130px',
        height: '130px',
      };
    }
    return;
  }

  // Metodo per provare a inserire la pedina in una colonna casuale
  async tryPlaceRandomPawn() {
    let placed = false;
    console.log('Inserisco la pedina casualmente');
    // Finché la pedina non viene piazzata su una colonna libera viene chiamato il metodo tryToPlace()
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
            // Se non riesce incrementa numDuplicates in base al giocatore in turno e richiama il metodo tryToPlace()
            if (!placed) {
              console.log('Colonna piena');
              // Incrementa numDuplicates in base al giocatore in turno
              this.currentPlayer === 'CPU_1'
                ? this.matchStatistics.players[0].numDuplicates++
                : this.matchStatistics.players[1].numDuplicates++;
              resolve(tryToPlace());
            }
            //se riesce risolve la promise
            else {
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

  //Verifica la vittoria
  verifyVictory(): boolean {
    // Verifica se qualcuno dei metodi è true
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
    //Se true il giocatore in turno ha vinto
    if (won) {
      this.winner = true;
      console.log('*****Hai vinto');
      return true;
    } else {
      this.winner = false;
      console.log('Non hai ancora vinto');
    }
    return false;
  }

  //Cerca la mossa per vincere o bloccare la vincita
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
    if (!target.found)
      target = this.gameService.findTrioDiagonal(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );

    // Se non è stato trovato un trio diagonale per vincere, controlla il trio verticale
    if (!target.found)
      target = this.gameService.findTrioVertical(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );

    //Se il target è stato trovato assegna l'indice trovato a columnIndexTarget
    if (target.found) {
      console.log('Trovata combinazione per vincere');
      this.columnIndexTarget = target.colIndex;
      console.log(
        'Indice colonna da riempire per vincere',
        this.columnIndexTarget
      );
      // Incrementa numStreak in base al giocatore in turno
      this.currentPlayer === 'CPU_1'
        ? this.matchStatistics.players[0].numStreaks++
        : this.matchStatistics.players[1].numStreaks++;
      return true;
    }

    console.log('Non sono riuscito a vincere.');
    console.log('Provo a bloccare');

    //Se non è stato possibile vincere, controlla se è possibile bloccare
    //Cerca un trio orizzontale per bloccare
    target = this.gameService.findTrioHorizontal(
      this.numRow,
      this.numCol,
      this.grid,
      opponentPlayer
    );

    // Se non è stato trovato un trio orizzontale per bloccare, controlla il trio diagonale
    if (!target.found)
      target = this.gameService.findTrioDiagonal(
        this.numRow,
        this.numCol,
        this.grid,
        opponentPlayer
      );

    // Se non è stato trovato un trio diagonale per bloccare, controlla il trio verticale
    if (!target.found)
      target = this.gameService.findTrioVertical(
        this.numRow,
        this.numCol,
        this.grid,
        opponentPlayer
      );

    //Se il target è stato trovato assegna l'indice trovato a columnIndexTarget
    if (target.found) {
      console.log('Trovata combinazione per bloccare');
      this.columnIndexTarget = target.colIndex;
      console.log(
        'Indice colonna da riempire per bloccare',
        this.columnIndexTarget
      );
      // Incrementa numBlocks in base al giocatore in turno
      this.currentPlayer === 'CPU_1'
        ? this.matchStatistics.players[0].numBlocks++
        : this.matchStatistics.players[1].numBlocks++;
      return true; // C'è una mossa vincente
    }
    console.log('Non sono riuscito a bloccare.');
    return false; // Nessuna mossa vincente trovata
  }
  // Cerca di fare un tris sensato
  tryToMakeTrio() {
    console.log('Provo a fare un tris sensato');

    //Cerca un duo verticale per fare tris sensato
    let target = this.gameService.findCoupleVertical(
      this.numRow,
      this.numCol,
      this.grid,
      this.currentPlayer
    );

    // Se non è stato trovato un duo verticale, controlla il duo orizzontale
    if (!target.found)
      target = this.gameService.findCoupleHorizontal(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );

    // Se non è stato trovato un duo orizzontale, controlla il duo diagonale
    if (!target.found)
      target = this.gameService.findCoupleDiagonal(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );

    //Se il target è stato trovato assegna l'indice trovato a columnIndexTarget
    if (target.found) {
      console.log('Trovata combinazione per fare tris sensato');
      this.columnIndexTarget = target.colIndex;
      console.log(
        'Indice colonna da riempire per fare tris',
        this.columnIndexTarget
      );
      // Incrementa numStreaks in base al giocatore in turno
      this.currentPlayer === 'CPU_1'
        ? this.matchStatistics.players[0].numStreaks++
        : this.matchStatistics.players[1].numStreaks++;
      return true;
    }

    console.log('Non sono riuscito a fare tris sensato.');
    return false;
  }
  //Cerca di fare un duo sensato
  tryToMakeCouple() {
    console.log('Provo a fare un duo sensato');

    //Cerca un singolo verticale per fare un duo sensato
    let target = this.gameService.findSingleVertical(
      this.numRow,
      this.numCol,
      this.grid,
      this.currentPlayer
    );

    // Se non è stato trovato un singolo verticale, controlla il singolo orizzontale
    if (!target.found)
      target = this.gameService.findSingleHorizontal(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );

    // Se non è stato trovato un singolo orizzontale, controlla il singolo diagonale
    if (!target.found)
      target = this.gameService.findSingleDiagonal(
        this.numRow,
        this.numCol,
        this.grid,
        this.currentPlayer
      );

    //Se il target è stato trovato assegna l'indice trovato a columnIndexTarget
    if (target.found) {
      console.log('Trovata combinazione per fare duo sensato');
      this.columnIndexTarget = target.colIndex;
      console.log(
        'Indice colonna da riempire per fare duo',
        this.columnIndexTarget
      );
      // Incrementa numStreaks in base al giocatore in turno
      this.currentPlayer === 'CPU_1'
        ? this.matchStatistics.players[0].numStreaks++
        : this.matchStatistics.players[1].numStreaks++;
      return true;
    }

    console.log('Non sono riuscito a fare duo sensato.');
    return false;
  }

  // Dà inizio al gioco
  async play() {
    this.gameInProgress = true;
    let myGame = setInterval(async () => {
      console.log('*********************');
      // Incrementa il numero di turni in base al giocatore in turno
      this.currentPlayer === 'CPU_1'
        ? this.matchStatistics.players[0].numTurns++
        : this.matchStatistics.players[1].numTurns++;

      console.log(`E' il turno di ${this.currentPlayer}`);

      // Vinci o blocca se possibile
      // se trova una combinazione vincente o da bloccare per impedire la vincita inserisce la pedina nella colonna trovata e la mette in basso garantendo la gravità del gioco
      if (this.blockOrWin()) {
        console.log('Block or Win trovato, posiziona per vincere o bloccare');
        this.gameService.placePawn(
          this.currentPlayer,
          this.numRow,
          this.columnIndexTarget,
          this.grid
        );
        //Verifica se c'è stata una vincita/blocco o pareggio altrimenti cambia il giocatore e va avanti
        if (await this.endOrChangePlayer()) {
          clearInterval(myGame);
          return;
        }
      }
      //se non è stato possibile vincere o bloccare controlla se è possibile fare un tris sensato
      else if (this.tryToMakeTrio()) {
        console.log('Trovata combinazione per fare tris');
        this.gameService.placePawn(
          this.currentPlayer,
          this.numRow,
          this.columnIndexTarget,
          this.grid
        );
        if (await this.endOrChangePlayer()) {
          clearInterval(myGame);
          return;
        }
      }
      //se non è stata trovata una combinazione per fare un tris sensato controlla se è possibile fare un duo sensato
      else if (this.tryToMakeCouple()) {
        console.log('Trovata combinazione per fare duo');
        this.gameService.placePawn(
          this.currentPlayer,
          this.numRow,
          this.columnIndexTarget,
          this.grid
        );
        if (await this.endOrChangePlayer()) {
          clearInterval(myGame);
          return;
        }
      }
      //se non è stata trovata una combinazione per fare duo sensato inserisce la pedina casualmente
      else {
        await this.tryPlaceRandomPawn();
        if (await this.endOrChangePlayer()) {
          clearInterval(myGame);
          return;
        }
      }
    }, 2000); // Ripete ogni 2 secondi
  }

  //Controlla se la partita è finita o pareggiata (true). In caso contrario cambia giocatore (false)
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
}
