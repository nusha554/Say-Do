
import styled from 'styled-components'
import TodoForm from './Components/TodoForm'
import GoogleLoginAuth from './Components/GoogleLoginAuth'


function App() {
  return (
    <AppStyled>

      <div className="content-container">
        {/* <div className="logo-container">
          <h1 className='logo'> Say & Do</h1>
        </div> */}
        <TodoForm/>
        <GoogleLoginAuth/>
      </div>
    </AppStyled>
  )
}

const AppStyled = styled.div`
  background-color: #a4a4ac;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .logo-container {
    position: relative;
    left: 40%;
    white-space:nowrap;

  }
  .logo {
    font-size: 5vh;
  }
  .content-container {
    background-color: #eeebf0;
    width: 40%;
    height: 80vh;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    box-shadow: 10px 12px 20px rgba(0,0,0, .2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: scroll;
    align-items: flex-start;
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px grey;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
          background: linear-gradient(179.75deg, #5c6c6c -12.26%,  #5c6c6c 55.88%);
          border-radius: 10px;
    }
    form {
      input, textarea {
        width: 100%;
        padding: .4rem 1rem;
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        border-radius: 15px;
        filter:  drop-sh3adow(0px 4px 24px rgba(0, 0, 0, 0.25));
        margin: .4rem 0;
        background-color: #F6F9FE;
        color: #656464;
        
      }
    }
  }
`
export default App
