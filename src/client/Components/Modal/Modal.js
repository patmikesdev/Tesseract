import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react';
import useAppContext from '#Context'
import './modalStyles.css'
import Modals from './ModalBodies/AllModals.js'
const { DefaultModal, PicUpload } = Modals;


export default function FlashMsgModal() {
    const { modal, layout} = useAppContext();
    const { modalProps, setModalProps } = modal; 
    let { showing, bodyType, destination, size, dialogClass, contentClass, customContent, callback, confirm, deny } = modalProps;
    
    // const [dismiss, setDismiss] = useState(() => { });
    const [confirmed, setConfirmed] = useState(false)
    const navigate = useNavigate();
    const Body = useMemo(() => {
        switch (bodyType) {
        case 'PicUpload':
            return PicUpload; 
        default:
            return DefaultModal;
        }
    }, [bodyType])

    return (
        <Modal backdrop="static" show={showing} size={size} dialogClassName={dialogClass} contentClassName={contentClass} centered={true}
            onHide={() => setModalProps({ showing: false })}
            // onExiting={dismiss}
            onExited={() => {
                callback && callback(); //generic callback regardless of confirm/deny
                confirmed
                    ? confirm()
                    : deny && deny(); 
                destination && navigate(destination);
                setModalProps(false);
                setConfirmed(false);
                // setDismiss(() => { });
            }} >
            <Body {...{ customContent, setModalProps, layout, setConfirmed }}></Body>
        </Modal>
    )

}