import {createRoot} from 'react-dom/client';
import {lazy} from 'react'
import Superstructure from './Superstructure'
import Threshold from '#Components/Threshold';
import Landing from '#Pages/Landing';
import Login from '#Pages/Login';
import Arrival from '#Pages/Arrival';
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import './base.css'

const Register= lazy(() => import('#Pages/Register'))
const Infrastructure= lazy(() => import('#Components/Infrastructure')) //will be bundle of 'social media' related stuff

const root = createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Superstructure />}>
                <Route element={<Threshold />}>
                    <Route element={<Landing />}>
                        <Route index element={<Arrival />}></Route>
                        <Route path="login" element={<Login />}></Route>
                        <Route path="register" element={<Register />}></Route>
                    </Route>
                    <Route path="/*" element={<Infrastructure />}></Route>
                </Route>
                {/* <Route element={<Layout />}>
                    <Route element={<TwoColLayout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<LogIn />} />
                        <Route path="register" element={<Register />} />
                        <Route path="editMyProfile" element={<ProfileEditor id="hello" />} />
                        <Route path="editMyAccount" element={<AccountEditor id="accountForm" />} />
                    </Route>
                    <Route path=":userName" element={<AlternateProfile />} />
                    <Route path="searchUsers" element={<UserSearch />} />
                </Route>
                <Route path="game" element={<Game />} />
                <Route path="discovery" element={<Discovery />}/> */}
            </Route>
        </Routes>
    </BrowserRouter>
);
