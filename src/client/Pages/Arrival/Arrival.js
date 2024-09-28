import { LinkContainer } from 'react-router-bootstrap'
import { Button } from 'react-bootstrap'

export default function Arrival() {
    return (
        <div className="w-100 mt-5" >
            <LinkContainer to="infra" >
                <Button className="w-100 mb-3">
                    <i className="fa fa-sign-in-alt me-3"></i>
                    Log In
                </Button>
            </LinkContainer>
            <LinkContainer to="register" >
                <Button className="w-100 mb-3">
                    <i className="fa fa-user-plus me-3"></i>
                    Sign Up
                </Button>
            </LinkContainer>
        </ div>
    )
}