// original code from Ch 8, p 172 of Learning React, by Alex Banks and Eve Porcello
//customized to help enable demonstrating multiple users w/ sessions, manipulating cookie values
import  useAppContext from '#Context'
import { useState, useEffect, useCallback } from "react";

export default function useFetch() {
    const { cookie } = usePlayerContext(); //for demonstration purposes only
    const customFetch = useCallback((url, options) => {
        console.log(cookie);
        if (cookie) document.cookie = cookie; //alternative might be to set header manually, worried it might get overwritten though
        return fetch(url, options)
    }, [cookie])
    return customFetch;
}


// original code from Ch 8, p 172 of Learning React, by Alex Banks and Eve Porcello

// import { useState, useEffect } from "react";

// export function useFetch(url) {
//     const [data, setData] = useState();
//     const [error, setError] = useState();
//     const [loading, setLoading] = useState(true);
//     useEffect(() => {
//         if (!url) return;
//         fetch(url)
//             .then(data => data.json())
//             .then(setData)
//             .then(() => setLoading(false))
//             .catch(setError);
//     }, [url]);
//     return {
//         loading,
//         data,
//         error
//     }
// }