import {Fragment} from 'react'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css';

const App = () => 
  <Router>
    <Fragment>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Landing/>} />
      </Routes>
      <section className='container'>
        <Routes>
          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/register' element={<Register/>} />
        </Routes>
      </section>
    </Fragment>
  </Router>

export default App;
