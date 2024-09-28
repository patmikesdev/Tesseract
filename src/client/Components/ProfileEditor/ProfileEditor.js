/*global Holder */

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Form, Card, Row, Col, Image, } from 'react-bootstrap'
// import { uploadTrigger, inputTrigger } from '../Modals/PicModal/PicModal.js'
import useAppContext from '#Context'
import useControlledInput from '#Hooks/InputControl'
import './editFormStyle.css'

const { Group, Control, Label, Check, } = Form
const { Header, Footer } = Card


export default function ProfileForm({ id, submitHandler, newUser, children }) {
    const { players, layout, modal } = useAppContext()
    const { player } = players; 
    const { setModalProps } = modal; 
    const { setTheme } = layout; 
    const hiddenPicInput = useRef(null)
    const picPreview = useRef(null)
    const [imageSrc, setImageSrc] = useState(false)
    // const [image, setImage] = useState(false)

    //NEED TO ADD VALUES FOR ACCOUNT STUFF TOO
    //FOR CONTROLLED FORM COMPONENTS, encapsulated value and onChange props with custom hook that employed useState
    let [nameProps, resetName] = useControlledInput(player ? player.name : '')
    let [dobProps, resetDob] = useControlledInput(player ? new Date(player.profile.dob).toISOString().slice(0, 10) : '')
    let [studyProps, resetStudy] = useControlledInput(player ? player.profile.field : '')
    let [locationProps, resetLocation] = useControlledInput(player ? player.profile.location : '')
    let [genderProps, resetGender] = useControlledInput(player ? player.profile.gender : '')
    let [themeProps, resetTheme] = useControlledInput(player ? player.profile.theme : '')
    let [nobel, setNobel] = useState(player ? player.profile.nobel : false)
    let [accoladeProps, resetAccolades] = useControlledInput(player ? (player.profile.accolades || '') : '') //was getting warning from react when initially state of accolades was null
    let [bioProps, resetBio] = useControlledInput(player ? player.profile.bio : '')

    //HELPER FUNCTIONS
    const uploadTrigger = useCallback(() => {
        hiddenPicInput.current.dispatchEvent(new MouseEvent('click', { detail: 0 }))    
    }, [hiddenPicInput.current])

    const inputTrigger = useCallback((evt) => {
        setModalProps({
            showing: true,
            bodyType: 'PicUpload',
            customContent: {
                src : evt.target.files[0]
            },
            size: 'lg',
            confirm: () => {
                //remove previously imposed dimensions from holder
                picPreview.current.style.width = null;
                picPreview.current.style.height = null;
                setImageSrc(window.URL.createObjectURL(evt.target.files[0])); 
            },
            deny: () => {
                //need to reset files
                hiddenPicInput.current.files = (new DataTransfer()).files;
                uploadTrigger(); 
            },
            
        })
    }, [uploadTrigger])

    useEffect(() => {
        if (!player) {
            Holder.run({
                images: picPreview.current
            })
        }
    }, [])


    return (
        <>
            <Card className="w-100 my-5">
                <Header className="text-center text-decoration-underline bgPrimary text-light">
                    {!player ? "New " : ''} User Profile
                    <i className="fa fa-dna ms-3"></i>
                </Header>
                <Form method="POST" id={id} className="m-3" onSubmit={submitHandler}>
                    {/*ONLY DISPLAY HERE IF REGISTERING A NEW ACCOUNT  */}
                    {newUser ?
                        <>
                            <h5 className="text-center"><i className="fa fa-id-card me-3 mb-2"></i>Account Info</h5>
                            <Group controlId='email' className="mb-3">
                                <Label>
                                    <i className="fa fa-at me-3"></i>
                                    Email Address
                                </Label>
                                <Control type="email" name="email" placeholder="(We'll never share your email.)"></Control>
                            </Group>
                            <Group controlId='password' className="mb-3">
                                <Label>
                                    <i className="fa fa-lock me-3"></i>
                                    Password
                                </Label>
                                <Control type="password" name="password" placeholder="Please choose a secure password"></Control>
                            </Group>
                            <Group controlId='userName'>
                                <Label>
                                    <i className="fa fa-user-circle me-3"></i>
                                    Username
                                </Label>
                                <Control type="text" name="userName" placeholder="Please choose a unique username"></Control>
                            </Group>
                            <hr className="mt-4 mx-3" />
                        </>
                        : <></>
                    }
                    {newUser ?
                        <h5 className="text-center"><i className="fa fa-clipboard-list me-3 mb-1"></i>Profile Info</h5> :
                        <></>
                    }

                    <Group controlId="name">
                        <Label>Name</Label>
                        <Control type="text" name='name' placeholder='First and Last name?' {...nameProps}></Control>
                    </Group>
                    <hr />
                    <Group controlId="pic">
                        <Row>
                            <Col xs={7}>
                                <Label>Profile Picture</Label> <br />
                                <Control type="file" name='pic' className="d-none" ref={hiddenPicInput} onInput={inputTrigger}></Control>
                                <Button className="profilePicBtn" type="button" variant="success" onClick={uploadTrigger}>
                                    <i className="fa fa-camera-retro me-3"></i>
                                    Choose Picture
                                </Button>
                            </Col>
                            <Col xs={5} className="d-flex justify-content-center" id="picWrapper" style={{ borderLeft: '1px solid #05497730'}} >
                                <Image ref={picPreview} fluid id="profilePreview" rounded style={{ maxHeight: '100px' }}
                                    src={imageSrc || (player
                                        ? `data:image/${player.profile.picFileExt};base64,${player.profile.pic}`
                                        : `holder.js/66x100?text=Upload Your Photo&theme=sky`)
                                    }
                                />
                            </Col>
                        </Row>

                    </Group>
                    <hr />
                    <Group controlId="dob">
                        <Label>
                            <i className="fa fa-calendar-alt me-3"></i>
                            Date of Birth
                        </Label>
                        <Control type="date" name='dob' {...dobProps}></Control>
                    </Group>
                    <hr />
                    <Group controlId="location">
                        <Label>
                            <i className="fa fa-map-marked-alt me-3"></i>
                            Location
                        </Label>
                        <Control type="text" name='location' placeholder="Describe Location" {...locationProps}></Control>
                    </Group>
                    <hr />
                    <Group controlId="study">
                        <Label>
                            <i className="fa fa-book-reader me-3"></i>
                            Field of Study
                        </Label>
                        <Control type="text" name='field' placeholder='Describe Field' {...studyProps}></Control>
                    </Group>
                    <hr />
                    <Group /*controlId="gender" className="mb-3*"*/>
                        <Label className="d-inline-block me-2">Gender</Label><Form.Text>(optional)</Form.Text><br />
                        <Check inline type="radio" name='gender' label="Female" value="Female" checked={genderProps.value === "Female"} onChange={genderProps.onChange}></Check>
                        <i className="fa fa-venus me-4"></i>
                        <Check inline type="radio" name='gender' label="Male" value="Male" checked={genderProps.value === "Male"} onChange={genderProps.onChange}></Check>
                        <i className="fa fa-mars me-4"></i>
                        <Check inline type="radio" name='gender' label="Non-binary" value="Non-binary" checked={genderProps.value === "Non-binary"} onChange={genderProps.onChange}></Check>
                        <i className="fa fa-transgender"></i>
                    </Group>
                    <hr />
                    <Group className="container-fluid">
                        <Label className="d-inline-block me-2">
                            <i className="fa fa-palette me-3"></i>
                            Theme
                        </Label>
                        <Form.Text>(Color Preference)</Form.Text><br />
                        <Row className="mb-1 p-1 border border-dark rounded preferDefault">
                            <Col className="text-light">
                                <Check inline type="radio" name='theme' label="Default" value="default" checked={themeProps.value === "default"}
                                    onChange={(e) => {
                                        themeProps.onChange(e);
                                        setTheme('default')
                                    }}></Check>
                                <i className="fa fa-paint-roller"></i>
                            </Col>
                        </Row>
                        <Row className="mb-1 p-1 border border-dark rounded preferViolet">
                            <Col className="text-light">
                                <Check inline type="radio" name='theme' label="Violet" value="violet" checked={themeProps.value === "violet"}
                                    onChange={(e) => {
                                        themeProps.onChange(e);
                                        setTheme('violet')
                                    }}></Check>
                                <i className="fa fa-paint-roller"></i>
                            </Col>
                        </Row>
                        <Row className="mb-1 p-1 border border-dark rounded preferGreen">
                            <Col className="text-light">
                                <Check inline type="radio" name='theme' label="Green" value="green" checked={themeProps.value === "green"}
                                    onChange={(e) => {
                                        themeProps.onChange(e);
                                        setTheme('green')
                                    }}></Check>
                                <i className="fa fa-paint-roller"></i>
                            </Col>
                        </Row>
                        <Row className="mb-1 p-1 border border-dark rounded preferCharcoal">
                            <Col className="text-light">
                                <Check inline type="radio" name='theme' label="Charcoal" value="charcoal" checked={themeProps.value === "charcoal"}
                                    onChange={(e) => {
                                        themeProps.onChange(e);
                                        setTheme('charcoal')
                                    }}></Check>
                                <i className="fa fa-paint-roller"></i>
                            </Col>
                        </Row>
                    </Group>
                    <hr />
                    <Group controlId="nobel">
                        <Label className="d-inline-block me-2">
                            <i className="fa fa-trophy me-3"></i>
                            Have you ever won a Nobel Prize?
                        </Label><br />
                        <Check inline type="switch" name='nobel' label="Nobel Winner" checked={nobel} onChange={() => setNobel(!nobel)}></Check>
                    </Group>
                    <hr />
                    <Group controlId="accolades">
                        <Label className="d-inline-block me-2">
                            <i className="fa fa-medal me-3"></i>
                            Please list any other noteworthy awards you've won.
                        </Label><br />
                        <Control type="text" name='accolades' label="Nobel Winner" {...accoladeProps}></Control>
                    </Group>
                    <hr />
                    <Group controlId="bio" className="mb-2">
                        <Label>
                            <i className="fa fa-feather-alt me-3"></i>
                            Profile Biography
                        </Label>
                        <Control as="textarea" name='bio' placeholder='How would you describe yourself to other players?' {...bioProps}></Control>
                    </Group>
                </Form>
                {/* <PicModal {...{ showing, imageSrc, setImage, setShowing, setImageSrc, inputTrigger }}></PicModal> */}
                <Footer className="p-0">
                    <Button form={id} className="w-100 rounded-0 rounded-bottom" variant="success" type="submit">
                        Submit
                    </Button>
                </Footer>
            </Card>
            {children}
        </>
    )
}

