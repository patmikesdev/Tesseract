import { Component, Suspense} from 'react'
import Spinner from '#Components/Spinner'
import ErrorScreen from './ErrorScreen'
//NOTE, in dev mode, still renders the React error screen over the top of what gets rendered by the Error boundary

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {error};
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error)
    }

    render() {
        const { error } = this.state; 
        const { children } = this.props; 
        if (error) {
            // You can render any custom fallback UI
            return <ErrorScreen text={error.message} trigger={()=>this.setState({error: false})}></ErrorScreen>
        }
        return children;
    }
}

export default function Boundary({ children, status }) {
    return (
        <ErrorBoundary>
            <Suspense fallback={Spinner()}>
                {/* {status && status()} */}
                {children}
            </Suspense>
        </ErrorBoundary>
    )
}