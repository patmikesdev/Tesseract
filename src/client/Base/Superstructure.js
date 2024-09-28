import { useRef, useInsertionEffect, Suspense } from 'react';
import { Context } from '#Context';
import { useLocation } from 'react-router-dom';
// import Spinner from '#Spinner'
import { Outlet } from 'react-router-dom';
import Boundary from '#Components/Boundary'
import Modal from '#Components/Modal'
import Navbar from '#Components/Navbar'
import Background from '#Components/Background'
// import FlashMsgModal from '#FlashMsgModal'

export default function App() {
    const location = useLocation();
    const mainBox = useRef(null);

    useInsertionEffect(() => {
        if (mainBox.current) mainBox.current.scrollTo(0, 0);
    }, [location]);

    return (
        <Context>
            <Navbar></Navbar>
            <Background></Background>
            <main ref={mainBox} id="mainBox" style={{ position: 'relative', top: '8vh', height: '92vh', overflow: 'auto', }}>
                <Boundary>
                    <Outlet />
                </Boundary>
            </main>
            <Modal></Modal>
        </Context>
    );
}
