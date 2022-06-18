document.addEventListener('DOMContentLoaded', () => {
  console.log('Loaded');

  console.log(players); 
  console.log(deck);

  const divCommands = document.querySelector('.commands' );
  const btnStartGame = document.querySelector('.start-game' );
  const divChips = document.querySelector('.chips' );

  printPlayers();
  
  addActionButtons(divCommands);

  btnStartGame.addEventListener('click', () => {

    // btnStartGame.classList.add('hidden');
    initialize();
    game();

    // if (currentPhase == GAME_PHASE.SHOWDOWN)
    //   currentPhase = GAME_PHASE.PRE_FLOP;
    // else
    //   currentPhase++;

    //btnStartGame.classList.add('hidden');
    for(let p in GAME_PHASE) {
      if (GAME_PHASE[p] == currentPhase)
        btnStartGame.textContent = p;

      if (GAME_PHASE[p] == GAME_PHASE.PRE_FLOP)
        btnStartGame.textContent = 'Start Game!';

    }

    divChips.classList.remove('hidden');
  });

  // btnStartGame.parentElement.removeChild(btnStartGame);

});

  function addActionButtons(divCommands) {
    // btnFold
    const btnFold = document.createElement('button');
    btnFold.textContent = "Fold";
    btnFold.classList.add('action-button', 'fold');
    btnFold.addEventListener('click', fold);

    // btnCall
    const btnCall = document.createElement('button');
    btnCall.textContent = "Call";
    btnCall.classList.add('action-button','call');
    btnCall.addEventListener('click', call);

    // btnRaise
    const btnRaise = document.createElement('button');
    btnRaise.textContent = "Raise";
    btnRaise.classList.add('action-button','raise');
    btnRaise.addEventListener('click', raise);

    divCommands.appendChild(btnFold);
    divCommands.appendChild(btnCall);
    divCommands.appendChild(btnRaise);
  }

  const CARDS_NUMBER = 52;

  const HEARTS = 0;
  const DIAMONDS = 1;
  const CLUBS = 2;
  const SPADES = 3;

  const SEEDS = [   
     'hearts', 
     'diamonds', 
     'clubs', 
     'spades'    
  ];

  const CARDS_CLASSES = [
    'two' ,
    'three' ,
    'four' ,
    'five' ,
    'six' ,
    'seven' ,
    'eight' ,
    'nine' ,
    'ten',
    'jack',
    'queen',
    'king',
    'ace'
  ];

  const cards = [];
  const deck = [];
  const board = [];

  const GAME_PHASE = {
    PRE_FLOP: 0,
    FLOP: 1,
    TURN: 2,
    RIVER: 3,
    SHOWDOWN: 4
  };

  let currentPhase = GAME_PHASE.PRE_FLOP;
  const BIG_BLIND_SIZE = 20;
  let potSize = 0;
  let dealerPosition = 1;

  let currentPlayer;

  const players = [
    {
      seat: 1,
      stack: 2000,
      cards: []
    },
    {
      seat: 2,
      stack: 2000,
      cards: []
    },
    // {
    //   seat: 3,
    //   cards: []
    // },
    // {
    //   seat: 4,
    //   cards: []
    // },
    // {
    //   seat: 5,
    //   cards: []
    // },
    // {
    //   seat: 6,
    //   cards: []
    // },
    // {
    //   seat: 7,
    //   cards: []
    // },
    // {
    //   seat: 8,
    //   cards: []
    // },
    // {
    //   seat: 9,
    //   cards: []
    // }
  ];

  const score = {
    HIGH_CARD: 0,
    PAIR: 1,
    TWO_PAIR: 2,
    THREE_OF_A_KIND: 3,
    STRAIGHT: 4,
    FLUSH: 5,
    FULL_HOUSE: 6,
    FOUR_OF_A_KIND: 7,
    STRAIGHT_FLUSH: 8
  };

  // actions
  function fold() {
    console.log('You Folded');
  }
   function call() {
    console.log('You Call');
  }
   function raise() {
    console.log('You Raised');
  }

  function getWinner(cardsA, cardsB) {

    const scoreA = evaluateScore(cardsA);
    const scoreB = evaluateScore(cardsB);

    if (scoreA != scoreB)
      return {
        isDraw: false,
        winner: {
          position: scoreA > scoreB ? 1 : 2,
          cards: scoreA > scoreB ? cardsA : cardsB,
          score: Math.max(scoreA, scoreB)
        }, 
        loser: {
          position: scoreA < scoreB ? 1 : 2,
          cards: scoreA < scoreB ? cardsA : cardsB,
          score: Math.min(scoreA, scoreB)
        }
      };

    const point = scoreA;
    let subScoreA, subScoreB;

    switch (point) {
      case score.HIGH_CARD:
        subScoreA = getHighCardScore(cardsA);
        subScoreB = getHighCardScore(cardsB);
        break;

      case score.PAIR:
        subScoreA = getPairScore(cardsA);
        subScoreB = getPairScore(cardsB);
        break;

      case score.TWO_PAIR:
        subScoreA = getTwoPairScore(cardsA);
        subScoreB = getTwoPairScore(cardsB);
        break;

      case score.THREE_OF_A_KIND:
        subScoreA = getThreeOfAKindScore(cardsA);
        subScoreB = getThreeOfAKindScore(cardsB);
        break;

      case score.STRAIGHT:
        subScoreA = getStraightScore(cardsA);
        subScoreB = getStraightScore(cardsB);
        break;

      case score.FLUSH:
        subScoreA = getFlushScore(cardsA);
        subScoreB = getFlushScore(cardsB);
        break;

      case score.FULL_HOUSE:
        subScoreA = getFullHouseScore(cardsA);
        subScoreB = getFullHouseScore(cardsB);
        break;

      case score.FOUR_OF_A_KIND:
        subScoreA = getFourOfAKindScore(cardsA);
        subScoreB = getFourOfAKindScore(cardsB);
        break;

      case score.STRAIGHT_FLUSH:
        subScoreA = getStraightFlushScore(cardsA);
        subScoreB = getStraightFlushScore(cardsB);
        break;
    
      default:
        break;
    }

    if (subScoreA != subScoreB)
      return {
        isDraw: false,
        winner: {
          position: subScoreA > subScoreB ? 1 : 2,
          cards: subScoreA > subScoreB ? cardsA : cardsB,
          score: scoreA,
          subScore: Math.max(subScoreA, subScoreB)
        }, 
        loser: {
          position: subScoreA < subScoreB ? 1 : 2,
          cards: subScoreA < subScoreB ? cardsA : cardsB,
          score: scoreA,
          subScore: Math.min(subScoreA, subScoreB)
        }
      };
      
      // {
      //   winner: subScoreA > subScoreB ? 1 : 2,
      //   score: scoreA,
      //   subScore: Math.max(subScoreA, subScoreB)
      // };

    return {
        isDraw: true,
        score: scoreA,
        subScore: subScoreA
      }; // draw

  }

  function getHighCardScore(cards) {

    cards = makeMod13(cards);
    let score = 0;
    
    let firstCard = Math.max(...cards);
    let secondCard = Math.max(...cards.filter(c => c != firstCard));
    let thirdCard = Math.max(...cards.filter(c => c != firstCard && c != secondCard));
    let fourthCard = Math.max(...cards.filter(c => c != firstCard && c != secondCard && c != thirdCard));
    let fifthCard = Math.max(...cards.filter(c => c != firstCard && c != secondCard && c != thirdCard && c != fourthCard));

    score += (firstCard + 2) * 100 * 100 + (secondCard + 2) * 100 + (thirdCard + 2) * 1 + (fourthCard + 2) * 0.01 + (fifthCard + 2) * 0.01 * 0.01;

    return score;
  }

  function getPairScore(cards) {

    cards = makeMod13(cards);
    // let uniqueItems = [...new Set(cards)];
    // let cardsWithoutPair = cards.filter(c => c != pairedCard);
    const pairedCard = cards.find((c, i) => cards.indexOf(c) !== i && cards.indexOf(c) != -1);
    // let pairedCard = cards.find(c => !cardsWithoutPair.includes(c));

    if (pairedCard == null)
      return -1;
    
    let score = 0;
    score += (pairedCard + 2) * 100 * 100;

    let thirdCard = Math.max(...cards.filter(c => c != pairedCard));
    let fourthCard = Math.max(...cards.filter(c => c != pairedCard && c != thirdCard));
    let fifthCard = Math.max(...cards.filter(c => c != pairedCard && c != thirdCard && c != fourthCard));

    score += (thirdCard + 2) * 100 + (fourthCard + 2) * 1 + (fifthCard + 2) * 0.01;

    return score;
  }

  function getTwoPairScore(cards) {

    cards = makeMod13(cards);
    const workingArr = [];
    let firstPair, secondPair;
    cards.forEach(c => {
      let isPair = workingArr.filter(x => x == c).length > 0;      
      if (isPair && firstPair == null) firstPair = c;
      else if (isPair && secondPair == null) secondPair = c;
      else if (!isPair) workingArr.push(c);      
    });
    if (firstPair == null || secondPair == null)
      return -1;

    let score = 0;
    score += (Math.max(firstPair, secondPair) + 2) * 100 + (Math.min(firstPair, secondPair) + 2);

    let fifthCard = Math.max(...cards.filter(c => c != firstPair && c != secondPair))
    score += (fifthCard + 2) * 0.01;

    return score;
  }

  function getStraightFlushScore(cards) {
    return getStraightScore(cards, true);
  }

  function getStraightScore(cards, isStraightFlush) {
    if (isMinStraight(cards, isStraightFlush))
      return 0;

    if (isMaxStraight(cards, isStraightFlush))
      return Infinity;

    cards = sortNum(cards);

    if (!isStraightFlush)
      cards = makeMod13(cards);

    const tempCards = [];
    tempCards.push(cards[0]);

    for (let i = 0; i < cards.length - 1; i++) {
      if (tempCards[tempCards.length - 1] == cards[i + 1] - 1)
        tempCards.push(cards[i + 1]);    
      else if (tempCards[tempCards.length - 1] == cards[i + 1])
        continue;   
      else if (tempCards.length < 5) {
        tempCards.splice(0, tempCards.length);
        tempCards.push(cards[i + 1]); 
      }

    }

    return tempCards.length >= 5 ? Math.max(...tempCards) + 2 : -1;
  }

  function getFlushScore(cards) {
    
    cards = sortNum(cards);
    
    let flushLength =  0;
    let flushColor = 0;
    let flushCards = [];

    let min = Math.floor(flushColor / 13) * 13;
    let max = Math.floor(flushColor / 13) * 13 + 12;

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      if (c >= min && c <= max) {
        flushLength++;
        flushCards.push(c);
      } else if (flushLength < 5) {
        flushLength = 1;
        flushCards.splice(0, flushCards.length);
        flushCards.push(c);
        flushColor = c;
        min = Math.floor(flushColor / 13) * 13;
        max = Math.floor(flushColor / 13) * 13 + 12;
      }
    }

    if (flushLength < 5) 
      return -1;

    flushCards = makeMod13(flushCards);
    flushCards.splice(0, flushCards.length - 5);
    let score = 0;
    for (let i = 0; i < flushCards.length; i++) {
      score += (flushCards[i] + 2);      
    }
    return score;
  }

   function getFullHouseScore(cards) {
      return getThreeOfAKindScore(cards, true);
   }

  function getThreeOfAKindScore(cards, checkFullHouse) {
    cards = makeMod13(cards);
    const workingArr = [];
    const pairedArr = [];
    
    for (let index = 0; index < cards.length; index++) {
      const c = cards[index];

      let existsInPaired = false;
      let existsInWorking = false;

      for (let i = 0; i < pairedArr.length; i++) {
        const element = pairedArr[i];
        if (element.card == c) {
          element.occurrences++;
          existsInPaired = true;
          break;
        }        
      }   
      if (existsInPaired) continue;
      
      for (let i = 0; i < workingArr.length; i++) {
        const element = workingArr[i];
        if (element == c) {
          pairedArr.push({
            card: c,
            occurrences: 2
          });
          existsInWorking = true;
          break;
        } 
      }
      if (existsInWorking) continue;

      workingArr.push(c);
    }
    let threeOfAKind, otherPair;
    
    threeOfAKind = pairedArr.find(c => c.occurrences >= 3);
    if (threeOfAKind == null)
      return -1;

    otherPair = pairedArr.find(c => c.occurrences >= 2 && c.card != threeOfAKind.card);
    
    let score = 0;
    if (checkFullHouse) {
      if (otherPair == null || threeOfAKind.occurrences < 3 || otherPair.occurrences < 2) 
        return -1;
  
      score += (threeOfAKind.card + 2) * 100 + (otherPair.card + 2);
      return score;

    } else {
      score += (threeOfAKind.card + 2) * 100;

      let firstCard = Math.max(...cards.filter(c => c != threeOfAKind.card));
      let secondCard = Math.max(...cards.filter(c => c != threeOfAKind.card && c != firstCard));
      let thirdCard = Math.max(...cards.filter(c => c != threeOfAKind.card && c != firstCard && c != secondCard));

      score += (firstCard + 2) + (secondCard + 2) * 0.01 + (thirdCard + 2) * 0.00001;
      return score;
    }

  }

  function getFourOfAKindScore(cards) {

    cards = makeMod13(cards);
    cards = sortNum(cards);

    let pokerCard = cards[0];
    let tempCards = removeFirstFromArray(cards);

    let numOfEqualCards = 1;
    tempCards.forEach(c => {
      if (c == pokerCard)
        numOfEqualCards++;
      else if (numOfEqualCards < 4) {
        numOfEqualCards = 1;
        pokerCard = c;
      }
    });


    if (numOfEqualCards < 4) 
      return -1;

    let score = (pokerCard + 2);
    let tmpCards = cards.filter(c => c != pokerCard);
    let fifthCard = Math.max(...tmpCards) || 1;

    score += 0.01 * (fifthCard + 2);
    return score;

  }

  function getCardDescriptionsByIndexes(cards) {
    const cardDescriptions = [];
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const descr = getCardDescriptionByIndex(c);
      cardDescriptions.push(descr);
    }
    return cardDescriptions;
  }

  function getCardIndexesByDescriptions(cardDescriptions) {
    const cardIndexes = [];
    for (let i = 0; i < cardDescriptions.length; i++) {
      const c = cardDescriptions[i];
      const index = getCardIndexByDescription(c);
      cardIndexes.push(index);
    }
    return cardIndexes;
  }

  // getCardIndex(["spades", "two"])
  function getCardIndexByDescription(cardDescription) {

    let seed = cardDescription[0];
    let cardClass = cardDescription[1];
    
    return (SEEDS.indexOf(seed) * 13) + (CARDS_CLASSES.indexOf(cardClass));
  }

  function evaluateScore(cards) {

    if (!cards || cards.length < 5) return;

    let currentScore = score.HIGH_CARD;

    cards = sortNum(cards);

    switch(true) {

      case isStraightFlush(cards): 
        currentScore = score.STRAIGHT_FLUSH;
        break;

      case isFourOfAKind(cards): 
        currentScore = score.FOUR_OF_A_KIND;
        break;

      case isFullHouse(cards): 
        currentScore = score.FULL_HOUSE;
        break;

      case isFlush(cards): 
        currentScore = score.FLUSH;
        break;

      case isStraight(cards): 
        currentScore = score.STRAIGHT;
        break;

      case isThreeOfAKind(cards): 
        currentScore = score.THREE_OF_A_KIND;
        break;

      case isTwoPair(cards): 
        currentScore = score.TWO_PAIR;
        break;

      case isPair(cards): 
        currentScore = score.PAIR;
        break;

      default:
        break;
    }
    return currentScore;
  }

  function isFourOfAKind(cards) {

    cards = makeMod13(cards);
    cards = sortNum(cards);

    let firstCard = cards[0];
    const tempCards = removeFirstFromArray(cards);

    let numOfEqualCards = 1;
    tempCards.forEach(c => {
      if (c == firstCard)
        numOfEqualCards++;
      else if (numOfEqualCards < 4) {
        numOfEqualCards = 1;
        firstCard = c;
      }
    });
    return numOfEqualCards == 4;

  }
  function isFullHouse(cards) {
    return isThreeOfAKind(cards, true);
  }

  function isFlush(cards) {

    
    cards = sortNum(cards);
    
    let flushLength =  0;
    let n = 0;
    let min = Math.floor(n / 13) * 13;
    let max = Math.floor(n / 13) * 13 + 12;

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      if (c >= min && c <= max) {
        flushLength++;
      } else if (flushLength < 5) {
        flushLength = 1;
        n = c;
        min = Math.floor(n / 13) * 13;
        max = Math.floor(n / 13) * 13 + 12;
      }
    }

    return flushLength >= 5;

    // let isFlush = true;
    // let n = 0;

    // cards = sortNum(cards);
    // let card = cards[n];
    // const tmpCards = cards.filter(c => c != card);

    // let min = Math.floor(card / 13) * 13;
    // let max = Math.floor(card/13) * 13 + 12;
    // let flushLength =  1;

    // for (let i = 0; i < tmpCards.length; i++) {
    //   const element = tmpCards[i];
      
    // }
    // tmpCards.forEach(c => {
    //   if (c >= min && c <= max) {
    //     flushLength++;
    //   }
    // });
    // return flushLength >= 5;
  }

  function isStraight(cards,isStraightFlush) {
    let isStraight = isMinStraight(cards,isStraightFlush);
    if (isStraight)
      return true;

    isStraight = isMaxStraight(cards,isStraightFlush);
    if (isStraight)
      return true;
    
    let tempCards = cards;
    if (!isStraightFlush)
      tempCards = makeMod13(cards);

    tempCards = sortNum(tempCards);

    let straightLength = 1;
    let prevElem = tempCards[0];

    for (let i = 1; i < tempCards.length; i++) {
      if (prevElem + 1 == tempCards[i]){
        straightLength++;       
      } else if (prevElem != tempCards[i]){
        if (straightLength < 5)
          straightLength = 1;
      }
        
      prevElem = tempCards[i];
    }
    return  straightLength >= 5;
  }


  function isThreeOfAKind(cards, checkFullHouse) {

    cards = makeMod13(cards);
    const workingArr = [];
    const pairedArr = [];
    
    for (let index = 0; index < cards.length; index++) {
      const c = cards[index];

      let existsInPaired = false;
      let existsInWorking = false;

      for (let i = 0; i < pairedArr.length; i++) {
        const element = pairedArr[i];
        if (element.card == c) {
          element.occurrences++;
          existsInPaired = true;
          break;
        }        
      }   
      if (existsInPaired) continue;
      
      for (let i = 0; i < workingArr.length; i++) {
        const element = workingArr[i];
        if (element == c) {
          pairedArr.push({
            card: c,
            occurrences: 2
          });
          existsInWorking = true;
          break;
        } 
      }
      if (existsInWorking) continue;

      workingArr.push(c);
    }
    let threeOfAKind, otherPair;
    
    threeOfAKind = pairedArr.find(c => c.occurrences >= 3);
    if (threeOfAKind != null)
      otherPair = pairedArr.find(c => c.occurrences >= 2 && c.card != threeOfAKind.card);
    
    if (!checkFullHouse) 
      return threeOfAKind != null;
      
    return threeOfAKind != null && otherPair != null;
  }

  function isTwoPair(cards) {

    cards = makeMod13(cards);
    const workingArr = [];
    let firstPair, secondPair;
    cards.forEach(c => {
      let isPair = workingArr.filter(x => x == c).length > 0;      
      if (isPair && firstPair == null) firstPair = c;
      else if (isPair && secondPair == null) secondPair = c;
      else if (!isPair) workingArr.push(c);      
    });
    return firstPair != null && secondPair != null;
  }

  function isPair(cards) {
    cards = makeMod13(cards);
    let uniqueItems = [...new Set(cards)];
    return uniqueItems.length < cards.length;
  }

  function isStraightFlush(cards) {
    
    return isStraight(cards, true);
  }

  function sortNum(arrayOfNumbers){
    return arrayOfNumbers.sort(function(a, b) {
      return a - b;
    });
  }

  function makeMod13(arrayOfNumbers) {
    const tempArray = [];
    arrayOfNumbers.forEach(c => tempArray.push(c % 13));
    return tempArray;
  }


  function isMinStraight(cards, isStraightFlush) {
    if (!isStraightFlush)
      cards = makeMod13(cards);

    // cards = sortNum(cards);
    
    // return   cards[0] == 0 
    //       && cards[1] == 1 
    //       && cards[2] == 2 
    //       && cards[3] == 3
    //       && cards[4] == 12;
    return containsEvery(cards, [0, 1, 2, 3, 12]);
  }

  function isMaxStraight(cards, isStraightFlush) {
    if (!isStraightFlush)
      cards = makeMod13(cards);

    // cards = sortNum(cards);

    // return  cards[0] == 8 
    //     && cards[1] == 9 
    //     && cards[2] == 10 
    //     && cards[3] == 11
    //     && cards[4] == 12;
    return containsEvery(cards, [8, 9, 10, 11, 12]);
  }

  const heroSeat = 1;
  
  function initialize() {
    if (currentPhase != GAME_PHASE.PRE_FLOP) return;

    prepareDeck(); 
    emptyPlayers();
    emptyBoard();
    distributeCards();   
    placeBlinds();

    // currentPhase = GAME_PHASE.PRE_FLOP;
  }

  function preflop() {
    console.log('preflop...')
  }

  function game() {

    switch (currentPhase) {
      case GAME_PHASE.PRE_FLOP:
        preflop();
        break;

      case GAME_PHASE.FLOP:
        flop();
        break;

      case GAME_PHASE.TURN:
        turn();
        break;

      case GAME_PHASE.RIVER:
        river();
        break;

      case GAME_PHASE.SHOWDOWN:
        showdown();
        break;
    
      default:
        break;
    }

    if (currentPhase == GAME_PHASE.SHOWDOWN)
      currentPhase = GAME_PHASE.PRE_FLOP;
    else
      currentPhase++;

    // setTimeout(() => {
    //   flop();
    //   // console.log(deck);
    //   console.log('Hero: ', evaluateScore(players[0].cards.concat(board)));
    //   console.log('Villain: ', evaluateScore(players[1].cards.concat(board)));
    // }, 1000);

    // setTimeout(() => {
    //   turn();
    //   // console.log(deck);
    //   console.log('Hero: ', evaluateScore(players[0].cards.concat(board)));
    //   console.log('Villain: ', evaluateScore(players[1].cards.concat(board)));
    // }, 2000);

    // setTimeout(() => {
    //   river();
    //   // console.log(deck);
    //   console.log('Hero: ', evaluateScore(players[0].cards.concat(board)));
    //   console.log('Villain: ', evaluateScore(players[1].cards.concat(board)));

    //   showdown();

    // }, 3000);

    
  }

  function showdown() {

    const heroCombo = players[0].cards.concat(board);
    const villainCombo = players[1].cards.concat(board);
    const winnerStats = getWinner(heroCombo, villainCombo);

      let outputLabel;

      if (winnerStats.isDraw) {
        outputLabel = 'draw';
        for(s in score) {
        if (score[s] === winnerStats.score)
          outputLabel += "\nWinner: " + s.toString();
        }
      }
      else {
        outputLabel = winnerStats.winner.position == 1 ? 'hero wins' : 'villain wins';

        let punteggioWinner;
        for(s in score) {
          if (score[s] === winnerStats.winner.score)
            punteggioWinner = s.toString();
        }
        outputLabel += "\nWinner: " + punteggioWinner;
  
        let punteggioLoser;
        for(s in score) {
          if (score[s] === winnerStats.loser.score)
            punteggioLoser = s.toString();
        }
        outputLabel += "\nLoser: " + punteggioLoser;
      }
      
      let i = 0;
      players.forEach(p => {
        if (p.seat == heroSeat) 
          return;
        setTimeout(() => {
          showCards(p.seat);
          setTimeout(() => { alert(outputLabel); }, 200);
        }, 1000 * i++);
      });
  }

  function emptyBoard() {

    board.splice(0, board.length);

    const boardElement = document.querySelector('.board');
    [...boardElement.children].forEach(streetElement => {
      [...streetElement.children].forEach(c => c.remove());
    })
  }

  function emptyPlayers() {
    players.forEach(player => {
      player.cards.splice(0, player.cards.length);
    });

    const playerCards = document.querySelectorAll('.player-cards');
    playerCards.forEach(pc => {
      [...pc.children].forEach(c => c.remove());
    })
  }

  function printPlayers() {

      players.forEach((player, index) => {
        const seat = document.querySelector('.seat.s' +player.seat );
        
        const p = document.createElement('div');
        p.classList.add('player', 'p' + player.seat);

        // player action
        const pAction = document.createElement('div');
        pAction.classList.add('player-action');

        if (player.seat == heroSeat) {
          pAction.innerHTML = '<div class="player-name hero">Hero</div><div class="player-bet">Bet 100€</div>';
        } else {
          pAction.innerHTML = '<div class="player-name">Player ' + (index+1) + '</div><div class="player-bet">Bet 100€</div>';
        }

        p.appendChild(pAction);

        // player cards
        const pCards = document.createElement('div');
        pCards.classList.add('player-cards');
        p.appendChild(pCards);

        if (player.seat == heroSeat) {
          p.classList.add('hero');
        } else {
          p.classList.add('villain');
        }

        seat.appendChild(p);
      });
  }


  function turnCard() {

    let randomIndex;
    let card;
    do 
    {
      randomIndex = Math.floor(Math.random() * CARDS_NUMBER);
      card = cards[randomIndex];
    } 
    while (card == null);

    deck.push(card);
    cards[randomIndex] = null;

    return card;
  }

  function prepareDeck() {
    deck.splice(0, deck.length);
    cards.splice(0, cards.length);

    for (let i = 0; i < CARDS_NUMBER; i++) {
      cards.push(i);    
    }
  }

  function placeBlinds() {

   let sbPos, bbPos;
   players.forEach(p => {
     if (p.seat == dealerPosition && p.seat < players.length - 1) {
       sbPos = p.seat+1;
       bbPos = p.seat+2;
       return false;
     } else if (p.seat == dealerPosition && p.seat < players.length) {
      sbPos = p.seat+1;
      bbPos = 1;
      return false;
     } else if (p.seat == dealerPosition && p.seat == players.length) {
       sbPos = 1;
      bbPos = 2;
      return false;
     }
   });

   let sbPlayer = players.find(p => p.seat == sbPos);
   bet(sbPlayer, BIG_BLIND_SIZE / 2);

   let bbPlayer = players.find(p => p.seat == bbPos);
   bet(bbPlayer, BIG_BLIND_SIZE);

   currentPlayer = bbPos == players.length ? 1 : bbPos+1;
  }

  function bet(player, amount) {    
    let betSize = Math.min(player.stack, amount);
    player.stack -= betSize;
    potSize += betSize;
  }

  function distributeCards() {

    for(let i = 1; i <= 2; i++) {
      players.forEach((player, index) => {
        const card = turnCard();
        player.cards.push(card);

        printCard(player, card);
      });
    }
  }

  function getCardElement(cardIndex) {
    const card = getCardDescriptionByIndex(cardIndex) ;
    const cardElement = document.createElement('div');
    cardElement.classList.add('card', ...card);
    return cardElement;
  }


  function printCard(player, cardIndex) {
    if (player.cards.includes(cardIndex)) {
      
      const playerElement = document.querySelector('.player.p'+player.seat + ' .player-cards');
      const cardElement = getCardElement(cardIndex);
      if (player.seat != heroSeat) {
        cardElement.classList.add('covered');
      }
      playerElement.appendChild(cardElement);
    }
  }

  function getCardDescriptionByIndex(cardIndex) {
    const seedIndex = Math.floor(cardIndex / (CARDS_NUMBER/4));
    const seed = SEEDS[seedIndex];

    const cardNumber = cardIndex % (CARDS_NUMBER/4);
    const cardNumberClass = CARDS_CLASSES[cardNumber];

    return [seed, cardNumberClass];
  }

  function showCards(playerIndex) {
    const playerCards = document.querySelectorAll('.player.p'+playerIndex + ' .card.covered');
    if (playerCards == null) return;

    playerCards.forEach(cardElement => {
      cardElement.classList.remove('covered');
    })

  }

  function flop() {
    addCardToBoard('flop'); 
  }

  function turn() {
    addCardToBoard('turn'); 
  }

  function river() {
    addCardToBoard('river'); 
  }

  function addCardToBoard(street) {
    let numIterations = street == 'flop' ? 3 : 1;

    const streetElement = document.querySelector('.' + street);

    // streetElement.querySelectorAll('.card.covered').forEach(element => {
    //   element.remove();
    // });

    for (let i = 0; i < numIterations; i++) {
      const cardIndex = turnCard();
      board.push(cardIndex);
      const cardElement = getCardElement(cardIndex);
      streetElement.appendChild(cardElement);
    }
  }

function containsEvery(arr, target) {
  return target.every(v => arr.includes(v));
}

function removeFirstFromArray(arr) {
  const tmpArr = [...arr];
  tmpArr.splice(0, 1);
  return tmpArr;
}