import { useReducer } from 'react'

const defaultModalProps = {
    bodyType: null,
    destination: null,
    showing: false,
    dialogClass: '',
    contentClass: '',
    size: null,
    customContent: {},
    callback: null,
    confirm: null,
    deny: null,
}

function modalReducer(oldProps, newProps) {
    if (!newProps) return { ...defaultModalProps }
    else return { ...oldProps, ...newProps }
}

export default function useModal() {
    const [modalProps, setModalProps] = useReducer(modalReducer, defaultModalProps);
    return { modalProps, setModalProps }; 
}