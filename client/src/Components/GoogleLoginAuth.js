
import React, { useEffect, useState } from 'react'
import GoogleLogin from 'react-google-login'
import GoogleButton from 'react-google-button'
import styled from 'styled-components'
import googleIcon from '../img/google.png'


function GoogleLoginAuth() {
    const [googleUserName, setGoogleUserName] = useState(null)
    const [googleIsLogged, setGoogleIsLogged] = useState(false)


    //Update google login auth
    useEffect(() => {
       getUserName();
    }, [googleUserName])

    // Get the user's name and set it if is not undefined
    const responseGoogle = (response) => {
        const userName = response.profileObj.givenName
        if (userName) {
            setGoogleUserName(userName)
            setGoogleIsLogged(true)
        }
    }

    function getUserName() {
        if (googleUserName)
            console.log(googleUserName);
    }
    
    return (
        <GoogleLoginAuthStyle>    
            {console.log(googleIsLogged)}         
            <div> 
                { !googleIsLogged ? 
                    <GoogleLogin
                    clientId= '229839006272-e23qbenourdjlsqnr77npvi3c7ehjahg.apps.googleusercontent.com'
                    render={renderProps => (
                        // <GoogleButton className= {googleIsLogged ? 'LoggedIn' : 'googleLoginRequest'}
                        //     onClick={renderProps.onClick} disabled={renderProps.disabled} 
                        //     type="light"
                        //     style={{  }}>
                        // </GoogleButton>
                        <button className="google-btn" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                               <img className="google-Icon" src={googleIcon} alt="" style={{
                    textDecoration: 'none' }}/>
                        </button>
                      )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}/> : 
                    <div className='loggedIn'>
                        <span className="greeding">Hi, {googleUserName}!</span>
                    </div> }
                
            </div>
        </GoogleLoginAuthStyle>
    )
}
const GoogleLoginAuthStyle = styled.div` 
    .google-Icon {
        position: relative;
        width: 88%;
    }
    .google-btn {
        position: relative;
        top: 31px;
        left: -34px;
        background-color: #5c6c6c;
        border: none;
        cursor: pointer;
    }
    .loggedIn {
        font-size: 1.1rem;
        position: relative;
        top: 41px;
        left: -30px;
        color: #eeebf0;
    }
    .greeding {
        margin: -6rem;
    }
`




export default GoogleLoginAuth