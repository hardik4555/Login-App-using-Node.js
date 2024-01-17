import React, { useState } from 'react';
import Login from './login';
function SignUp(props) {


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [profileImage, setprofileImage] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(true);


    const [signIn, setSignIn] = useState(false);

    function handleRoleChange(e) {
        setUser(e.target.value);
    }
    function nameChange(e) {
        setName(e.target.value);
    }
    function emailChange(e) {
        setEmail(e.target.value);
    }
    function passwordChange(e) {
        setPassword(e.target.value);
    }
    function profileImageChange(e) {
        setprofileImage(e.target.value);
    }
    function phoneChange(e) {
        setPhone(e.target.value);
    }
    function handleClick() {
        props.setType(!props.type);
    }

    async function handleSubmit(e) {
        //code to add the user in the database;
        e.preventDefault();
        const userData = {
            name: name,
            phoneNumber: phone,
            profileImage: profileImage,
            email: email,
            password: password,
            role: user === true ? 'user' : 'admin',
        }
        console.log(userData);
        try {
            const response = await fetch('http://localhost:4000/post', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status; ${response.status}`);
            }
            const data = await response.json();
            console.log("User added successfuly:", data);

            props.setType(true);
        } catch (error) {
            console.error('Error adding user:', error);
        }

    }

    var page = (<div className='container'><h2>Signup</h2>

        <form onSubmit={handleSubmit}>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required onChange={nameChange} value={name} />

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required onChange={emailChange} value={email} />

            <label for="phone">Phone:</label>
            <input type="tel" id="phone" name="phone" onChange={phoneChange} value={phone} />

            <label for="profileImage">Profile Image URL:</label>
            <input type="text" id="profileImage" name="profileImage" onChange={profileImageChange} value={profileImage} />

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required onChange={passwordChange} value={password} />

            <label htmlFor="role">Role:</label>
            <select id="role" name="role" onChange={handleRoleChange} value={user}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>

            <input type="submit" value="Signup" className='submit' />
        </form>
        <p>back to login <button onClick={handleClick}>Login</button></p>
    </div>)

    if (props.type === true) {
        if (signIn === true) page = <Login message="Signed In successfully!" />
        else page = <Login />
    }
    return page;
}

export default SignUp;