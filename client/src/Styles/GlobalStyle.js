import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Vollkorn&display=swap');
    *{
        margin: 0;
        padding: 0;
        box-sizing: 0;
        font-family: 'Vollkorn', serif;      
        font-size: 1.1rem;
    }

    body {
        background-color: #f2f2f2;

    }
    input[type="text"]::-webkit-input-placeholder {
          color: #6D6D6D;
          opacity: .65;
    }
    textarea::-webkit-input-placeholder {
          color: #6D6D6D;
          opacity: .65;
    }
`

export default GlobalStyle