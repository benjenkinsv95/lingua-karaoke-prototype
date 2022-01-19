import logo from './logo.svg'
import './App.css'
import paragraphs from './fortuna-paragraphs'
import useWindowDimensions from './useWindowDimensions'
import React, { useState } from 'react'
import ReactPlayer from 'react-player'

const allSentences = []
paragraphs.forEach(p => allSentences.push(...p.sentences))

function clamp (num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

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

function Lyrics ({ player, selectedSentence }) {
  const handleClick = sentence => {
    const timestampSeconds =
      sentence.minutesTimestamp * 60 + sentence.secondsTimestamp

    console.log(player, timestampSeconds)
    player?.seekTo(timestampSeconds)
    
  }

  const paragraphElements = paragraphs.map((paragraph, index) => {
    const sentenceElements = paragraph.sentences.map((sentence, j) => (
      <p
        id={sentence.id}
        key={j}
        onClick={() => handleClick(sentence)}
        style={{
          background: sentence.id === selectedSentence?.id ? 'gray' : 'black'
        }}
      >
        <small>
          [{sentence.minutesTimestamp}:
          {sentence.secondsTimestamp.toString().padStart(2, '0')}]
        </small>{' '}
        {sentence.latinSentence} <br />
        <small style={{ color: 'cyan', fontWeight: '500' }}>
          {sentence.englishSentence}
        </small>
      </p>
    ))
    return (
      <div key={index} style={{ borderBottom: '2px solid white' }}>
        {sentenceElements}
      </div>
    )
  })

  return <>{paragraphElements}</>
}

function Sidebar ({ setStartMinutes, setEndMinutes, setStartSeconds, setEndSeconds, startMinutes, endMinutes, startSeconds, endSeconds, ...props }) {
  return (
    <div style={lyricsStyles}>
      {/* <label>Start Minutes</label>
      <input value={startMinutes} onChange={event => setStartMinutes(parseInt(event.target.value))} />
      <label>Seconds</label>
      <input value={startSeconds} onChange={event => setStartSeconds(parseInt(event.target.value))}  />

      <label>End Minutes</label>
      <input value={endMinutes} onChange={event => setEndMinutes(parseInt(event.target.value))} />
      <label>Seconds</label>
      <input value={endSeconds} onChange={event => setEndSeconds(parseInt(event.target.value)
)} /> */}
      <Lyrics {...props} />
    </div>
  )
}

function Video ({ setPlayer, playing, setPlaying, setSelectedSentence, startSeconds, startMinutes, endMinutes, endSeconds, player }) {
  const handleProgress = event => {
    const playedSeconds = Math.floor(event.playedSeconds)

    const currentSentence = allSentences.find(sentence => {
      const timestampSeconds =
        sentence.minutesTimestamp * 60 + sentence.secondsTimestamp
      return timestampSeconds === playedSeconds
    })

    if (currentSentence) {
      console.log(currentSentence)
      const index = allSentences.findIndex(s => s.id === currentSentence.id)
      const closerIndex = Math.max(index - 3, 0)
      const closerSentence = allSentences[closerIndex]

      setSelectedSentence(currentSentence)
      document.getElementById(closerSentence.id).scrollIntoView()
    }

    const startTimestampSeconds = startMinutes * 60 + startSeconds
    const endTimestampSeconds = endMinutes * 60 + endSeconds
    console.log(startTimestampSeconds, endTimestampSeconds, playedSeconds, startMinutes, startSeconds)
    if (playedSeconds >= endTimestampSeconds && startTimestampSeconds < endTimestampSeconds && endTimestampSeconds !== 0) {
      // player?.seekTo(startTimestampSeconds)
      // setPlaying(true)
    }
  }
  const id =
    new URLSearchParams(window.location.search).get('id') || '00YI0OlQQ6s'

  return (
    <ReactPlayer
      width='100%'
      controls={true}
      height='100%'
      playing={playing}
      onPlay={isPlaying => setPlaying(isPlaying)}
      loop={true}
      url={`https://www.youtube.com/watch?v=${id}`}
      onProgress={handleProgress}
      ref={player => setPlayer(player)}
    />
  )
}

function App () {
  const { width } = useWindowDimensions()

  const containerStyles = {
    display: 'flex',
    width: '100%',
    height: '100vh',
    flexDirection: width > 900 ? 'row' : 'column'
  }

  const [player, setPlayer] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [selectedSentence, setSelectedSentence] = useState(null)

  const [startMinutes, setStartMinutes] = useState(0)
  const [endMinutes, setEndMinutes] = useState(0)
  const [startSeconds, setStartSeconds] = useState(0)
  const [endSeconds, setEndSeconds] = useState(0)

  return (
    <div style={containerStyles}>
      <Video
        setPlayer={setPlayer}
        playing={playing}
        setPlaying={setPlaying}
        setSelectedSentence={setSelectedSentence}
        player={player}
        startMinutes = { startMinutes }
        endMinutes = { endMinutes }
        startSeconds = { startSeconds }
        endSeconds = { endSeconds }

      />
      <Sidebar
        player={player}
        setPlaying={setPlaying}
        selectedSentence={selectedSentence}
        startMinutes={startMinutes}
        endMinutes={endMinutes}
        startSeconds = { startSeconds }
        endSeconds = { endSeconds }
        setStartMinutes = { setStartMinutes }
        setEndMinutes = { setEndMinutes }
        setStartSeconds = { setStartSeconds }
        setEndSeconds = { setEndSeconds }
      />
    </div>
  )
}

export default App
