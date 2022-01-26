import axios from 'axios'
import React, { useEffect, useState } from 'react'
import TodoItem from './TodoItem'
import styled from 'styled-components'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import VoiceCommands from './VoiceCommands'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMicrophone, faMicrophoneSlash, faTimes, faExclamation} from '@fortawesome/free-solid-svg-icons'
import recordingGif from '../img/recording.gif'
import blankImg from '../img/blank.PNG'

//Speech to text configutarion
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

// Microphone settings
mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'


export default function TodoForm() {
    const currentDate = new Date()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const weekday = ["Sunday","Monday","Tuesday","Wednesday",
        "Thursday","Friday","Saturday"]
    const dateDay = `${monthNames[currentDate.getMonth()]}`;
    const dateMonth = `${currentDate.getDate()}`
    const dateYear = `${currentDate.getFullYear()}`
    const dateDayOfAWeek = weekday[currentDate.getDay()];
    const link = 'http://localhost:5000/api/v1/crud'
    const [todos, setTodos] = useState([])
    const [todoName, setTodoName] = useState('')
    const [todoComment, setTodoComment] = useState('')
    const [editTodoData, setEditTodoData] = useState(null)
    const [isListening, setIsListening] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [highPriorityMarked, setHighPriorityMarked] = useState(false)
  
    //Update list of todos
    useEffect(() => {
        getTodos();
    }, [])

 
    // Update edit 
    useEffect(() => {
       if (editTodoData) {
           setTodoName(editTodoData.name ? editTodoData.name: '')
           setTodoComment(editTodoData.comment? editTodoData.comment: '')
       }
    }, [editTodoData])

    // Update mic state
    useEffect(() => {
        handleListen()
      }, [isListening])

    // Get the notes from DB
    const getTodos = async () => {
        try {
            const data =  await axios.get(link)
             setTodos(data.data.crud)
   
        } catch (error) {
            console.error(error);
        }
    }

    //Update order of the todo
    const updateOrder = async (newTodos) => {

        var tempToDoList = new Array(newTodos.length);
        try {
            for (var i = 0; i < newTodos.length; i++) {
                tempToDoList[i] = newTodos[i]
                await axios.delete(`http://localhost:5000/api/v1/crud/${newTodos[i]._id}`) 
                await axios.post(link, tempToDoList[i])
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Reset the name and comment text area, maybe add use state for it
    const handleReset = () => {
        setTodoName('')
        setTodoComment('')
        setEditTodoData('')
        setHighPriorityMarked(false)
        setIsListening(false)
        setIsTyping(false)
    }

    //Edit notes
    const editTodos = (todosData) => { 
        setEditTodoData(todosData)
    }

    // Add new note
    const addTodos = async (e) => {
        e?.preventDefault()
        setIsListening(false)
        const todoData = {
            name: todoName ? todoName : 'Task #' + (todos.length + 1),
            comment: todoComment ? todoComment : '',
            isComplete: false,
            color: editTodoData? editTodoData.color : "#" + Math.random().toString(16).substr(-6),
            highPriority: highPriorityMarked? true : false
        }
        try {
            // Post a new note only if editTofoData is empty
            if (!editTodoData) {
                await axios.post(link, todoData)
            } else {
                // Update the data if we have the editTofoData
                await axios.patch(`http://localhost:5000/api/v1/crud/${editTodoData._id}`, todoData)
            }
            // Reset the name and comment text area
            handleReset()
            getTodos()
        } catch (error) {
            console.error(error);
        }
    }

    // Reorder the todos list after dragging and droping
    const reorder = (todos, startIndex, endIndex) => {
        // The values are swaped - the todos starts bottom to top and the divs as top to bottom
        const result = Array.from(todos)
        // const result = [...todos]
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result
    }

    // Save the new view of todos after dragging and droping
    const onDragEnd = async (result) => {
        const { source, destination } = result

        if (!result.destination) {
            return
        }
        const state = reorder(
            todos,
            source.index,
            destination.index
        );
        setTodos(state)
        await updateOrder(state)
    }

    const handlePriority = () => {
       setHighPriorityMarked(!highPriorityMarked)   
    }

    //  Speech to text handler
    const handleListen = () => {
        if (isListening) {
            mic.start()
            mic.onend = () => {
            console.log('continue..')
            mic.start()
            }
        } else {
            mic.stop()
            mic.onend = () => {
            console.log('Stopped Mic on Click')
            }
        }
        mic.onstart = () => {
            console.log('Mics on')
        }

        mic.onresult = event => {
            const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
            if (transcript.includes('bye') || transcript.includes('B') || transcript.includes('by') ) {
                setIsListening(false)
                setTodoComment(transcript.substring(0, transcript.lastIndexOf(" ")))
                setIsTyping(false)
                mic.stop() 
            }
            else {
                setTodoComment(transcript)
                setIsTyping(true)
            }
            mic.onerror = event => {
                console.log(event.error)
            }
        }
    }
    
    const insertTodos = () => {
        return <div className='textEditor'>
                    <div className="upper-banner">
                        <div className="date-container">
                            <span className='date-day'> {dateMonth}</span>
                            <span className='date-month'> {dateDay} </span>
                            <span className='date-year'> {dateYear} </span>
                            <span className='date-weekday'> {dateDayOfAWeek} </span>
                        </div>
                    </div>
                    <div className="recordContainer">
                        {/* <button className="listening-btn" onClick={() => setIsListening(prevState => !prevState)}>
                                {isListening ? <FontAwesomeIcon icon={faMicrophone}/> : <FontAwesomeIcon icon={faMicrophoneSlash}/>}
                        </button> */}
                        {/* <a className="listening-btn video-play-button play-video" href="#"
                            onClick={() => setIsListening(prevState => !prevState)}>
                             {isListening ? <FontAwesomeIcon icon={faMicrophone}/> : <FontAwesomeIcon className="notListening" icon={faMicrophoneSlash}/>}    
                        </a> */}
                        {/* <a className="listening-btn video-play-button play-video" href="#"
                            onClick={() => setIsListening(prevState => !prevState)}>
                             {isListening ? <FontAwesomeIcon icon={faMicrophone}/> : <FontAwesomeIcon className="notListening" icon={faMicrophoneSlash}/>}    
                        </a> */}
                        {isListening ?
                             <a className="listening-btn video-play-button" href="#"
                                onClick={() => setIsListening(prevState => !prevState)}>
                                <FontAwesomeIcon icon={faMicrophone}/>   
                            </a> :
                            <a className=" notListening" href="#"
                                onClick={() => setIsListening(prevState => !prevState)}>
                                <FontAwesomeIcon icon={faMicrophoneSlash}/>
                            </a>
                        }
                        {isListening ? <img className="recordingGif" src={recordingGif} alt="" /> : <img className="blankImg" src={blankImg} alt="" />}
                    </div>
                    <form onSubmit={addTodos}> 
                        <input className="priority-checkbox" onClick={handlePriority} checked={highPriorityMarked} type="checkbox"/>
                        <span className="priority-label" >  
                        <FontAwesomeIcon icon={faExclamation}/></span>
                        <div className="input-control">
                            <input type="text" id="name" placeholder='Enter name' required
                            value={todoName} onChange={(e) => setTodoName(e.target.value)} />
                        </div>
                        <div className="input-control">
                            <textarea name="text" id="comment" placeholder='Enter task'cols="30" rows="5" 
                            value={todoComment} onChange={(e) => {setTodoComment(e.target.value); setIsTyping(true)}}>
                            </textarea>
                        </div>
                       <div className='submitContainer'>
                            <button className="submit-btn"><FontAwesomeIcon icon={faPlus}/></button>
                       </div>

                        <VoiceCommands todos={todos} addTodos={addTodos} handleReset={handleReset} 
                    setIsListening={setIsListening} getTodos={getTodos} editTodos={editTodos} isTyping={isTyping}/> 
                        {/* <button className="clear-btn" onClick={handleReset}> 
                        <FontAwesomeIcon icon={faTimes}/></button> */}
                    </form>  
                  
            </div>  
    }


    const renderTodos = () => {
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"droppable"} type="DraggableItem" key="list">
                    {(provided, _) => ( 
                        <div 
                        ref={provided.innerRef}
                            {...provided.draggableProps} 
                            {...provided.dragHandleProps}> 
                                {todos.map((todo, i) => (
                                    <Draggable draggableId={"drag-" + i} index={i} key={i}> 
                                        {(provided, snapshot) => (  
                                            <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >   
                                            <TodoItem key={i} todo={todo} getTodos={getTodos} editTodos={editTodos}/>    
                                            </div>
                                        )}
                                    </Draggable>
                                ))}       
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }

    return (
            <TodoFormStyled>
                {insertTodos()}
                {renderTodos()}
            </TodoFormStyled>
    )
}

const TodoFormStyled = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .textEditor {
        padding-top: 4rem;
       
        .upper-banner {
            margin: -20% -82% 4% -58%;
            background-color: #5c6c6c;
            color: #eeebf0;
            width: 227.8%;
            height: 97px;
        }
        /* .date-container{
            padding-bottom: 4rem;
            position: relative;
            bottom: -1rem;
        } */
        .date-day {
            top: 1rem;
            font-size: 3rem;
            margin-right: .5rem;
            right: -17px;
            font-weight: bolder;
            margin-left: 1.5rem;
            position: relative;
        }
        .date-month {
            right: -2%;
            top:-4px;
            position:relative;
            font-weight: bolder;
        }
        .date-year {
            font-size: 1rem;
            top: 16px;
            left: -23px;
            position:relative;
        }
        .date-weekday {
            left: 1%;
            top: 8px;
            position: relative;
        }
        .priority-checkbox {
            position: relative;
            left: calc(100% - 552px);
            width: 15px;
            height: 15px;
            top: 2.1rem;
            box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
        }
        .faExclamation {
            font-size: 10rem;
        }
        .priority-label {
            position: relative;
            left: calc(100% - 589px);
            font-size: 1.2rem;
            top: 2.2rem;   
            color: #5c6c6c;        
        }
        .recordContainer {
            width: 220px;
            top: 0;
            left: -240px; 
        }
        .recordingGif {
            width: 344px;
            margin-left: 10%;
            margin-bottom: -24%;
            margin-top: 7%;
        }		
		.blankImg {
            width: 344px;
            margin-left: 10%;
            margin-bottom: -44%;
            margin-top: 7%;
        }	
        form {
            text-align: center;
            padding-bottom: 5rem;
            .submit-btn, .listening-btn, .clear-btn{
                width: 30px;
                height: 30px;
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
            .submit-btn {
                margin-left: 6px;
                margin-top: 0px;
                font-size: 19px;
            }
            .submitContainer {
                position: relative;
                top: -37px;
                z-index: 1;
                left: 8%;
                box-sizing: content-box;
                display: block;
                width: 4px;
                height: 11px;
                border-radius: 50%;
                padding: 18px 20px 18px 28px;
                background: white;
            }
            .submitContainer {
                top: -37px;
                left: -46%;
                align-items: center;
                appearance: none;
                background-color: #eeebf0;
                width: 4px;
                height: 11px;
                border-radius: 50%;
                border-style: none;
                box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
                box-sizing: content-box;
                color: #3c4043;
                cursor: pointer;
                display: inline-flex;
                fill: currentcolor;
                font-family: "Google Sans",Roboto,Arial,sans-serif;
                font-size: 14px;
                font-weight: 500;
                justify-content: center;
                letter-spacing: .25px;
                line-height: normal;
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
                z-index: 1;
            }

            .submitContainer:hover {
                background: #F6F9FE;
                color: #174ea6;
            }

            .submitContainer:active {
                box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
                outline: none;
            }

            .submitContainer:focus {
                outline: none;
                border: 2px solid #4285f4;
            }

            .submitContainer:not(:disabled) {
                box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
            }

            .submitContainer:not(:disabled):hover {
                box-shadow: rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px;
            }

            .submitContainer:not(:disabled):focus {
                box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
            }

            .clear-btn{
                position: relative;
                left: calc(100% - 239px);
                width: 20px;
                height: 20px;
                top: -10.4rem;
            }
        }
        .notListening {
            position: relative;
            top: 28px;
            z-index: 1;
            left: 67%;
            box-sizing: content-box;
            display: block;
            width: 32px;
            height: 44px;
            border-radius: 50%;
            padding: 18px 20px 18px 28px;
            background: #5c6c6c;
            box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
        }

        .fa-microphone-slash:hover {
                color: #F6F9FE;
            }

        .notListening:active {
            box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
            outline: none;
        }

        .notListening:focus {
            outline: none;
            border: 2px solid #4285f4;
        }

        .notListening:not(:disabled) {
            box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
        }

        .notListening:not(:disabled):hover {
            box-shadow: rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px;
        }

        .notListening:not(:disabled):focus {
            box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
        }

         .fa-microphone {
            font-size: 37px;
            z-index: 9;
            position: absolute;
            top: 90px;
            right: 26px;
            color: #eeebf0;
        } 
        .fa-microphone-slash {
            font-size: 37px;
            z-index: 9;
            position: absolute;
            top: 22px;
            right: 16px;
            color:#eeebf0;
        }
        .video-play-button {
            position: relative;
            bottom: 15%;
            left: 85%;
            -webkit-transform: translateX(-50%) translateY(-50%);
            -ms-transform: translateX(-50%) translateY(-50%);
            transform: translateX(-50%) translateY(-50%);
            box-sizing: content-box;
            display: block;
            width: 32px;
            height: 44px;
            border-radius: 50%;
            padding: 18px 20px 18px 28px;
        }

        .video-play-button:before {
            content: "";
                position: absolute;
                z-index: 0;
                left: 50%;
                top: 137%;
                transform: translateX(-50%) translateY(-50%);
                display: block;
                width: 80px;
                height: 80px;
                background: #ba1f24;
                border-radius: 50%;
                animation: pulse-border 1500ms ease-out infinite;
        }

        .video-play-button:after {
        content: "";
            position: absolute;
            z-index: 1;
            left: 50%;
            top: 137%;
            transform: translateX(-50%) translateY(-50%);
            display: block;
            width: 80px;
            height: 80px;
            background: #fa183d;
            border-radius: 50%;
            transition: all 200ms;
        }

        .video-play-button:hover:after {
            background-color: darken(#fa183d, 10%);
        }

        @keyframes pulse-border {
            0% {
                transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1.5);
                opacity: 0;
            }
        }
    }
`

// export default TodoForm
