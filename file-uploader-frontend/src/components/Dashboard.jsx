import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import isAuthenticated from "../utils/isAuthenticated";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"
import '../App.css'

export default function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [openSidebar, setOpenSidebar] = useState(false);

    const [openMenuModal, setOpenMenuModal] = useState(false);

    const [createNewFolderModal, setCreateNewFolderModal] = useState(false);

    const [newFolder, setNewFolder] = useState('');

    const { userId } = useParams();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const today = new Date()
    const formattedDate = format(today, "MMMM do, EEEE"); // "MMMM" for full month name, "do" for day with ordinal, "EEEE" for full weekday name

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${backendUrl}/user/${userId}`);
                const data = await response.json();
                setUser(data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        }
        fetchUser();
    }, [])

    if (!isAuthenticated()) {
        navigate('/get-started');
    }

    const handleOpenSideBar = () => {
        setOpenSidebar(!openSidebar);
    }

    const handleCreateNewFolder = () => {
        setOpenMenuModal(false);
        setCreateNewFolderModal(true);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/get-started');
    }
    
    return (
        <div className="dashboard-container">
            {/* CREATE MENU MODAL (FOLDER OR UPLOAD FILE) */}
            {openMenuModal &&
                <div className="menu-overlay">
                    <div className="menu">
                        <div className="head">
                            <h2 className="text">Create</h2>
                            <i 
                            className="fa fa-times icon" 
                            aria-hidden="true" 
                            onClick={() => setOpenMenuModal(false)}>
                            </i>
                        </div>
                        <div className="options">
                        <div className="menu-item" onClick={handleCreateNewFolder}>
                            <i className="fa fa-folder" aria-hidden="true"></i>
                            <p className="text">Folder</p>
                        </div>
                        <hr />
                        <div className="menu-item">
                            <i className="fa fa-file" aria-hidden="true"></i>
                            <p className="text">File</p>
                        </div>
                        </div>
                    </div>
                </div>
            }

            {/* CREATE NEW FOLDER MODAL */}
            {
                createNewFolderModal &&
                <div className="menu-overlay">
                    <div className="menu">
                        <div className="head">
                            <h1 className="text">New Folder</h1>
                        </div>
                        <div className="form">
                            <input 
                                type="text" 
                                placeholder="New Folder Name" 
                                value={newFolder}
                                onChange={(e) => setNewFolder(e.target.value)}
                            />
                            <div className="btn-container">
                                <button className="btn2">Create</button>
                                <button className="btn2" onClick={() => setCreateNewFolderModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {loading ? <h1>Loading...</h1> : 
                <div className="user-container">
                    <aside className={openSidebar ? "sidebar open" : "sidebar"}>
                    { openSidebar ? <i 
                        className="fa fa-chevron-left icon" 
                        aria-hidden="true" 
                        onClick={handleOpenSideBar} >
                    </i> :
                        <i 
                        className="fa fa-chevron-right icon" 
                        aria-hidden="true" 
                        onClick={handleOpenSideBar} >
                    </i>
                    }
                        <div className="logo">
                            <img src="/cloud.png" alt="" />
                            <h1 className="text">Vaulty</h1>
                        </div>
                        <hr className="seperator"/>
                        <div className="sidebar-item" onClick={() => setOpenMenuModal(true)}>
                            <i class="fas fa-folder-plus"></i>
                            <p className="text">New</p>
                        </div>
                        <div className="sidebar-item logout" onClick={handleLogout}>
                            <i class="fa fa-sign-out" aria-hidden="true"></i>
                            <p className="text">Logout</p>
                        </div>
                    </aside>
                    <div className="display-box" style={openSidebar ? {width: "calc(100% - 250px)"} : {width: "calc(100% - 100px)"}}>
                        {/* <div className="row">
                            <div className="search-box">
                                <input 
                                    type="text"
                                    placeholder="search" 
                                />
                            </div>
                            <div className="user-info">
                                <h3>{user.email}</h3>
                            </div>
                        </div> */}
                        <div className="hero-section">
                            <div className="row">
                                <p>{formattedDate}</p>
                                <p>{user.email}</p>
                            </div>
                            <h2>Welcome Back <span>{user.userName}</span></h2>
                        </div>
                        <div className="user-files">
                            <h2>My Drive /</h2>
                        </div>
                    </div>
                </div>
                
            }
        </div>
    )
}