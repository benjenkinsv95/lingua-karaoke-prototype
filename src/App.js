import logo from './logo.svg';
import './App.css';
import paragraphs from './fortuna-paragraphs'
import useWindowDimensions from './useWindowDimensions';
import React, { useState } from 'react'
import ReactPlayer from 'react-player'


const lyricsStyles = {
  minWidth: '400px',
  fontSize: '1.5rem',
  padding: '1rem',
  overflowY: 'auto',
  position: 'relative',
  color: 'white',
  background: 'black'
}

const videoStyles = {
  width: '100%',
  minHeight: '400px',
  background: 'black'
}

function Lyrics ({ player, setPlaying }) {
  const handleClick = sentence => {
    const timestampSeconds =
  sentence.minutesTimestamp * 60 + sentence.secondsTimestamp

    console.log(player, timestampSeconds)
    player?.seekTo(timestampSeconds)
  }
  
  const paragraphElements = paragraphs.map((paragraph, index) => {
    const sentenceElements = paragraph.sentences.map((sentence, j) => <p id={sentence.id} key={j} onClick={() => handleClick(sentence)}><small>[{sentence.minutesTimestamp}:{sentence.secondsTimestamp.toString().padStart(2, '0')}]</small> {sentence.latinSentence} <br/><small style={{ color: 'cyan', fontWeight: '500' }}>{sentence.englishSentence}</small></p>)
    return <div key={index} style={{ borderBottom: '2px solid white'}}>{sentenceElements}</div>
  })

  return (
    <div style = { lyricsStyles }>
      {paragraphElements}
    </div>
  )
}

function Video ({ setPlayer, playing, setPlaying }) {
  
  const handleProgress = event => {
    const playedSeconds = Math.floor(event.playedSeconds)
    const sentences = []
    paragraphs.forEach(p => sentences.push(...p.sentences))

    const currentSentence = sentences.find(sentence => {
      const timestampSeconds = (sentence.minutesTimestamp * 60) + sentence.secondsTimestamp
      return timestampSeconds === playedSeconds
    })

    if (currentSentence) {
      console.log(currentSentence)
      document.getElementById(currentSentence
.id).scrollIntoView()
    }
  }
  return (
    <ReactPlayer width='100%' controls={true} height='100%' playing={playing} onPlay={isPlaying => setPlaying(isPlaying)} url='https://www.youtube.com/watch?v=00YI0OlQQ6s' onProgress={handleProgress}
    ref={player => setPlayer(player)} />
  )
}

function App() {
  const { width } = useWindowDimensions()

  const containerStyles = {
  display: 'flex',
  width: '100%',
  height: '100vh',
  flexDirection: width > 900 ? 'row' : 'column'
}

  const [player, setPlayer] = useState(null)
  const [playing, setPlaying] = useState(false)




  return (
    <div style={containerStyles}>
      <Video setPlayer={setPlayer} playing={playing} setPlaying={setPlaying} />
      <Lyrics player={player} setPlaying = { setPlaying }
 />
    </div>
  );
}

export default App;
