
import React, { useContext, useState } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'; 

const Main = () => {
    const [showDropdown, setShowDropdown] = useState(false)
    const { 
        onSent, 
        recentPrompt, 
        showResult, 
        loading, 
        resultData, 
        setInput, 
        input,
        selectedModel,
        setSelectedModel
    } = useContext(Context)

    const handleModelSelect = (model) => {
        setSelectedModel(model)
        setShowDropdown(false)
    }
    return (
        <div className="main">
            <div className="nav">
                <div className="nav-left" onClick={() => setShowDropdown(!showDropdown)}>
                    <p>GenCl ({selectedModel})</p>
                    <span className="dropdown-symbol">{showDropdown ? '▲' : '▼'}</span>
                </div>
                {showDropdown && (
                    <div className="dropdown-menu">
                        <p onClick={() => handleModelSelect('gemini')}>Gemini 1.5 pro</p>
                        <p onClick={() => handleModelSelect('deepseek')}>Deepseek</p>
                    </div>
                )}
                <img src={assets.profo} alt="" />
            </div>
        <div className="main-container">
            {!showResult
            ?<>
            <div className="greet">
                <p><span>Hello,Dev</span></p>
                <p>How may I assist you?</p>
            </div>
            <div className="cards">
                <div className="card">
                    <p>What makes Ladakh a preferred travel destination?</p>
                    <img src={assets.pro1} alt="" />
                </div>
                <div className="card">
                    <p>What are the top AI-powered apps for Indian users?</p>
                    <img src={assets.pro2} alt="" />
                </div>
                <div className="card">
                    <p>How is AI being used in Indian healthcare?</p>
                    <img src={assets.pro3} alt="" />
                </div>
                <div className="card">
                    <p>What are the top AI startups in India?</p>
                    <img src={assets.pro4} alt="" />
                </div>
            </div>
            </>:<div className='result'>
                <div className="result-tittle">
                    <img src={assets.profo} alt="" />
                    <p>{recentPrompt}</p>
                </div>
            <div className="result-data">
                <img src={assets.star} alt="" />
                {loading
                ?<div className='loader'>
                    <hr />
                    <hr />
                    <hr />
                </div>:<p dangerouslySetInnerHTML={{__html:resultData}}></p>}
                
            </div>

            </div>
           
            }
            
            <div className="main-bottom">
                <div className="search-box">
                    <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter text here'/>
                    <div>
                        <img src={assets.gallery_icon} alt="" />
                        <img src={assets.mic_icon} alt="" />
                        <img onClick={()=>onSent()} src={assets.send_icon} alt="" />
                    </div>
                </div>
                <p className="bottom-info">Gencl</p>
            </div>
        </div>
    </div>
  )
}

export default Main
