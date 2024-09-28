//started, really only copied code from v2, haven't incorporated changes from portfolio yet

import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import useAppContext from '#Context'
import { useNavigate, useLocation } from 'react-router-dom';
import './navbarStyles.css'
// import useFetch from '#Hooks/Fetch'

export default function AppNav() {
    let { players } = useAppContext()
    const { player, setPlayer } = players;
    const navigate = useNavigate();
    const location = useLocation();
    // const fetch = useFetch();
    return (
        <Navbar variant="dark" className="justify-content-between ps-3" >
            <Nav >
                <Navbar.Brand>
                    <i className="fa fa-cubes"></i>
                </Navbar.Brand>
                <LinkContainer to="/">
                    <Nav.Link>
                        {location.pathname === '/game'
                            ? 'Exit Game'
                            : 'Home'}
                    </Nav.Link>
                </LinkContainer>
                {player
                    ? <NavDropdown title="Options" id="OptionsDropdown">
                        <LinkContainer to="/editMyAccount">
                            <NavDropdown.Item className="d-flex justify-content-between"><span>Account</span><i className="fa fa-user-cog align-self-center ms-3" style={{ width: '1.5rem' }} /></NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/editMyProfile">
                            <NavDropdown.Item className="d-flex justify-content-between"><span>Edit Profile</span><i className="fa fa-dna align-self-center ms-3" style={{ width: '1.5rem' }} /></NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/searchUsers">
                            <NavDropdown.Item className="d-flex justify-content-between"><span>Search Users</span><i className="fa fa-users align-self-center ms-3" style={{ width: '1.5rem' }} /></NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    : null
                }
            </Nav>
            <Nav className="me-5">
                <LinkContainer to={player
                    ? "/"
                    : "/login"}>
                    <Nav.Link onClick={inOrOut(player, setPlayer, navigate)}>
                        {player
                            ? "Logout"
                            : "Login"}
                    </Nav.Link>
                </LinkContainer>
                <Navbar.Brand>
                    <i className="fa fa-sign-out-alt ms-3"></i>
                </Navbar.Brand>
            </Nav>
        </Navbar>
    )
    function inOrOut(player, setPlayer, navigate) {
        if (player) {
            return function (e) {
                fetch('/api/auth/logout')
                    .then((r) => {
                        setPlayer(null);
                        localStorage.clear()
                        navigate('/');
                    })
            }
        }
        else {
            return null
        }
    }
}