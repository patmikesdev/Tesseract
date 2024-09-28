import useAppContext from '#Context';
import { Row, Col, Container } from 'react-bootstrap'
import Brand from '#Components/Brand';
import { Outlet } from 'react-router-dom';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

export default function Threshold({ children }) {
    const { players } = useAppContext();

    //This component will be responsible for reading if player is defined or not, and when it's a promise, to throw it up to error boundary
    return <Outlet></Outlet>
}
