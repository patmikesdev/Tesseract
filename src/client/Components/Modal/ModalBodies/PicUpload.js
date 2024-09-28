/*global Holder */

import { Card, ButtonToolbar, ButtonGroup, Button, Image } from 'react-bootstrap';
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
const { Header, Body, Footer } = Card;

export default function PicModal({ customContent, setModalProps, layout, setConfirmed }) {
    const [src, setSrc] = useState(null)
    const preview = useRef(null)

    useLayoutEffect(() => {
        Holder.run({
            images: preview.current
        })
    }, [])

    useEffect(() => {
        preview.current.style.width = null;
        preview.current.style.height = null;
        setSrc(window.URL.createObjectURL(customContent.src))
    }, [])
    return (
        <Card>
            <Header className="text-center text-decoration-underline bgPrimary text-light">
                <i className={`fa fa-camera-retro me-3`}></i>
                Photo Confirmation
                <i className={`fa fa-user-check ms-3`}></i>
            </Header>
            <Body className="d-flex justify-content-center">
                <Image ref={preview} fluid rounded
                    src={src || `holder.js/200x200?text=Uploading...&theme=sky`}
                />
            </Body>
            <Footer className="p-0">
                <ButtonToolbar>
                    <ButtonGroup className="w-100 rounded-0 rounded-bottom" style={{ overflow: "hidden" }}>
                        <Button className="rounded-0" variant="secondary" onClick={() => { setModalProps({ showing: false });}}>Pick different Photo</Button>
                        <Button className="rounded-0" onClick={() => { setConfirmed(true); setModalProps({ showing: false });} }>Use This for Profile</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Footer>
        </Card>
    )
}