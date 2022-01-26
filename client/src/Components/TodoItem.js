import React from 'react'
import styled from 'styled-components'
import editNote from '../img/edit.png'
import deleteNote from '../img/delete.png'
import exclamationMark from '../img/exclamation-mark.png'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck,faTrashAlt, faEdit, faExclamation } from '@fortawesome/free-solid-svg-icons'


function TodoItem({todo, getTodos, editTodos}) {
   
    // Delete Todo note
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/crud/${id}`)
            getTodos()
        } catch (error) {
            console.error(error);
          }
    }

    // Update marked note status as done 
    const completeTodo = async (id) => {
        const todoData = {
            isComplete: !todo.isComplete
        }
        try {
            await axios.patch(`http://localhost:5000/api/v1/crud/${id}`, todoData)
            getTodos()
        } catch (error) {
            console.error(error);
          }
    }
    
    return (
        <TodoItemStyled  
            onClick={() => completeTodo(todo?._id)}
            style={{
                backgroundColor: todo?.color}}>       
                <div key={todo?._id} className= {todo?.isComplete ? 'faCheckMarked' : 'faCheck'}>
                    <FontAwesomeIcon icon={faCheck} />
                </div>
                <div className= {todo?.highPriority &&  !todo?.isComplete? 'exclamationMark' : 'noPriority'}> 
                    {/* <img src={exclamationMark} alt=""/> */}
                    !
                </div>
                <div className= {todo?.isComplete ? 'text-con complete ' : 'text-con'}>
                <div className="left-text">
                    <p>{todo?.name}</p>
                </div>
                <div className="right-text">
                    <p>{todo?.comment}</p>
                </div>
                </div>
                {/* Event propogation for inner edit button to trigger isComplted of outer div of the todo */}
                <div className='edit' onClick={(event) => {
                    event.stopPropagation()
                    editTodos(todo)   
                }}>
                    <FontAwesomeIcon icon={faEdit}/>
                {/* <img src={editNote} alt=""/> */}
                </div>
                <div className="delete"  onClick={() => deleteTodo(todo?._id)}
                style={{
                    textDecoration: 'none'
                }}>
                    <FontAwesomeIcon icon={faTrashAlt}/>
                {/* <img src={deleteNote} alt=""/> */}
                </div>
           
        </TodoItemStyled>
    )
}

const TodoItemStyled = styled.div`
    padding: 1.5rem;
    margin: .1rem 0;
    width: 100%;
    float: center;
    border-radius: 17px;
    box-shadow: 0px 4px 12px rgba(0,0,0, 0.25);
    display: flex;
    justify-content: space-between;
    color: #eeebf0;
    &:last-child {
        margin: -2rem 1rem 3.5rem -0.2rem;
    }
    h3 {
        color: #5c6c6c;
    }
    img {
       width: 35px; 
       display: flex;
       align-items: center;
       justify-content: center;
       box-shadow: 0px 4px 12px rgba(0,0,0, 0.25);      
    }

    .exclamationMark {
        color: #fa183d;
        margin-left: 27px;
        font-size: 32px;
        font-weight: bold;
        animation: exclamationMark-pulse 1.4s infinite;
    }

    @keyframes exclamationMark-pulse {
        0% {
            transform: scale(0);
        }
        20% {
            transform: scale(0.2);
        }
        50% {
            transform: scale(1.2);
        }
        60% {
            transform: scale(0.65);
        }
        80% {
            transform: scale(0.2);
        }
        100% {
            transform: scale(0);
        }
    }
    .noPriority {
        display: none;
    }
    .notComplete {
        text-decoration: none;
    }
    .faCheck {
        display: none;
    }
    .faCheckMarked {
        color: #0b7c60;
        font-size: 30px;
        margin-left: 18px;
    }

    .text-con {
        flex: 3;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding: 0 2rem;
        .right-text {
            flex: 2;
            padding-left: 4rem;
        }       
    }
    .edit {
        margin-right: 1.2rem;
        text-decoration: none;
    }
    .delete {
        margin-right: 1.2rem;
    }
    .delete, .edit {
        font-size: 1.3rem;
        cursor: pointer; 
        margin-top: 1px;
    }
    .complete{
        text-decoration: line-through;
        opacity: 0.25;
    }
`

export default TodoItem

