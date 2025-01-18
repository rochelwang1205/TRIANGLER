import { Link } from "react-router-dom";
import { RiShoppingBag4Line } from "react-icons/ri";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Login } from "./Login";
import { useState } from "react";
export default function Navbar() {  
    const [showLogin, setShowLogin] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setShowLogin(true);
    }
    return (
    <>
        <nav className="navbar sticky-top navbar-expand-lg" 
        style={{     
            backgroundColor: '#F9F8FC',
            borderBottom: '3px solid #2F1769'
        }}>
            <div className="container">
                <div className="navbar-brand" >Navbar</div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item mr-4">
                            <Link className="nav-link"  to="/">首頁</Link>
                        </li>
                        <li className="nav-item mr-4">
                            <Link className="nav-link" to="/explore">尋找課程</Link>
                        </li>
                        <li className="nav-item mr-4">
                            <Link className="nav-link" to="/FAQ">FAQ</Link>
                        </li>
                        <li className="nav-item mr-4">
                            <Link className="nav-link" to="/about">關於</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">聯絡我們</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className="mr-3"><RiShoppingBag4Line size={20} color="#000"/></div>
                   <div onClick={handleLogin}><MdOutlineAccountCircle size={20} color="#000"/></div>
                </div>
            </div>
        </nav>
        <Login show={showLogin} onClose={() => setShowLogin(false)} />
    </>
    );
}