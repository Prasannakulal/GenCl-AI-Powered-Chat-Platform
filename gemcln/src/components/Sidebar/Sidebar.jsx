import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const { onSent, prevPrompts = [], setRecentPrompt } = useContext(Context); // Ensure prevPrompts has a default value

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    };

    return (
        <div className="sidebar">
            <div className="top">
                <img 
                    onClick={() => setExtended(prev => !prev)} 
                    className="menu" 
                    src={assets.menu_icon} 
                    alt="" 
                />
                <div className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended && <p>New chat</p>}
                </div>
                {extended && prevPrompts.length > 0 && (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {prevPrompts.map((item, index) => (
                            <div key={index} onClick={() => loadPrompt(item)} className="recent-entry">
                                <img src={assets.message_icon} alt="" />
                                <p>{item}...</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="" />
                    {extended && <p>Help</p>}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended && <p>Activity</p>}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="" />
                    {extended && <p>Setting</p>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
