import React, { useState, useEffect } from 'react';
// import SignUp from './signup';
import Profile from './profile';
function Update(props) {

    const [name, setName] = useState(props.name);
    const [profileImage, setprofileImage] = useState(props.profileImage);
    const [password, setPassword] = useState();
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const[ role, setRole]=useState("user");
    const [emailPhone, setemailPhone]=useState(props.emailPhone);
    useEffect(() => {
        setUpdateSuccess(false);
        const userData=JSON.parse(localStorage.getItem('user'));
        setRole(userData.role);
        setemailPhone(userData.emailPhone);
        localStorage.removeItem('user');
    }, []);
    function nameChange(e) {
        setName(e.target.value);
    }
    function profileImageChange(e) {
        setprofileImage(e.target.value);
    }
    function passwordChange(e) {
        setPassword(e.target.value);
    }
    useEffect(() => {
        if (updateSuccess === true) {
            console.log('details updated');
            const newData = {
                emailPhone: emailPhone,
                username: name,
                profileImage: profileImage,
                role: role
            }
            localStorage.setItem('user', JSON.stringify(newData));

        }
    }, [updateSuccess]);
    async function handleSubmit(e) {
        e.preventDefault();
        const userData = {
            emailPhone: emailPhone,
            name: name,
            profileImage: profileImage,
            password: password,
        }
        console.log("This is user Data", userData);
        try {
            
            const response = await fetch('http://localhost:4000/update',
                {
                    method: 'put',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                })

            if (!response.ok) {
                console.log("Error updating user details")
            }
            else {
                setUpdateSuccess(true)
            };
            console.log(response);
        } catch (error) {
            console.error("error.message")
        }
    }
    const updatePage = (
        <div className='container'><h2>Update details</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required onChange={nameChange} value={name} />

                <label htmlFor="profileImage">Profile Image URL:</label>
                <input type="text" id="profileImage" name="profileImage" onChange={profileImageChange} value={profileImage} />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required onChange={passwordChange} value={password} />

                <input type="submit" value="Update" className='submit' />
            </form>
        </div>
    )


    if (updateSuccess === true) {
        return <Profile username={name} profileImage={profileImage} password={password} emailPhone={props.emailPhone} />
    }
    return updatePage;
}

export default Update;