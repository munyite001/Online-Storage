import { Link } from "react-router-dom";
export default function Nav() {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src="/cloud.png" alt="" />
                <h1>Vaulty</h1>
            </div>
            <div className="auth">
                <Link to="/get-started">
                    <button className="btn">Get Started</button>
                </Link>
            </div>
        </nav>
    );
}