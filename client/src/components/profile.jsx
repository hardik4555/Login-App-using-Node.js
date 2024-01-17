import React, { useState } from 'react';
import Login from './login'
import Update from './update';
function Profile(props) {

    // props.type=false;
    const [login, setLogin] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [update, setUpdate] = useState(false);

    function handleClick() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLogin(false);
    }

    async function handleUpdate() {
        setUpdate(true);
    }
    async function handleDelete() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const userData = {
            emailPhone: props.emailPhone
        }

        try {

            const response = await fetch('http://localhost:4000/delete', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status; ${response.status}`);
            }
            console.log("user deleted");
            // props.setType(true);
            setDeleted(true);
        } catch (error) {
            console.error("error deleting user", error.message);
        }
    }
    const htmlContent = (
        <div className="welcome-container">
            <h1>Welcome, {props.username}!</h1>
            <img src={props.profileImage} alt="account-image"></img>
            <p>Great to see you here. What would you like to do today?</p>
            <div className="buttons-container">
                <button className="update-button" onClick={handleUpdate}>Update Details</button>
                <button className="delete-button" onClick={handleDelete}>Delete account</button>

                <button className="logout-button" onClick={handleClick}>Logout</button>
            </div>
        </div>


    )
  
    const userData=JSON.parse(localStorage.getItem('user'));
    
    if (deleted === true) {
        return <Login message="Account Deleted" />
    }
    else if (login === false) {
        return <Login message="You have been logged out!" />;
    }
    else if (update === true) {
        return <Update name={userData.username} password={userData.password} profileImage={userData.profileImage} emailPhone={userData.emailPhone} />;
    }


    return htmlContent;
}

export default Profile;