import React , { useState , useEffect } from 'react';

import { Link , NavLink } from 'react-router-dom';
import menus from '../../pages/menu';

import { ethers } from 'ethers'
import './styles.scss';
import logo from '../../assets/images/logo/logo.png'

let currentAccount = null;

const Header = () => {

    const [WalletAddress, setWalletAddress] = useState(null)
    async function changingAccount() {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => {
                window.sessionStorage.removeItem('Account');
                requestAccount()
                window.location.reload();
                requestAccount()
            })
        }
    }

    useEffect(() => {
        changingAccount()
    }, [WalletAddress])

    async function requestAccount() {
        console.log('Requesting account...')
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })
            currentAccount = accounts[0]
            setWalletAddress(accounts[0])
            sessionStorage.setItem('Account', currentAccount)
            console.log("current account " + currentAccount)
            var btnConnect = document.getElementById('connect-btn')
            let lengthAcc = currentAccount.length
            btnConnect.value = currentAccount
            btnConnect.innerText =
                currentAccount.substring(0, 4) + '...' + currentAccount.substring(lengthAcc - 4, lengthAcc)
        } catch (error) {
            console.log('error connecting')
        }
        //Check if Metamask Exist
        if (window.ethereum) {
            console.log('detected')
        } else {
            console.log('not detected')
        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            console.log('Wallet connected successfully!')
        } else {
            console.log('Please install an injected Web3 wallet')
        }
    }

    const [scroll, setScroll] = useState(false);
        useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 300);
        });
        return () => {
            setScroll({});
        }
    }, []);

    const [menuActive, setMenuActive] = useState(null);

    const handleMenuActive = () => {
        setMenuActive(!menuActive);
      };

    
    const [activeIndex, setActiveIndex] = useState(null);
    const handleDropdown = index => {
        setActiveIndex(index); 
    };

    return (
        <header id="header_main" className={`header ${scroll ? 'is-fixed' : ''}`}>
            <div className="container">
                <div id="site-header-inner">
                    <div className="header__logo">
                        <NavLink to="/"><img src={logo} alt="Crybox" /></NavLink>
                    </div>
                    <nav id="main-nav" className={`main-nav ${menuActive ? 'active' : ''}`} >
                        <ul id="menu-primary-menu" className="menu">

                            {
                                menus.map((data,idx) => (
                                    <li key={idx} onClick={()=> handleDropdown(idx)} className={`menu-item ${data.namesub ? 'menu-item-has-children' : ''} ${activeIndex === idx ? 'active' : ''}`} 
                                    
                                    >
                                        <Link to={data.links}>{data.name}</Link>
                                        {
                                            data.namesub &&
                                            <ul className="sub-menu">
                                                {
                                                    data.namesub.map((submenu) => (
                                                        <li key={submenu.id} className="menu-item"><NavLink to={submenu.links}>{submenu.sub}</NavLink></li>
                                                    ))
                                                }
                                            </ul>
                                        }
                                        
                                    </li>
                                ))
                            }
                        </ul>
                    </nav>
                    
                    <button className="tf-button btn-effect" onClick={connectWallet}>
                        <span className="boder-fade"></span>
                        <span className="effect" id="connect-btn">Connect Wallet</span>
                    </button>

                    <div className={`mobile-button ${menuActive ? 'active' : ''}`} onClick={handleMenuActive}><span></span></div>
                </div>
            </div>
        </header>
    );
}

export default Header;