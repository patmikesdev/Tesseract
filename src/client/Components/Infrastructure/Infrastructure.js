import Discovery from '#Components/Discovery'
import { Routes, Route } from 'react-router-dom';
// import Register from '#Pages/Register'
import Wall from '#Components/Wall'

//crucial detail was to use Routes as a wrapper around these nested Route Elements
function Infrastructure() {
    return (
        <Routes>
            <Route path="infra" element={<Discovery />}></Route>
            <Route path="test2" element={<Wall />}></Route>
        </Routes>
    )
}

// Infrastructure.name = Infrastructure; 

export default Infrastructure; 

