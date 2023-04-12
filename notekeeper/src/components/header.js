import HighlightIcon from '@mui/icons-material/Highlight';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import Login from './Login';
import Register from './Register';
import NotePage from './Notepage';
function Header() {
  return (

    <BrowserRouter forceRefresh={true}>
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link to="/" style={{ "textDecoration": "none" }}><h1><HighlightIcon />Keeper</h1></Link>
            <div className="ml-5">
              <Link to="/note" style={{ "textDecoration": "none" }}>
                <button className="ButtonBase-root Button-root Button-text">Note</button>
              </Link>
              <Link to="/login" style={{ "textDecoration": "none" }}>
                <button className="ButtonBase-root Button-root Button-text" >Login</button>
              </Link>
              <Link to="/register" style={{ "textDecoration": "none" }}>
                <button className="ButtonBase-root Button-root Button-text">Register</button>
              </Link>

            </div>
          </div>
        </nav>
      </header>
      <Switch>
        <Route exact path="/">
        <div className='container home'><h1 className='regis-header'>Welcome to Keepernote!</h1></div>
        </Route>
        <Route path="/note">
          <NotePage></NotePage>
        </Route>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/register">
          <Register></Register>
        </Route>
      </Switch>
    </BrowserRouter>

  );
}
export default Header;
