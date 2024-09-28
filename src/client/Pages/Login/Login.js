import {useCallback} from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap'
import useAppContext from '#Context';
import useControlledInput from '#Hooks/InputControl'
const { Group, Control, Label, } = Form


export default function LogIn() {
    const { modal } = useAppContext()
    const { setModalProps } = modal; 
    const login = 'Need to pull from context later'
    const navigate = useNavigate()
    let [emailProps, resetEmail] = useControlledInput('')
    let [pwProps, resetPw] = useControlledInput('')

    const handler = useCallback((e) => {
        e.preventDefault();
        // login(emailProps.value, pwProps.value, reset, success)
        setModalProps({
            showing: true,
            size: 'xl',
            dialogClass: 'loginModal'
        })
        function reset() {
            resetEmail();
            resetPw();
        }
        function success() {
            navigate('/')
        }
    }, [login])

    return (
        <div className="w-100 mt-5">
            <Form id="form1">
                <Group controlId="emailField" className="mb-3">
                    <Label className="text-light">
                        Email address
                        <i className="fa fa-paper-plane ms-3"></i>
                    </Label>
                    <Control type="email" placeholder="Enter email" name="email" {...emailProps} />
                </Group>
                <Group controlId="password" className="mb-5">
                    <Label className="text-light">
                        Password
                        <i className="fa fa-lock ms-3"></i>
                    </Label>
                    <Control type="password" placeholder="Enter password" name="password" {...pwProps} />
                </Group>
                <Button type="submit" id="first" onClick={handler} className="w-100">
                    <i className="fa fa-door-open me-3"></i>
                    Login
                </Button>
            </Form>
        </div>
    )
}