import { Card } from 'react-bootstrap'
import './spinner.css'

const { Body } = Card; 

export default function mySpinner() {
    return (
        <Card className="w-100 bg-transparent border-0 p-5">
            <Body className="spinnerBody d-flex position-relative justify-content-center">
                <div className="spinner">
                    <div className="spinnerFace spinnerFront">
                        <i className="spinnerIcon fa fa-hourglass-half"></i>
                    </div>
                    <div className="spinnerFace spinnerBack">
                        <i className="spinnerIcon fa fa-hourglass-half"></i>
                    </div>
                    <div className="spinnerFace spinnerRightFace">
                        <i className="spinnerIcon fa fa-hourglass-half"></i>
                    </div>
                    <div className="spinnerFace spinnerLeftFace">
                        <i className="spinnerIcon fa fa-hourglass-half"></i>
                    </div>
                    <div className="spinnerFace spinnerTop">
                        <i className="spinnerIcon fa fa-spinner"></i>
                    </div>
                    <div className="spinnerFace spinnerBottom">
                        <i className="spinnerIcon fa fa-spinner"></i>
                    </div>
                </div>
            </Body>
        </Card>
    )
}