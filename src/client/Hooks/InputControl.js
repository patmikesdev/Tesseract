import {useState} from 'react'

export default function useControlledInput(initialValue) {
    const [value, setValue] = useState(initialValue); 
    return [
        { value, onChange: (e) => setValue(e.target.value) }, 
        ()=> setValue(initialValue)
    ]
}