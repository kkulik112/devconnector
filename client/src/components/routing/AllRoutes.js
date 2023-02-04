import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Login from '../auth/Login'
import Register from '../auth/Register'
import Alert from '../layout/Alert'
import Dashboard from '../dashboard/Dashboard'
import CreateProfile from '../profile-forms/CreateProfile'
import EditProfile from '../profile-forms/EditProfile'
import Profiles from '../profiles/Profiles'
import Profile from '../profile/Profile'
import Post from '../post/Post'
import Posts from '../posts/Posts'
import AddExperience from '../profile-forms/AddExperience'
import AddEducation from '../profile-forms/AddEducation'
import NotFound from '../layout/NotFound'
import PrivateRoute from './PrivateRoute'

const AllRoutes = () => {
    return (
        <section className='container'>
          <Alert />
          <Routes>
            <Route exact path='login' element={<Login/>}/>
            <Route exact path='register' element={<Register/>} />
            <Route exact path='profiles' element={<Profiles/>} />
            <Route exact path='profile/:id' element={<Profile/>} />
            <Route
            path="dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />
            <Route
            path="create-profile"
            element={<PrivateRoute component={CreateProfile} />}
          />
            <Route
            path="edit-profile"
            element={<PrivateRoute component={EditProfile} />}
          />
            <Route
            path="add-experience"
            element={<PrivateRoute component={AddExperience} />}
          />
            <Route
            path="add-education"
            element={<PrivateRoute component={AddEducation} />}
          />
            <Route
            path="posts"
            element={<PrivateRoute component={Posts} />}
          />
            <Route
            path="posts/:id"
            element={<PrivateRoute component={Post} />}
          />
          <Route path={'/*'} element={<NotFound />} />
          </Routes>
        </section>
    )
}

export default AllRoutes