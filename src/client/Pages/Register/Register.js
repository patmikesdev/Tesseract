import ProfileEditor from '#Components/ProfileEditor'

const tempProps = {
    newUser: true,
    id: 'registrationForm',
    submitHandler: () => { },
}
export default function Register() {

    return (
        <ProfileEditor {...tempProps}></ProfileEditor>
    )

}