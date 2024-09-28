
//NOTE: THIS ANIMATED FEATURE IS MEANT TO BE MORE COMPLEX IN THE FUTURE, BUT NEEDS FURTHER REFINEMENT
import Logo from '#Img/logo3.png'
import brandStyles from './Brand.lazy.css'
import brandAnimation from './BrandAnimation.js'
import { useEffect } from 'react'

import { Card } from 'react-bootstrap'
const { Img, Body } = Card;

export default function Brand({split}) {
    
    useEffect(() => {
        brandStyles.use()
        brandAnimation()
        return () => brandStyles.unuse()
    }, [])

    return (
        <Card className="brand w-100" style={{ minHeight: '400px', marginTop : split ? '0' : '75px' }} >
            <Body className="d-flex justify-content-center">
                <div className="cubeParent1 mb-md-5">
                    <div className="cubeParent2">
                        <div className="cubeParent3">
                            <div className="cubeParent4">
                                <div className="face front"></div>
                                <div className="face back"></div>
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face leftFace"></div>
                                <div className="face rightFace"></div>
                                <div className="face2 front2"></div>
                                <div className="face2 back2"></div>
                                <div className="face2 top2"></div>
                                <div className="face2 bottom2"></div>
                                <div className="face2 leftFace2"></div>
                                <div className="face2 rightFace2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Body>
            <Img src={Logo} variant='bottom' className="align-self-center mt-5" style={{maxWidth: '450px', minWidth: '300px'}}></Img>
        </Card>
    )
}
