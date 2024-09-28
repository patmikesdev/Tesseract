import useAppContext from '#Components/Context';
import {useEffect} from 'react';

export default function Discovery() {
    const { layout, location } = useAppContext();
    
    useEffect(() => {
        console.log(location)
    }, [])
    
    // throw new Error('Discovered an Error')

    return <h1>Discovery of Lazy Loading!!</h1>;
}
