import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameServiceService {
  constructor() {}

  getRandomNumber(boardGameSize: string): number {
    if (boardGameSize == '5x5') {
      return Math.floor(Math.random() * 5); // Restituisce un numero intero da 0 a 4
    } else {
      return Math.floor(Math.random() * 7); // Restituisce un numero intero da 0 a 6
    }
  }
  //Se la plancia è piena la partita è pareggiata
  draw(grid: string[][]): boolean {
    // Verifica se la griglia è completa: se viene trovato almeno uno 0 la partita sicuramente non è terminata
    for (let riga of grid) {
      for (let cella of riga) {
        if (cella === '0') {
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
  cellMinusOne(rowIndex: number, colIndex: number, grid: string[][]): boolean {
    return grid[rowIndex][colIndex - 1] !== null;
  }

  //Dato una combinazione di 4 caselle, identifica dov'è la cella vuota. Restituisce la cella vuota
  // identifyEmptyCell(combination: string[]) {
  //   combination.find((element, index) => {
  //     element === null;
  //     return index
  //   });
  // }
}
