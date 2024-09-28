import {useReducer, useLayoutEffect, useCallback} from 'react';
import defaultTheme from '../Styles/defaultTheme.lazy.css';
import greenTheme from '../Styles/greenTheme.lazy.css';
import violetTheme from '../Styles/violetTheme.lazy.css';
import charcoalTheme from '../Styles/charcoalTheme.lazy.css';
const themes = {
    default: defaultTheme,
    green: greenTheme,
    violet: violetTheme,
    charcoal: charcoalTheme,
};

export default function useThemes(player) {
    const themeReducer = useCallback((oldTheme, newThemeName) => {
        let newTheme = themes[newThemeName];
        oldTheme.unuse();
        newTheme.use();
        return newTheme;
    }, []);

    const [theme, setTheme] = useReducer(themeReducer, themes['default']);

    //version using lazy loading of .lazy.css, with use/unuse
    useLayoutEffect(() => {
        if (player && !(player instanceof Promise)) {
            setTheme(player.profile.theme);
        } else {
            setTheme('default');
        }
    }, [player]);

    return setTheme;
}
