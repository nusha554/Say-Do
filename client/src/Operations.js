
import React, {Component} from 'react';
import axios from 'axios'
import getTodos from './TodoForm'

// Delete Todo note
export const deleteTodo = async (id) => {
     
            await axios.delete(`http://localhost:5000/api/v1/crud/${id}`)
            getTodos() 

    }

export default deleteTodo