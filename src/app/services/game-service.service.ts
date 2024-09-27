import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameServiceService {
  numRandomAPI: string =
    'https://www.random.org/integers/?num=1&min=0&col=1&base=10&format=plain&rnd=new&max=';

  constructor(private http: HttpClient) {}

  // getRandomNumber(boardGameSize: string): number {
  //   if (boardGameSize == '5x5') {
  //     return Math.floor(Math.random() * 5); // Restituisce un numero intero da 0 a 4
  //   } else {
  //     return Math.floor(Math.random() * 7); // Restituisce un numero intero da 0 a 6
  //   }
  // }
  getRandomNumber(boardGameSize: string): Observable<number> {
    if (boardGameSize == '5x5') {
      return this.http.get<number>(`${this.numRandomAPI}${4}`);
    } else {
      return this.http.get<number>(`${this.numRandomAPI}${6}`);
    }
  }

  //Se la plancia è piena la partita è pareggiata
  draw(grid: string[][]): boolean {
    // Verifica se la griglia è completa: se viene trovato almeno uno 0 la partita sicuramente non è terminata
    for (let riga of grid) {
      for (let cella of riga) {
        if (cella === null) {
          return false;
        }
      }
    }
    console.log('Partita pareggiata');
    return true;
  }

  //Data una cella inserisci la pedina(nome giocatore) nella cella
  placePawn(
    player: string,
    rowIndex: number,
    colIndex: number,
    grid: string[][]
  ) {
    grid[rowIndex][colIndex] = player;
  }

  //Data una cella verifica se quella sotto è piena, se sì ritorna true
  // cellMinusOne(rowIndex: number, colIndex: number, grid: string[][]): boolean {
  //   return grid[rowIndex][colIndex - 1] !== null;
  // }

  //VERIFICA VINCITA:  IN ORIZZONTALE \ VERTICALE\ OBLIQUO DESTO E SINISTRO
  forza4Horizontal(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ): boolean {
    for (let indiceRiga = numRow - 1; indiceRiga >=0; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        console.log(`Controllo orizzontale: (${indiceRiga}, ${indiceColonna})`);
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 3] === currentPlayer
        ) {
          console.log(`${currentPlayer} ha fatto streak orizzontale`);
          // this.winner = true;
          // this.typeOfStreak = 'diagonale destro';
          return true;
        }
      }
    }
    return false;
  }

  forza4Vertical(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ): boolean {
    //streak verticale
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 1;
        indiceColonna++
      ) {
        console.log(`Controllo verticale: (${indiceRiga}, ${indiceColonna})`);
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna] === currentPlayer
        ) {
          console.log(`${currentPlayer} ha fatto streak verticale`);
          // this.winner = true;
          // this.typeOfStreak = 'verticale';
          return true;
        }
      }
    }
    return false;
  }

  forza4Diagonal(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ): boolean {
    //streak diagonale destro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        console.log(`Controllo diagonale destro: (${indiceRiga}, ${indiceColonna})`);
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna + 3] === currentPlayer
        ) {
          console.log(`${currentPlayer} ha fatto streak diagonale destro`);
          // this.winner = true;
          // this.typeOfStreak = 'diagonale destro';
          return true;
        }
      }
    }
    //streak diagonale sinistro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {

      for (
        let indiceColonna = numCol - 1;
        indiceColonna >= 3;
        indiceColonna--
      ) {
         console.log(`Controllo diagonale sinistro: (${indiceRiga}, ${indiceColonna})`);
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna - 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna - 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna - 3] === currentPlayer
        ) {
          console.log(`${currentPlayer} ha fatto diagonale sinistro`);
          // this.winner = true;
          // this.typeOfStreak = 'diagonale sinistro';
          return true;
        }
      }
    }

    return false;
  }

  //BLOCCA O VINCI: ORIZZONTALE \ VERTICALE\ OBLIQUO DESTRO E SINISTRO

  //Cerca un trio sensato e restituisce le coordinate della cella da occupare (obbligatoriamente perché porta ad una vincita/blocco certi)
  findTrioeHorizontal(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ) {
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        //Controllo combinazione XXXnull
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 3] === null &&
          grid[indiceRiga + 1][indiceColonna + 3] != null
        ) {
          console.log('Trio orizzontale sensato');
          return grid[indiceRiga][indiceColonna + 3];
        }
        //Controllo combinazione XXnullX
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 2] === null &&
          grid[indiceRiga][indiceColonna + 3] === currentPlayer &&
          grid[indiceRiga + 1][indiceColonna + 2] != null
        ) {
          console.log('Trio orizzontale sensato');
          return grid[indiceRiga][indiceColonna + 2];
        }
        //Controllo combinazione XnullXX
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 1] === null &&
          grid[indiceRiga][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 3] === currentPlayer &&
          grid[indiceRiga + 1][indiceColonna + 1] != null
        ) {
          console.log('Trio orizzontale sensato');
          return grid[indiceRiga][indiceColonna + 1];
        }

        //Controllo combinazione nullXXX
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 3] === currentPlayer &&
          grid[indiceRiga + 1][indiceColonna] != null
        ) {
          console.log('Trio orizzontale sensato');
          return grid[indiceRiga][indiceColonna];
        }
      }
    }
    return false;
  }
  findTrioeDiagonal(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ) {
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      //trio diagonale destro
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        //Controllo combinazione XXXnull
        if (
          grid[indiceRiga][numCol] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna + 3] === null &&
          grid[indiceRiga - 2][indiceColonna + 3] != null
        ) {
          console.log('Trio diagonale sensato ');

          return grid[indiceRiga - 3][indiceColonna + 3];
        }

        //Controllo combinazione XXnullX
        if (
          grid[indiceRiga][numCol] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna + 2] === null &&
          grid[indiceRiga - 3][indiceColonna + 3] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna + 2] != null
        ) {
          console.log('Trio diagonale sensato ');

          return grid[indiceRiga - 2][indiceColonna + 2];
        }

        //Controllo combinazione XnullXX
        if (
          grid[indiceRiga][numCol] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna + 1] === null &&
          grid[indiceRiga - 2][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna + 3] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 1] != null
        ) {
          console.log('Trio diagonale sensato ');

          return grid[indiceRiga - 1][indiceColonna + 1];
        }

        //Controllo combinazione nullXXX
        if (
          grid[indiceRiga][numCol] === null &&
          grid[indiceRiga - 1][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna + 3] === currentPlayer &&
          grid[indiceRiga + 1]?.[indiceColonna] != null
        ) {
          console.log('Trio diagonale sensato ');

          return grid[indiceRiga][numCol];
        }
      }
    }
    //trio diagonale sinistro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = numCol - 1;
        indiceColonna >= 3;
        indiceColonna--
      ) {
        //Controllo combinazione XXXnull
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna - 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna - 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna - 3] === null &&
          grid[indiceRiga - 2][indiceColonna - 3] != null
        ) {
          console.log('Trio diagonale sensato ');
          return grid[indiceRiga - 3][indiceColonna - 3];
        }

        //Controllo combinazione XXnullX
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna - 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna - 2] === null &&
          grid[indiceRiga - 3][indiceColonna - 3] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna - 2] != null
        ) {
          console.log('Trio diagonale sensato ');
          return grid[indiceRiga - 2][indiceColonna - 2];
        }

        //Controllo combinazione XnullXX
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna - 1] === null &&
          grid[indiceRiga - 2][indiceColonna - 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna - 3] === currentPlayer &&
          grid[indiceRiga][indiceColonna - 1] != null
        ) {
          console.log('Trio diagonale sensato ');
          return grid[indiceRiga - 1][indiceColonna - 1];
        }

        //Controllo combinazione nullXXX
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga - 1][indiceColonna - 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna - 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna - 3] === currentPlayer &&
          grid[indiceRiga + 1]?.[indiceColonna] != null
        ) {
          console.log('Trio diagonale sensato ');
          return grid[indiceRiga][indiceColonna];
        }
      }
    }

    return false;
  }

  findTrioeVertical(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ) {
    //streak verticale
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 1;
        indiceColonna++
      ) {
        //Controllo combinazione XXXnull
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna] === null
        ) {
          console.log('Trio verticale sensato ');
          return grid[indiceRiga - 3][indiceColonna];
        }
      }
    }
    return false;
  }

  //FAI TRIO: ORIZZONTALE \ VERTICALE\ OBLIQUO DESTRO E SINISTRO
  //Cerca una coppia che permetta di fare un trio sensato e restituisce le coordinate della cella da occupare
  findCoupleHorizontal(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ) {
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        //Controllo combinazione XXnullnull
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 2] === null &&
          grid[indiceRiga][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna + 2] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 2];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 3] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 3];
          }
        }
        //Controllo combinazione XnullnullX
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 1] === null &&
          grid[indiceRiga][indiceColonna + 2] === null &&
          grid[indiceRiga][indiceColonna + 3] === currentPlayer
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna + 1] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 1];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 2] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 2];
          }
        }

        //Controllo combinazione nullnullXX
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga][indiceColonna + 1] === null &&
          grid[indiceRiga][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 3] === currentPlayer
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 1] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 1];
          }
        }

        //Controllo combinazione nullXXnull
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 3] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 3];
          }
        }
      }
    }
    return false;
  }

  findCoupleDiagonal(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ) {
    // diagonale destro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        //Controllo combinazione XXnullnull
        if (
          grid[indiceRiga][numCol] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna + 2] === null &&
          grid[indiceRiga - 3][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga - 1][indiceColonna + 2] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 2][indiceColonna + 2];
          }
          if (grid[indiceRiga - 2][indiceColonna + 3] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 3][indiceColonna + 3];
          }
        }

        //Controllo combinazione XnullnullX
        if (
          grid[indiceRiga][numCol] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna + 1] === null &&
          grid[indiceRiga - 2][indiceColonna + 2] === null &&
          grid[indiceRiga - 3][indiceColonna + 3] === currentPlayer
        ) {
          if (grid[indiceRiga][indiceColonna + 1] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 1][indiceColonna + 1];
          }
          if (grid[indiceRiga - 1][indiceColonna + 2] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 2][indiceColonna + 2];
          }
        }

        //Controllo combinazione nullnullXX
        if (
          grid[indiceRiga][numCol] === null &&
          grid[indiceRiga - 1][indiceColonna + 1] === null &&
          grid[indiceRiga - 2][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna + 3] === currentPlayer
        ) {
          if (grid[indiceRiga + 1]?.[numCol] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga][numCol];
          }
          if (grid[indiceRiga][indiceColonna + 1] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 1][indiceColonna + 1];
          }
        }
        //Controllo combinazione nullXXnull
        if (
          grid[indiceRiga][numCol] === null &&
          grid[indiceRiga - 1][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[numCol] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga][numCol];
          }
          if (grid[indiceRiga - 2][indiceColonna + 3] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 3][indiceColonna + 3];
          }
        }
      }
    }
    // diagonale sinistro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = numCol - 1;
        indiceColonna >= 3;
        indiceColonna--
      ) {
        //Controllo combinazione XXnullnull
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna - 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna - 2] === null &&
          grid[indiceRiga - 3][indiceColonna - 3] === null
        ) {
          if (grid[indiceRiga - 1][indiceColonna - 2] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 2][indiceColonna - 2];
          }
          if (grid[indiceRiga - 2][indiceColonna - 3] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 3][indiceColonna - 3];
          }
        }

        //Controllo combinazione XnullnullX
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna - 1] === null &&
          grid[indiceRiga - 2][indiceColonna - 2] === null &&
          grid[indiceRiga - 3][indiceColonna - 3] === currentPlayer
        ) {
          if (grid[indiceRiga][indiceColonna - 1] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 1][indiceColonna - 1];
          }
          if (grid[indiceRiga - 1][indiceColonna - 2] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 2][indiceColonna - 2];
          }
        }

        //Controllo combinazione nullnullXX
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga - 1][indiceColonna - 1] === null &&
          grid[indiceRiga - 2][indiceColonna - 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna - 3] === currentPlayer
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga][indiceColonna];
          }
          if (grid[indiceRiga][indiceColonna - 1] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 1][indiceColonna - 1];
          }
        }

        //Controllo combinazione nullXXnull
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga - 1][indiceColonna - 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna - 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna - 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga][indiceColonna];
          }
          if (grid[indiceRiga - 2][indiceColonna - 3] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 3][indiceColonna - 3];
          }
        }
      }
    }

    return false;
  }

  findcoupleVertical(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ) {
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 1;
        indiceColonna++
      ) {
        //Controllo combinazione XXnullnull
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna] === null &&
          grid[indiceRiga - 3][indiceColonna] === null
        ) {
          console.log('Trio verticale sensato ');
          return grid[indiceRiga - 2][indiceColonna];
        }
      }
    }
    return false;
  }

  //FAI DUO: ORIZZONTALE \ VERTICALE\ OBLIQUO DESTRO E SINISTRO
  //Cerca una cella singola che permetta di fare un duo sensato e restituisce le coordinate della cella da occupare

  findSingleHorizontal(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ) {
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        //Controllo combinazione Xnullnullnull
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 1] === null &&
          grid[indiceRiga][indiceColonna + 2] === null &&
          grid[indiceRiga][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna + 1] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 1];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 2] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 2];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 3] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 3];
          }
        }
        //Controllo combinazione nullXnullnull
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 2] === null &&
          grid[indiceRiga][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 2] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 2];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 3] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 3];
          }
        }

        //Controllo combinazione nullnullXnull
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga][indiceColonna + 1] === null &&
          grid[indiceRiga][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 1] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 1];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 3] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 3];
          }
        }

        //Controllo combinazione nullnullnullX
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga][indiceColonna + 1] === null &&
          grid[indiceRiga][indiceColonna + 2] === null &&
          grid[indiceRiga][indiceColonna + 3] === currentPlayer
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 1] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 1];
          }
          if (grid[indiceRiga + 1]?.[indiceColonna + 2] !== null) {
            console.log('Coppia orizzontale sensata');
            return grid[indiceRiga][indiceColonna + 2];
          }
        }
      }
    }
    return false;
  }

  findSingleDiagonal(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ) {
    // diagonale destro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        //Controllo combinazione Xnullnullnull
        if (
          grid[indiceRiga][numCol] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna + 1] === null &&
          grid[indiceRiga - 2][indiceColonna + 2] === null &&
          grid[indiceRiga - 3][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga][indiceColonna + 1] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 1][indiceColonna + 1];
          }
          if (grid[indiceRiga - 1][indiceColonna + 2] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 2][indiceColonna + 2];
          }
          if (grid[indiceRiga - 2][indiceColonna + 3] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 3][indiceColonna + 3];
          }
        }

        //Controllo combinazione nullXnullnull
        if (
          grid[indiceRiga][numCol] === null &&
          grid[indiceRiga - 1][indiceColonna + 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna + 2] === null &&
          grid[indiceRiga - 3][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[numCol] != null) {
            console.log('singolo diagonale sensato');
            return grid[indiceRiga][numCol];
          }

          if (grid[indiceRiga - 1][indiceColonna + 2] != null) {
            console.log('singolo diagonale sensato');
            return grid[indiceRiga - 2][indiceColonna + 2];
          }
          if (grid[indiceRiga - 2][indiceColonna + 3] != null) {
            console.log('singolo diagonale sensato');
            return grid[indiceRiga - 3][indiceColonna + 3];
          }
        }

        //Controllo combinazione nullnullXnull
        if (
          grid[indiceRiga][numCol] === null &&
          grid[indiceRiga - 1][indiceColonna + 1] === null &&
          grid[indiceRiga - 2][indiceColonna + 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna + 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[numCol] != null) {
            console.log('singolo diagonale sensato');
            return grid[indiceRiga][numCol];
          }
          if (grid[indiceRiga][indiceColonna + 1] != null) {
            console.log('singolo diagonale sensato');
            return grid[indiceRiga - 1][indiceColonna + 1];
          }

          if (grid[indiceRiga - 2][indiceColonna + 3] != null) {
            console.log('singolo diagonale sensato');
            return grid[indiceRiga - 3][indiceColonna + 3];
          }
        }
        //Controllo combinazione nullnullnullX
        if (
          grid[indiceRiga][numCol] === null &&
          grid[indiceRiga - 1][indiceColonna + 1] === null &&
          grid[indiceRiga - 2][indiceColonna + 2] === null &&
          grid[indiceRiga - 3][indiceColonna + 3] === currentPlayer
        ) {
          if (grid[indiceRiga + 1]?.[numCol] != null) {
            console.log('singolo diagonale sensato');
            return grid[indiceRiga][numCol];
          }
          if (grid[indiceRiga][indiceColonna + 1] != null) {
            console.log('singolo diagonale sensato');
            return grid[indiceRiga - 1][indiceColonna + 1];
          }
          if (grid[indiceRiga - 1][indiceColonna + 2] != null) {
            console.log('singolo diagonale sensato');
            return grid[indiceRiga - 2][indiceColonna + 2];
          }
        }
      }
    }
    // diagonale sinistro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = numCol - 1;
        indiceColonna >= 3;
        indiceColonna--
      ) {
        //Controllo combinazione Xnullnullnull
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna - 1] === null &&
          grid[indiceRiga - 2][indiceColonna - 2] === null &&
          grid[indiceRiga - 3][indiceColonna - 3] === null
        ) {
          if (grid[indiceRiga][indiceColonna - 1] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 1][indiceColonna - 1];
          }
          if (grid[indiceRiga - 1][indiceColonna - 2] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 2][indiceColonna - 2];
          }
          if (grid[indiceRiga - 2][indiceColonna - 3] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 3][indiceColonna - 3];
          }
        }

        //Controllo combinazione nullXnullnull
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga - 1][indiceColonna - 1] === currentPlayer &&
          grid[indiceRiga - 2][indiceColonna - 2] === null &&
          grid[indiceRiga - 3][indiceColonna - 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga][indiceColonna];
          }

          if (grid[indiceRiga - 1][indiceColonna - 2] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 2][indiceColonna - 2];
          }
          if (grid[indiceRiga - 2][indiceColonna - 3] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 3][indiceColonna - 3];
          }
        }

        //Controllo combinazione nullnullXnull
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga - 1][indiceColonna - 1] === null &&
          grid[indiceRiga - 2][indiceColonna - 2] === currentPlayer &&
          grid[indiceRiga - 3][indiceColonna - 3] === null
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga][indiceColonna];
          }
          if (grid[indiceRiga][indiceColonna - 1] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 1][indiceColonna - 1];
          }

          if (grid[indiceRiga - 2][indiceColonna - 3] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 3][indiceColonna - 3];
          }
        }

        //Controllo combinazione nullnullnullX
        if (
          grid[indiceRiga][indiceColonna] === null &&
          grid[indiceRiga - 1][indiceColonna - 1] === null &&
          grid[indiceRiga - 2][indiceColonna - 2] === null &&
          grid[indiceRiga - 3][indiceColonna - 3] === currentPlayer
        ) {
          if (grid[indiceRiga + 1]?.[indiceColonna] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga][indiceColonna];
          }
          if (grid[indiceRiga][indiceColonna - 1] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 1][indiceColonna - 1];
          }
          if (grid[indiceRiga - 1][indiceColonna - 2] != null) {
            console.log('Coppia diagonale sensata');
            return grid[indiceRiga - 2][indiceColonna - 2];
          }
        }
      }
    }

    return false;
  }
  findSingleVertical(
    numRow: number,
    numCol: number,
    grid: string[][],
    currentPlayer: string
  ) {
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 1;
        indiceColonna++
      ) {
        //Controllo combinazione Xnullnullnull
        if (
          grid[indiceRiga][indiceColonna] === currentPlayer &&
          grid[indiceRiga - 1][indiceColonna] === null &&
          grid[indiceRiga - 2][indiceColonna] === null &&
          grid[indiceRiga - 3][indiceColonna] === null
        ) {
          console.log('Trio verticale sensato ');
          return grid[indiceRiga - 1][indiceColonna];
        }
      }
    }
    return false;
  }

  //SE NON ESISTE UNA MOSSA SENSATA: con un numero casuale si determina la colonna, si verifica se non è piena; se piena si estrae un altro numero per un'altra colonna altrimenti cerca la casella vuota nella riga più in basso per rispettare la gravità del gioco

  placePawnRandomly(colIndexRandom: number,numRow: number,grid: string[][],currentPlayer: string): boolean {
    for (let indiceRiga = numRow - 1; indiceRiga >= 0; indiceRiga--) {
      if (grid[indiceRiga][colIndexRandom] === null) {
        grid[indiceRiga][colIndexRandom] = currentPlayer;
        return true;
      }
    }
    return false;
  }
}
