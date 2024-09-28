import { useLayoutEffect, useCallback, useState, useMemo } from 'react'
import useTheme from '#Hooks/Theme';

export default function useLayout(player) {
    const setTheme = useTheme(player);
    
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    
    const touchScreen = useMemo(() => {
        return !window.matchMedia('(hover: hover)').matches
    }, [dimensions])
    
    const landscape = useMemo(() => {
        return window.matchMedia('(orientation: landscape)').matches
    }, [dimensions])
    
    const deviceType = useMemo(() => {
        if (touchScreen) {
            if (landscape) {
                if(dimensions.height < 576) return 'mobile'
                else return 'tablet'
            }
            else {
                if (dimensions.width < 576) return 'mobile'
                else return 'tablet'
            }
        }
        else return 'desktop'
    }, [dimensions, landscape, touchScreen])

    const [split, setSplit] = useState(landscape && (deviceType !== 'mobile')
        ? true
        : false);
        
    useLayoutEffect(() => {
        landscape && (deviceType !== 'mobile')
            ? setSplit(true)
            : setSplit(false);
    }, [deviceType, landscape])

    const resizer = useCallback((e) => {
        console.log('Window resized, updating dimensions');
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }, [])

    // useLayoutEffect(() => {
    //     console.log({ dimensions, landscape, deviceType })
    // }, [dimensions])

    useLayoutEffect(() => {
        window.addEventListener('resize', resizer)
        return () => window.removeEventListener('resize', resizer)
    }, [resizer])

    return { setTheme, dimensions, landscape, deviceType, touchScreen, split };
}
