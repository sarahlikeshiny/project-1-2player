console.log('js is connected - woo');



$(() => {

//---------------global constants--------------------------
  // const words = ['cat', 'dog', 'horse', 'penguin', 'monkey'];
  const $userWord=$('#userword');
  const $displayWord =$('#word');
  const $inputText =$('#userguesses');
  const $incorrectGuess=$('.incorrect');
  const $winLose = $('#winlose');
  const $reset=$('#reset');
  const $picture = $('img');
  const $timedMode= $('#timed');
  const $showtimer = $('#timer');
  const $error =$('#error');
  const $sound =$('audio');
  let correctCharsSpace =[];
  const images = [
    'step-zero.png',
    'step-one.png',
    'step-two.png',
    'step-three.png',
    'step-four.png',
    'step-five.png',
    'step-six.png',
    'step-seven.png'
  ];
  let turns = 0;
  console.log('turns', turns);


// ------------New Game----------------------------
  $reset.on('click', function () {
    location.reload(true);
  });
//-------------listen for click to activate timed mode.-----------------
  $timedMode.on('click', startStopTimer);
  $timedMode.on('click', countDown);

//-------------message to player---------------------------------------------

  $error.text('player 1 enter your secret word');
  $incorrectGuess.text('player 2 enter your guesses');
  setTimeout(function(){
    $incorrectGuess.text('');
  }, 2000);



//--------------player enters word-------------------------------------------
//get word from box, make into underscores----------------------------------
  let currentWord = '';
  let correctChars = [];

  $userWord.on('keyup', function (e) {
    if (e.keyCode === 13) {
      currentWord = $userWord.val();
      $error.text();
      $userWord.hide();
      const underScores = currentWord.replace(/[a-z]/g, ' _');
      $displayWord.text(underScores);
      const underScoresNoWhite = underScores.replace(/\s/g, '');
      correctChars = underScoresNoWhite.split('');
      $error.text('');
    }
    return currentWord, correctChars;
  });


//--------------listen to text area for return keypress and grab letter-------
//if turns - 0 message player 2 make your guesses, if turns = 1, player 1 make your guess
  let userLetter = '';

  $inputText.on('keyup', function (e){
    if (e.keyCode === 13) {
      userLetter = $inputText.val();
    }
    return userLetter;
  });
//-----------listen for return keypress and run game functions----------
  $inputText.on('keyup', function (e) {
    if (e.keyCode === 13) {
      checkRepeat();
      checkMatch();
      winLose();
    }
  });


  let indices = [];
  let incorrectChars = [];

  // -------------Check if word contains guessed letter----------------
  function checkMatch (){
    for(let i=0; i<=correctChars.length; i++) {
      if (currentWord[i] === userLetter) {//check to see which index of the currentword the user letter is at.
        indices.push(i);//push the index into an array
        correctChars[i] = userLetter;
        $inputText.val('');//resets text box
        correctCharsSpace = correctChars.join(' ');//makes a string from the correctChars array, including any correct chars that have been added.
        $displayWord.text(correctCharsSpace);
      }
    }
    if (!currentWord.includes(userLetter)) {
      incorrectChars.push(userLetter);
      $incorrectGuess.text(incorrectChars);
      $inputText.val('');
    }
  }


// -----------------win lose condition--------------
//need to set up player 1 player 2 swap condition, and keep score.

  function winLose () {
    if (indices.length === currentWord.length) {
      console.log('turns', turns);
      $winLose.text('You Win!');
      $winLose.addClass('animated tada');
      setTimeout(function(){
        $error.text('');
        $winLose.text('');
      }, 2000);
      $inputText.attr('disabled', true);
      turns ++;
      incorrectChars=[];
      indices = [];
      console.log('turns', turns);
    } else {
      const image = `images/${images[incorrectChars.length]}`;
      $picture.attr('src', image);
      if(incorrectChars.length === 7) {
        $winLose.text('Sorry You Lose');
        $error.addClass('animated tada');
        $inputText.attr('disabled', true);
        incorrectChars=[];
        indices = [];
        turns ++;
      }
    }
    if (turns === 1) {
      $error.text('player 2 enter your secret word');
      $incorrectGuess.text('player 1 enter your guesses');
      setTimeout(function(){
        $incorrectGuess.text('');
      }, 2000);
      $userWord.show();
      $userWord.val('');
      $displayWord.text('');
      $inputText.attr('disabled', false);
      turns = 2;
    } if (turns > 2){
      $error.text('game over');
      turns = 0;
    }
  }

  //now need to keep score!

//---check for repeated letters
  function checkRepeat() {
    if ((correctChars.length > 1 || incorrectChars.length >1) && correctChars.includes(userLetter) || incorrectChars.includes(userLetter)){
      $error.text('that letter has already been guessed');
      setTimeout(function() {
        $error.fadeOut().empty();
      }, 2000);
    }
  }

// ------------------Timer----------------------------

  let timeRemaining = 35;
  let timerIsRunning = false;
  let timerId = null;

  function countDown() {
    if(timerIsRunning) {
      clearInterval(timerId);
      timerIsRunning = false;
    } else {
      timerId = setInterval(() => {
        timeRemaining--;
        $showtimer.text(timeRemaining);
        if(timeRemaining === 10){
          $showtimer.css('color', 'red');
          $sound.get(0).play();
        }
        if((timeRemaining === 0)|| (indices.length === currentWord.length)){
          clearInterval(timerId);
        }
      }, 1000);
      timerIsRunning = true;
    }
  }

  // ------------Speed mode function------------
  function startStopTimer (){
    console.log('startStopTimer');
    let i = 1;
    const timerId = setInterval(() => {
      $picture.attr('src', `images/${images[i]}`);

      if(i === 7) {
        clearInterval(timerId);
        $error.text('Game over!');
        $inputText.attr('disabled', true);
      }
      if (indices.length === currentWord.length) {
        clearInterval(timerId);
        $error.text('You Win');
        $error.addClass('animated tada');
        $inputText.attr('disabled', true);
        i = 0;
      }
      i++;
    }, 5000);
  }

});
