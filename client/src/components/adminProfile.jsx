import React, { useState } from 'react';
import Login from './login'
import Update from './update';
function AdminProfile(props) {
    
    const [login, setLogin] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [update, setUpdate] = useState(false);



    async function handleDeleteAll() {

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        try {
            const response = await fetch('http://localhost:4000/deleteAll', {
                method: 'DELETE', // Use 'DELETE' as the HTTP method
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }

            const data = await response.json();
            console.log('All users deleted:', data.message);
            setDeleted(true);
        } catch (error) {
            console.error('Error deleting all users', error.message);
        }
    }

    function handleClick() {
        setLogin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

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
    //const imgTag="C:\Users\Hardik singh\OneDrive\Desktop\assignment bwi\client\public\final-image.jpg";
    const htmlContent = (
        <div className="welcome-container">
            <h1>Welcome, {props.username}!</h1>
            <img src={props.profileImage} alt="user-photo"></img>
            <p>Great to see you here. What would you like to do today?</p>
            <div className="buttons-container">
                <button className="update-button" onClick={handleUpdate}>Update Details</button>
                <button className="delete-button" onClick={handleDelete}>Delete account</button>
                <button className="delete-all-accounts" onClick={handleDeleteAll}>Delete All</button>
                <button className="logout-button" onClick={handleClick}>Logout</button>
            </div>
        </div>


    )

    if (deleted === true) {
        return <Login message="Account Deleted" />
    }
    else if (login === false) {
        return <Login message="You have been logged out!" />;
    }
    else if (update === true) {
        return <Update name={props.username} password={props.password} profileImage={props.profileImage} emailPhone={props.emailPhone} />;
    }


    return htmlContent;
}

export default AdminProfile;