import {Fragment, useEffect} from 'react'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import AllRoutes from './components/routing/AllRoutes'
import setAuthToken from './utils/setAuthToken'
import { loadUser } from './actions/auth'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
// Redux
import {Provider} from 'react-redux'
import store from './store'

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App = () => {
  
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  
  return (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Landing/>} />
          <Route exact path='/*' element={<AllRoutes/>} />
        </Routes>
      </Fragment>
    </Router>
  </Provider>
  )
}

export default App;
