import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import VoiceCommandToDigit from './VoiceCommandToDigit'
import styled from 'styled-components'
import axios from 'axios'
import {handleReset} from './TodoForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faTimes, faPauseCircle} from '@fortawesome/free-solid-svg-icons'


function VoiceCommands({todos, addTodos, handleReset, setIsListening, getTodos, editTodos, isTyping}) {
    const [isListeningCommands, setIsListeningCommands] = useState(false)
    const startCommands = ['hi', 'hey']
    const stopCommands = ['bye', 'by', 'Bye', '*by']
    const clearCommands = ['* clear', '*reset', '*recent', '*recess', 'Cleo']
    const addCommands = ['add', 'Ed']
    const editCommands = ['edit task *', 'edit ask *', 'edit that *', 
        'edit desk *', 'edit tasks *', 'edit best *', 'edit fast *', 'edit basc-*']
    const deleteCommands = ['delete task *', 'delete ask *', 'delete that *', 'basc-*', 
        'delete tasks *', 'delete desk *', 'delete best *', 'delete fast *', 'delete basc-*']
    const doneCommands = ['done task *', 'Don task *', 'Dan vasc *', 'dance task *',
        'dantesque *', 'done fast *', 'done that *', 'Don best *', 'Don basc-*', 'done desk *']


    useEffect(() => {
        handleListeningCommands();
    }, [isListeningCommands])

    const handleListeningCommands = () => {
        if (isListeningCommands)
            SpeechRecognition.startListening()
        else
            SpeechRecognition.stopListening()
    }

    const deleteVoiceCommand = async (orderNumber) => {
        //Check if the index exsits in the todo list
        if (orderNumber >= todos.length || !todos.length)
            return
        const toDoID = todos[VoiceCommandToDigit.get(orderNumber) - 1]._id
        if (!toDoID)
            return
        
        try {
            await axios.delete(`http://localhost:5000/api/v1/crud/${toDoID}`)
            getTodos() 
        } catch (error) {
            console.error(error);
          }
    }

    const editVoiceCommand = async (orderNumber) => {
        //Check if the index exsits in the todo list
        if (orderNumber >= todos.length || !todos.length)
            return

        const todo = todos[VoiceCommandToDigit.get(orderNumber) - 1]
        if (!todo._id)
            return

        editTodos(todo); 
    } 

    const completeStatusVoiceCommand = async (orderNumber) => {
        //Check if the index exsits in the todo list
        if (orderNumber >= todos.length || !todos.length)
            return
        const todo = todos[VoiceCommandToDigit.get(orderNumber) - 1]

        if (!todo._id)
            return

        todo.isComplete = !todo.isComplete
        try {
            await axios.patch(`http://localhost:5000/api/v1/crud/${todo._id}`, todo)
            getTodos()
        } catch (error) {
            console.error(error);
            }
    } 

    const resetText = () => {
        resetTranscript(transcript)
    }
    const commands = [
        {
            command: startCommands,
            callback: () => {setIsListening(true)} ,
            matchInterim: false
        },
        {
            command: stopCommands,
            callback: () => {setIsListening(false)} ,
            matchInterim: false
        },
        {
            command: addCommands,
            callback: () => {addTodos()} ,
            matchInterim: false
        },
        {
            command: clearCommands,
            callback: () => {handleReset()} ,
            matchInterim: false
        },
        {
            command: deleteCommands,
            callback: (orderNumber) => {deleteVoiceCommand(orderNumber)},
            matchInterim: false
        },
        {
            command: editCommands,
            callback: (orderNumber) => {editVoiceCommand(orderNumber)},
            matchInterim: false
        },
        {
            command: doneCommands,
            callback: (orderNumber) => {completeStatusVoiceCommand(orderNumber)},
            matchInterim: false
        }
    ]

    const {transcript, resetTranscript} = useSpeechRecognition( { commands }) 
    
    return (
        <SpeechRecognitionStyled>
            <div className="speechRecognition-container">
                {/* <p className='transcript'>{transcript}</p> */}
                {isListeningCommands ?                    
                    <button className="stop-btn" onClick={() => setIsListeningCommands(prevState => !prevState)}>
                        <FontAwesomeIcon icon={faPauseCircle}/> <span className='label-btn'> Stop Recording </span>
                    </button> :
                    <button className="play-btn" onClick={() => setIsListeningCommands(prevState => !prevState)}>
                        <FontAwesomeIcon icon={faPlay}/> <span  className='label-btn'> Start Recording</span>
                    </button> 
                }      
            </div>
            {isTyping ? <button className="clear-btn" onClick={() => {handleReset(); resetText()}}> <FontAwesomeIcon icon={faTimes}/></button>: null}
        </SpeechRecognitionStyled>
    )
}

const SpeechRecognitionStyled = styled.div`
    .speechRecognition-container {
        top: -23px;
        left: 7px;
        align-items: center;
        appearance: none;
        background-color: #eeebf0;
        border-radius: 24px;
        border-style: none;
        box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
        box-sizing: border-box;
        color: #3c4043;
        cursor: pointer;
        display: inline-flex;
        fill: currentcolor;
        font-family: "Google Sans",Roboto,Arial,sans-serif;
        font-size: 14px;
        font-weight: 500;
        height: 40px;
        justify-content: center;
        letter-spacing: .25px;
        line-height: normal;
        width: 156px;
        overflow: visible;
        padding: -22px 24px;
        position: relative;
        text-align: center;
        text-transform: none;
        transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1),opacity 15ms linear 30ms,transform 270ms cubic-bezier(0, 0, .2, 1) 0ms;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        will-change: transform,opacity;
        z-index: 0;
        }

        .label-btn {
            font-size: 13px !important;
            margin-left: 15px;
            margin-right: -9%;
        }

        .speechRecognition-container:hover {
        background: #F6F9FE;
        color: #174ea6;
        }

        .speechRecognition-container:active {
        box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
        outline: none;
        }

        .speechRecognition-container:focus {
        outline: none;
        border: 2px solid #4285f4;
        }

        .speechRecognition-container:not(:disabled) {
        box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
        }

        .speechRecognition-container:not(:disabled):hover {
        box-shadow: rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px;
        }

        .speechRecognition-container:not(:disabled):focus {
        box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
        }
    .transcript{
        margin-bottom: 80px;
        position: relative;

    }
    .clear-btn, .play-btn, .stop-btn{
        height: 30px;
        font-size: 14px;
        background: transparent;
        color: #5c6c6c;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        border: none;
        text-decoration: none;
        transition: background 0.2s;
        margin-right: 15px; 
    }
`

export default VoiceCommands
