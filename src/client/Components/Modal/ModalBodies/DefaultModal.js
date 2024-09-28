import { Card, ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap'; 
import Spinner from '#Components/Spinner'
const { Header, Body, Footer, Text } = Card; 

export default function DefaultModal({ customContent, setModalProps, setDismiss, layout }) {
    const icon = customContent.icon || 'cubes'; 
    const heading = customContent.heading || 'Default Heading'; 
    const footing = customContent.footing|| 'Default Footing'; 
    const message = customContent.message;  
    return (
        <Card>
            <Header className="text-center text-decoration-underline bgPrimary text-light">
                <i className={`fa fa-${icon} me-3`}></i>
                {heading}
                <i className={`fa fa-${icon} ms-3`}></i>
            </Header>
            {message
                ? <Body style={{ minHeight: '150px' }} className={Array.isArray(message)
                    ? `d-flex flex-column justify-content-center align-items-center`
                    : `d-flex justify-content-center align-items-center`}>
                    <Text>{message}</Text>
                </Body>
                : <Body style={{ minHeight: '150px' }}>
                    <Spinner></Spinner>
                </Body>
            }
            <Footer className="text-center bgPrimary text-light" onClick={()=>setModalProps({showing: false})}>
                <i className={`fa fa-${icon} me-3`}></i>
                {footing}
                <i className={`fa fa-${icon} ms-3`}></i>
            </Footer>
        </Card>
    )
}