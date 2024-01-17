import React, { useState, useEffect } from 'react';
import SignUp from './signup';
import Profile from './profile';
import AdminProfile from './adminProfile';
import axios from 'axios';
function Login(props) {

    const [type, setType] = useState(true);
    const [userCheck, setuserCheck] = useState(false);

    const [emailPhone, setemailPhone] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [profileImage, setprofileImage] = useState('');
    const [wrongPassword, setWrongPassword] = useState(false);
    const [user, setUser] = useState(true);

    const getUser = localStorage.getItem('user');

    function handleClick() {
        setType(!type);
    }

    const checkUser = async (emailPhone, password, user) => {
        const userData = {
            emailPhone: emailPhone,
            password: password,
            role: user === true ? 'user' : 'admin',
        };
    
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (!response.ok) {
                setWrongPassword(true);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("This is data",data);
    
            if (data.message === 'Login successful') {
                setuserCheck(true);
                setUsername(data.user.name);
                setprofileImage(data.user.profileImage);
                const userActive= {
                    username: data.user.name,
                    profileImage: data.user.profileImage,
                    emailPhone: data.user.email,
                    role: user === true ? 'user' : 'admin',
                }
                localStorage.setItem('user', JSON.stringify(userActive));
                localStorage.setItem('token', data.token);
            } else {
                setuserCheck(false);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        checkUser(emailPhone, password, user);
    };

    function handleRoleChange(e) {
        setUser(e.target.value);
    }
    function handleEmailPhone(event) {
        setemailPhone(event.target.value);
    }

    function handlePassword(event) {
        setPassword(event.target.value);
    }
    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token){
            
            const storedObject= JSON.parse(localStorage.getItem('user'));
            setemailPhone(storedObject.emailPhone);
            setPassword(storedObject.password);
            setUsername(storedObject.username);
            setprofileImage(storedObject.profileImage);
            storedObject.role==='user'?setUser(true): setUser(false);

            axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
            setuserCheck(true);
        }
        else
        {
            setuserCheck(false);
        }
    },[])
    useEffect(() => {
        if (userCheck === true) {
            console.log('User authenticated!');
        }
    }, [userCheck]);
    var message = "give your details to log in.";
    if (props.message) message = props.message;
    var page = (

        <div className="container"><h2>Login</h2>
            <p> {message}</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="emailPhone">Email/Phone:</label>
                <input type="text" id="emailPhone" name="emailPhone" required onChange={handleEmailPhone} value={emailPhone} />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required onChange={handlePassword} value={password} />

                <label htmlFor="role">Role:</label>
                <select id="role" name="role" onChange={handleRoleChange} value={user}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <input type="submit" value="Login" className="submit" />
            </form>
            <p>A new user? <button onClick={handleClick}>Sign up</button> </p>



        </div>
    )

    console.log("user is", userCheck);
    if (user === true) {
        if (userCheck === true) {
            console.log("password: ", password);
            page = <Profile username={username} password={password} emailPhone={emailPhone} profileImage={profileImage} type={type} setType={setType} />
        }
        else {
            if (type === false) {
                page = (
                    <SignUp type={type} setType={setType} />

                )
            }
            else {
                if (wrongPassword === true) {
                    page = (
                        <Login message="wrong credentials." />
                    )
                }
            }
        }
        return page;
    }

    else {
        if (userCheck === true) {
            page = <AdminProfile username={username} password={password} emailPhone={emailPhone} profileImage={profileImage} type={type} setType={setType} />
        }
        else {
            if (type === false) {
                page = (
                    <SignUp type={type} setType={setType} />

                )
            }
            else {
                if (wrongPassword === true) {
                    page = (
                        <Login message="wrong credentials." />
                    )
                }
            }
        }
        return page;
    }
}

export default Login;