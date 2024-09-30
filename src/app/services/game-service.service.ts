import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameServiceService {
  numRandomAPI: string =
    'https://www.random.org/integers/?num=1&min=0&col=1&base=10&format=plain&rnd=new&max=';

  constructor(private http: HttpClient) {}

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

  //Posiziona la pedina in una colonna passata come parametro, rispettando la gravità del gioco
  placePawn(
    player: string,
    numRow: number,
    colIndex: number,
    grid: string[][]
  ): boolean {
    for (let indiceRiga = numRow - 1; indiceRiga >= 0; indiceRiga--) {
      if (grid[indiceRiga][colIndex] === null) {
        grid[indiceRiga][colIndex] = player;
        return true;
      }
    }
    return false;
  }

  // *****VERSIONI COMPRESE*****

  //Diagonali
  //Verifica vincita/blocco e mosse sensate in diagonale
  forza4Diagonal(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ): boolean {
    //streak diagonale destro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        // console.log(
        //   `Controllo diagonale destro: (${indiceRiga}, ${indiceColonna})`
        // );
        if (
          grid[indiceRiga][indiceColonna] === player &&
          grid[indiceRiga - 1][indiceColonna + 1] === player &&
          grid[indiceRiga - 2][indiceColonna + 2] === player &&
          grid[indiceRiga - 3][indiceColonna + 3] === player
        ) {
          console.log(`${player} ha fatto streak diagonale destro`);
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
        // console.log(
        //   `Controllo diagonale sinistro: (${indiceRiga}, ${indiceColonna})`
        // );
        if (
          grid[indiceRiga][indiceColonna] === player &&
          grid[indiceRiga - 1][indiceColonna - 1] === player &&
          grid[indiceRiga - 2][indiceColonna - 2] === player &&
          grid[indiceRiga - 3][indiceColonna - 3] === player
        ) {
          console.log(`${player} ha fatto diagonale sinistro`);
          // this.winner = true;
          // this.typeOfStreak = 'diagonale sinistro';
          return true;
        }
      }
    }

    return false;
  }
  findTrioDiagonal(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ) {
    //diagonale destro
    const result = {
      found: false,
      colIndex: 0,
    };
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        let control = {
          player: 0,
          null: 0,
          index: -1,
          indexValid: false,
          combination: [] as string[],
        };
        //scansiona a 4 a 4
        for (let i = 0; i < 4; i++) {
          //se nella cella c'è player incrementa player
          if (grid[indiceRiga - i][indiceColonna + i] === player) {
            control.player++;
            control.combination.push('x');
          }
          //se nella cella c'è null incrementa null
          else if (grid[indiceRiga - i][indiceColonna + i] === null) {
            control.null++;
            control.combination.push('-');
            //se la cella sotto la cella null è piena indexValid = true e index = indiceColonna + i
            if (
              indiceRiga - i === numRow - 1 ||
              grid[indiceRiga - i + 1][indiceColonna + i] !== null
            ) {
              control.indexValid = true;
              control.index = indiceColonna + i;
            }
          }
        }
        //se control.player = 3, control.null = 1 e indexValid = true, restiruisci result colIndex = indiceColonna e found = true
        if (control.player === 3 && control.null === 1 && control.indexValid) {
          console.log('Forza4 diagonale destro sensato possibile');
          console.log(
            'Combinazione trio sensato intercettata:',
            control.combination
          );
          result.found = true;
          result.colIndex = control.index;
          return result;
        }
      }
    }
    //diagonale sinistro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = numCol - 1;
        indiceColonna >= 3;
        indiceColonna--
      ) {
        let control = {
          player: 0,
          null: 0,
          index: -1,
          indexValid: false,
          combination: [] as string[],
        };
        //scansiona a 4 a 4
        for (let i = 0; i < 4; i++) {
          //se nella cella c'è player incrementa player
          if (grid[indiceRiga - i][indiceColonna - i] === player) {
            control.player++;
            control.combination.push('x');
          }
          //se nella cella c'è null incrementa null
          else if (grid[indiceRiga - i][indiceColonna - i] === null) {
            control.null++;
            control.combination.push('-');
            //se la cella sotto la cella null è piena indexValid = true e index = indiceColonna + i
            if (
              indiceRiga - i === numRow - 1 ||
              grid[indiceRiga - i + 1][indiceColonna - i] !== null
            ) {
              control.indexValid = true;
              control.index = indiceColonna - i;
            }
          }
        }
        //se control.player = 3, control.null = 1 e indexValid = true, restiruisci result colIndex = indiceColonna e found = true
        if (control.player === 3 && control.null === 1 && control.indexValid) {
          console.log('Forza4 diagonale sinistro sensato possibile');
          console.log(
            'Combinazione trio sensato intercettata:',
            control.combination
          );
          result.found = true;
          result.colIndex = control.index;
          return result;
        }
      }
    }

    return result;
  }
  findCoupleDiagonal(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ) {
    //diagonale destro
    const result = {
      found: false,
      colIndex: 0,
    };
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        let control = {
          player: 0,
          null: 0,
          index: -1,
          indexValid: false,
          combination: [] as string[],
        };
        //scansiona a 4 a 4
        for (let i = 0; i < 4; i++) {
          //se nella cella c'è player incrementa player
          if (grid[indiceRiga - i][indiceColonna + i] === player) {
            control.player++;
            control.combination.push('x');
          }
          //se nella cella c'è null incrementa null
          else if (grid[indiceRiga - i][indiceColonna + i] === null) {
            control.null++;
            control.combination.push('-');
            //se la cella sotto la cella null è piena indexValid = true e index = indiceColonna + i
            if (
              indiceRiga - i === numRow - 1 ||
              grid[indiceRiga - i + 1][indiceColonna + i] !== null
            ) {
              control.indexValid = true;
              control.index = indiceColonna + i;
            }
          }
        }
        //se control.player = 2, control.null = 2 e indexValid = true, restiruisci result colIndex = indiceColonna e found = true
        if (control.player === 2 && control.null === 2 && control.indexValid) {
          console.log('Trio diagonale destro sensato possibile');
          console.log(
            'Combinazione duo sensato intercettata:',
            control.combination
          );
          result.found = true;
          result.colIndex = control.index;
          return result;
        }
      }
    }
    //diagonale sinistro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = numCol - 1;
        indiceColonna >= 3;
        indiceColonna--
      ) {
        let control = {
          player: 0,
          null: 0,
          index: -1,
          indexValid: false,
          combination: [] as string[],
        };
        //scansiona a 4 a 4
        for (let i = 0; i < 4; i++) {
          //se nella cella c'è player incrementa player
          if (grid[indiceRiga - i][indiceColonna - i] === player) {
            control.player++;
            control.combination.push('x');
          }
          //se nella cella c'è null incrementa null
          else if (grid[indiceRiga - i][indiceColonna - i] === null) {
            control.null++;
            control.combination.push('-');
            //se la cella sotto la cella null è piena indexValid = true e index = indiceColonna + i
            if (
              indiceRiga - i === numRow - 1 ||
              grid[indiceRiga - i + 1][indiceColonna - i] !== null
            ) {
              control.indexValid = true;
              control.index = indiceColonna - i;
            }
          }
        }
        //se control.player = 2, control.null = 2 e indexValid = true, restiruisci result colIndex = indiceColonna e found = true
        if (control.player === 2 && control.null === 2 && control.indexValid) {
          console.log('Trio diagonale sinistro sensato possibile');
          console.log(
            'Combinazione duo sensato intercettata:',
            control.combination
          );
          result.found = true;
          result.colIndex = control.index;
          return result;
        }
      }
    }

    return result;
  }
  findSingleDiagonal(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ) {
    //diagonale destro
    const result = {
      found: false,
      colIndex: 0,
    };
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        let control = {
          player: 0,
          null: 0,
          index: -1,
          indexValid: false,
          combination: [] as string[],
        };
        //scansiona a 4 a 4
        for (let i = 0; i < 4; i++) {
          //se nella cella c'è player incrementa player
          if (grid[indiceRiga - i][indiceColonna + i] === player) {
            control.player++;
            control.combination.push('x');
          }
          //se nella cella c'è null incrementa null
          else if (grid[indiceRiga - i][indiceColonna + i] === null) {
            control.null++;
            control.combination.push('-');
            //se la cella sotto la cella null è piena indexValid = true e index = indiceColonna + i
            if (
              indiceRiga - i === numRow - 1 ||
              grid[indiceRiga - i + 1][indiceColonna + i] !== null
            ) {
              control.indexValid = true;
              control.index = indiceColonna + i;
            }
          }
        }
        //se control.player = 1, control.null = 3 e indexValid = true, restiruisci result colIndex = indiceColonna e found = true
        if (control.player === 1 && control.null === 3 && control.indexValid) {
          console.log('Duo diagonale destro sensato possibile');
          console.log(
            'Combinazione singola sensata intercettata:',
            control.combination
          );
          result.found = true;
          result.colIndex = control.index;
          return result;
        }
      }
    }
    //diagonale sinistro
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (
        let indiceColonna = numCol - 1;
        indiceColonna >= 3;
        indiceColonna--
      ) {
        let control = {
          player: 0,
          null: 0,
          index: -1,
          indexValid: false,
          combination: [] as string[],
        };
        //scansiona a 4 a 4
        for (let i = 0; i < 4; i++) {
          //se nella cella c'è player incrementa player
          if (grid[indiceRiga - i][indiceColonna - i] === player) {
            control.player++;
            control.combination.push('x');
          }
          //se nella cella c'è null incrementa null
          else if (grid[indiceRiga - i][indiceColonna - i] === null) {
            control.null++;
            control.combination.push('-');
            //se la cella sotto la cella null è piena indexValid = true e index = indiceColonna + i
            if (
              indiceRiga - i === numRow - 1 ||
              grid[indiceRiga - i + 1][indiceColonna - i] !== null
            ) {
              control.indexValid = true;
              control.index = indiceColonna - i;
            }
          }
        }
        //se control.player = 1, control.null = 3 e indexValid = true, restiruisci result colIndex = indiceColonna e found = true
        if (control.player === 1 && control.null === 3 && control.indexValid) {
          console.log('Duo diagonale sinistro sensato possibile');
          console.log(
            'Combinazione singola sensata intercettata:',
            control.combination
          );
          result.found = true;
          result.colIndex = control.index;
          return result;
        }
      }
    }

    return result;
  }

  //Orizzontali
  //Verifica vincita/blocco e mosse sensate in orizzontale
  forza4Horizontal(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ): boolean {
    for (let indiceRiga = numRow - 1; indiceRiga >= 0; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        // console.log(`Controllo orizzontale: (${indiceRiga}, ${indiceColonna})`);
        if (
          grid[indiceRiga][indiceColonna] === player &&
          grid[indiceRiga][indiceColonna + 1] === player &&
          grid[indiceRiga][indiceColonna + 2] === player &&
          grid[indiceRiga][indiceColonna + 3] === player
        ) {
          console.log(`${player} ha fatto streak orizzontale`);
          // this.winner = true;
          // this.typeOfStreak = 'diagonale destro';
          return true;
        }
      }
    }
    return false;
  }

  findTrioHorizontal(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ) {
    const result = {
      found: false,
      colIndex: 0,
    };
    for (let indiceRiga = numRow - 1; indiceRiga >= 0; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        let control = {
          player: 0,
          null: 0,
          index: -1,
          indexValid: false,
          combination: [] as string[],
        };
        //scansiona a 4 a 4
        for (let i = 0; i < 4; i++) {
          //se nella cella c'è player incrementa player
          if (grid[indiceRiga][indiceColonna + i] === player) {
            control.player++;
            control.combination.push('x');
          }
          //se nella cella c'è null incrementa null
          else if (grid[indiceRiga][indiceColonna + i] === null) {
            control.null++;
            control.combination.push('-');
            //se la cella sotto la cella null è piena indexValid = true e index = indiceColonna + i
            if (
              indiceRiga === numRow - 1 ||
              grid[indiceRiga][indiceColonna + i] !== null
            ) {
              control.indexValid = true;
              control.index = indiceColonna + i;
            }
          }
        }
        //se control.player = 3, control.null = 1 e indexValid = true, restiruisci result colIndex = indiceColonna e found = true
        if (control.player === 3 && control.null === 1 && control.indexValid) {
          console.log('Forza4 orizzontale sensato possibile');
          console.log(
            'Combinazione tris sensata intercettata:',
            control.combination
          );
          result.found = true;
          result.colIndex = control.index;
          return result;
        }
      }
    }
    return result;
  }
  findCoupleHorizontal(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ) {
    const result = {
      found: false,
      colIndex: 0,
    };
    for (let indiceRiga = numRow - 1; indiceRiga >= 0; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        let control = {
          player: 0,
          null: 0,
          index: -1,
          indexValid: false,
          combination: [] as string[],
        };
        //scansiona a 4 a 4
        for (let i = 0; i < 4; i++) {
          //se nella cella c'è player incrementa player
          if (grid[indiceRiga][indiceColonna + i] === player) {
            control.player++;
            control.combination.push('x');
          }
          //se nella cella c'è null incrementa null
          else if (grid[indiceRiga][indiceColonna + i] === null) {
            control.null++;
            control.combination.push('-');
            //se la cella sotto la cella null è piena indexValid = true e index = indiceColonna + i
            if (
              indiceRiga === numRow - 1 ||
              grid[indiceRiga][indiceColonna + i] !== null
            ) {
              control.indexValid = true;
              control.index = indiceColonna + i;
            }
          }
        }
        //se control.player = 2, control.null = 2 e indexValid = true, restiruisci result colIndex = indiceColonna e found = true
        if (control.player === 2 && control.null === 2 && control.indexValid) {
          console.log('Tris orizzontale sensato possibile');
          console.log(
            'Combinazione duo sensato intercettata:',
            control.combination
          );
          result.found = true;
          result.colIndex = control.index;
          return result;
        }
      }
    }
    return result;
  }
  findSingleHorizontal(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ) {
    const result = {
      found: false,
      colIndex: 0,
    };
    for (let indiceRiga = numRow - 1; indiceRiga >= 0; indiceRiga--) {
      for (
        let indiceColonna = 0;
        indiceColonna <= numCol - 4;
        indiceColonna++
      ) {
        let control = {
          player: 0,
          null: 0,
          index: -1,
          indexValid: false,
          combination: [] as string[],
        };
        //scansiona a 4 a 4
        for (let i = 0; i < 4; i++) {
          //se nella cella c'è player incrementa player
          if (grid[indiceRiga][indiceColonna + i] === player) {
            control.player++;
            control.combination.push('x');
          }
          //se nella cella c'è null incrementa null
          else if (grid[indiceRiga][indiceColonna + i] === null) {
            control.null++;
            control.combination.push('-');
            //se la cella sotto la cella null è piena indexValid = true e index = indiceColonna + i
            if (
              indiceRiga === numRow - 1 ||
              grid[indiceRiga][indiceColonna + i] !== null
            ) {
              control.indexValid = true;
              control.index = indiceColonna + i;
            }
          }
        }
        //se control.player = 1, control.null = 3 e indexValid = true, restiruisci result colIndex = indiceColonna e found = true
        if (control.player === 1 && control.null === 3 && control.indexValid) {
          console.log('Duo orizzontale sensato possibile');
          console.log(
            'Combinazione singola sensata intercettata:',
            control.combination
          );
          result.found = true;
          result.colIndex = control.index;
          return result;
        }
      }
    }
    return result;
  }

  //Verticali
  //Verifica vincita/blocco e mosse sensate in verticale

  forza4Vertical(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ): boolean {
    //streak verticale
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (let indiceColonna = 0; indiceColonna < numCol; indiceColonna++) {
        // console.log(`Controllo verticale: (${indiceRiga}, ${indiceColonna})`);
        if (
          grid[indiceRiga][indiceColonna] === player &&
          grid[indiceRiga - 1][indiceColonna] === player &&
          grid[indiceRiga - 2][indiceColonna] === player &&
          grid[indiceRiga - 3][indiceColonna] === player
        ) {
          console.log(`${player} ha fatto streak verticale`);
          // this.winner = true;
          // this.typeOfStreak = 'verticale';
          return true;
        }
      }
    }
    return false;
  }
  findTrioVertical(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ) {
    const result = {
      found: false,
      colIndex: 0,
    };
    //streak verticale
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (let indiceColonna = 0; indiceColonna < numCol; indiceColonna++) {
        //Controllo combinazione XXXnull
        if (
          grid[indiceRiga][indiceColonna] === player &&
          grid[indiceRiga - 1][indiceColonna] === player &&
          grid[indiceRiga - 2][indiceColonna] === player &&
          grid[indiceRiga - 3][indiceColonna] === null
        ) {
          console.log('Forza4 verticale sensato possibile');
          console.log('Combinazione trio sensata intercettata: xxx-');
          result.found = true;
          result.colIndex = indiceColonna;
          return result;
        }
      }
    }
    return result;
  }
  findCoupleVertical(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ) {
    const result = {
      found: false,
      colIndex: 0,
    };
    //duo verticale
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (let indiceColonna = 0; indiceColonna < numCol; indiceColonna++) {
        //Controllo combinazione XXnullnull
        if (
          grid[indiceRiga][indiceColonna] === player &&
          grid[indiceRiga - 1][indiceColonna] === player &&
          grid[indiceRiga - 2][indiceColonna] === null &&
          grid[indiceRiga - 3][indiceColonna] === null
        ) {
          console.log('Trio verticale sensato possibile');
          console.log('Combinazione doppio sensata intercettata: xx--');
          result.found = true;
          result.colIndex = indiceColonna;
          return result;
        }
      }
    }
    return result;
  }
  findSingleVertical(
    numRow: number,
    numCol: number,
    grid: string[][],
    player: string
  ) {
    const result = {
      found: false,
      colIndex: 0,
    };
    //duo verticale
    for (let indiceRiga = numRow - 1; indiceRiga >= 3; indiceRiga--) {
      for (let indiceColonna = 0; indiceColonna < numCol; indiceColonna++) {
        //Controllo combinazione Xnullnullnull
        if (
          grid[indiceRiga][indiceColonna] === player &&
          grid[indiceRiga - 1][indiceColonna] === null &&
          grid[indiceRiga - 2][indiceColonna] === null &&
          grid[indiceRiga - 3][indiceColonna] === null
        ) {
          console.log('Duo verticale sensato possibile');
          console.log('Combinazione singolo sensato intercettata: x---');
          result.found = true;
          result.colIndex = indiceColonna;
          return result;
        }
      }
    }
    return result;
  }
}
