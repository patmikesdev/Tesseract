import useAppContext from '#Context';
import { Row, Col, Container } from 'react-bootstrap'
import Brand from '#Components/Brand';
import Boundary from '#Components/Boundary';
import { Outlet } from 'react-router-dom';

export default function Landing() {
    const { layout} = useAppContext();
    const { split } = layout;

    if (split) {
        return (
            <Container fluid className="h-100">
                <Row className="h-100">
                    <Col xs={{ span: 5 }} className="d-flex justify-content-center" style={{height: '92vh', transform: "translate(0px)", position: 'fixed'}}>
                        <div className="d-flex justify-content-center align-items-center w-100">
                            <Brand split={split}></Brand>
                        </div>
                    </Col>
                    <Col xs={{ span: 6, offset: 5 }} className="d-flex flex-column justify-content-center" >
                        <Boundary>
                            <Outlet></Outlet>
                        </Boundary>
                    </Col>
                </Row>
            </Container>
        )
    }
    else {
        return (
            <>
                <Brand split={split}></Brand>
                <div className="d-flex flex-column justify-content-center px-5" >
                    <Boundary>
                        <Outlet></Outlet>
                    </Boundary>
                </div>
            </>
        )
    }
}