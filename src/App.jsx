import {useState, useEffect, useRef} from 'react'
import emptyPotion from '../assets/images/emptyPotion.png';
import useSound from 'use-sound';
import simon from '../assets/sounds/simon.mp3';
import './App.css';

export default function App (){

  const blueRef = useRef(null);
  const yellowRef = useRef(null);
  const greenRef = useRef(null);
  const redRef = useRef(null);

  const colors = [
    {
      color:'#FAF303',
      ref: yellowRef,
      sound: 'one',
      imgSrc: emptyPotion,
    },
    {
      color:'#030afa',
      ref: blueRef,
      sound: 'two',
      imgSrc: emptyPotion,
    },
    {
      color:'#FA0E03',
      ref: redRef,
      sound: 'three',
      imgSrc: emptyPotion,
    },
    {
      color:'#0AFA03',
      ref: greenRef,
      sound: 'four',
      imgSrc: emptyPotion,
    },
  ];

  const minNumber = 0;
  const maxNumber = 3;
  const speedGame = 400;

  const [play] = useSound(simon, {
    sprite: {
      one: [0, 500],
      two: [1000, 500],
      three: [2000, 500],
      four: [3000, 500],
      error: [4000, 1000]
    },
  });

  const [sequence, setSequence] = useState([]);
  const [currentGame, setCurrentGame] = useState([]);
  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
  const [speed, setSpeed] = useState(speedGame);
  const [turn, setTurn] = useState(0);
  const [pulses, setPulses] = useState(0);
  const [success, setSuccess] = useState(0);
  const [isGameOn, setIsGameOn] = useState(false);

  ////////////////////////////////////////
  const handleClick = (index) => {
    if(isAllowedToPlay) {
      play({id:colors[index].sound})
      colors[index].ref.current.style.opacity = (1);
      colors[index].ref.current.style.scale = (0.9);
      setTimeout(() => {
        colors[index].ref.current.style.opacity = (0.5);
        colors[index].ref.current.style.scale = (1);
        setCurrentGame([...currentGame, index]);
        setPulses(pulses + 1);
      }, speed / 2)
    }
  }

  ////////////////////////////////////////
  useEffect(() => {
    if(pulses > 0) {
      if(Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])){
        setSuccess(success + 1);
      } else {
        const index = sequence[pulses - 1]
        if (index) colors[index].ref.current.style.opacity = (1);
        play({id: 'error'})
        setTimeout(() => {
          if (index) colors[index].ref.current.style.opacity = (0.5);
          setIsGameOn(false);
        }, speed * 2)
      setIsAllowedToPlay(false);
      }
    }
  }, [pulses])

  ////////////////////////////////////////
  useEffect(() => {
    if(!isGameOn) {
      setSequence([]);
      setCurrentGame([]);
      setIsAllowedToPlay(false);
      setSpeed(speedGame);
      setSuccess(0);
      setPulses(0);
      setTurn(0);
    }
  }, [isGameOn])

  ///////////////////////////////////////
  useEffect(() => {
    if(success === sequence.length && success > 0) {
      setSpeed(speed - sequence.length * 2);
      setTimeout(() => {
        setSuccess(0);
        setPulses(0);
        setCurrentGame([])
        randomNumber();
      }, 500)
    }
  }, [success])

  ////////////////////////////////////
  const initGame = () => {
    randomNumber();
    setIsGameOn(true);
  }

  ////////////////////////////////////
  const randomNumber = () => {
    setIsAllowedToPlay(false);
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
    setSequence([...sequence, randomNumber]);
    setTurn(turn + 1);
  }

  ////////////////////////////////////
  useEffect(() => {
    if(!isAllowedToPlay) {
      sequence.map((item, index) => {
        setTimeout(() => {
          play({id:colors[item].sound})
          colors[item].ref.current.style.opacity = (1);
          setTimeout(() => {
            colors[item].ref.current.style.opacity = (0.5);
          }, speed / 2)
        }, speed * index)
      })
    }
    setIsAllowedToPlay(true);
  }, [sequence])

  /////////////////////////////////////////////

  return (
    <>
      {isGameOn ? (
        <>
          <div className="center-container">
            <div className="header">
              <h1>Turn {turn}</h1>
            </div>

            <div className="container">
              {colors.map((item, index) => (
                <div
                  key={index}
                  ref={item.ref}
                  className="potion"
                  onClick={() => handleClick(index)}
                >
                  <img src={item.imgSrc} alt={`Potion ${index}`} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="header">
            <h1>SIMON'S POTIONS</h1>
          </div>
          <button onClick={initGame}>START</button>
        </>
      )}
    </>
  );
  
  



}
