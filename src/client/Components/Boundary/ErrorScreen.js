import { LinkContainer } from 'react-router-bootstrap'
import { Button } from 'react-bootstrap'

export default function ErrorScreen({ trigger = () => { }, text }) {
    return (
        <div className="w-100" >
            <h1>This is why we can't have nice things!</h1>
            <h3>{text}</h3>
            <LinkContainer to="/" >
                <Button className="px-5" onClick={trigger}>
                    <i className="fa fa-home me-3"></i>
                    Go Home
                </Button>
            </LinkContainer>
        </ div>
    )
}