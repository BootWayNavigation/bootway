'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const links = [
    {
        title: 'Company Website',
        url: 'https://bootway.in',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm87.63,96H175.8c-1.54-29.7-11.32-57.55-27.58-78.61A88.22,88.22,0,0,1,215.63,120ZM144,128a199.91,199.91,0,0,1-3.83,40H115.83A199.91,199.91,0,0,1,112,128a199.91,199.91,0,0,1,3.83-40h24.34A199.91,199.91,0,0,1,144,128ZM128,40c12.91,0,28.07,21.46,34.63,80H93.37C99.93,61.46,115.09,40,128,40ZM107.78,41.39C91.52,62.45,81.74,90.3,80.2,120H40.37A88.22,88.22,0,0,1,107.78,41.39ZM40.37,136H80.2c1.54,29.7,11.32,57.55,27.58,78.61A88.22,88.22,0,0,1,40.37,136ZM128,216c-12.91,0-28.07-21.46-34.63-80h69.26C156.07,194.54,140.91,216,128,216Zm20.22-1.39c16.26-21.06,26-48.91,27.58-78.61h39.83A88.22,88.22,0,0,1,148.22,214.61Z"></path>
            </svg>
        ),
    },
    {
        title: 'LinkedIn',
        url: 'https://linkedin.com/company/bootway',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor">
                <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
            </svg>
        ),
    },
    {
        title: 'Contact Us',
        url: 'mailto:support@bootway.in',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor">
                <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.19V181.81ZM40,64H216l-88,80.46Z"></path>
            </svg>
        ),
    },
    {
        title: 'WhatsApp',
        url: "https://wa.me/+917976866822?text=Hello%20BootWay%20Team,%0A%0AI'm%20interested%20in%20learning%20more%20about%20your%20indoor%20navigation%20solutions.%0A%0ALooking%20forward%20to%20your%20response.%0A%0AThanks",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor">
                <path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72,24,24,0,0,1,19.29-23.54l13.19,26.38-9.5,14.25a8,8,0,0,0-.73,7.59,56.45,56.45,0,0,0,24.26,24.3,8,8,0,0,0,7.6-.52l14.8-9.87,26.38,13.19A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"></path>
            </svg>
        ),
    },
    {
        title: 'Research & Studies',
        url: '/research',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor">
                <path d="M216,40V216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l72,72Zm-8,72H152a8,8,0,0,1-8-8V48H56V208H200ZM176,136H80a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Zm0,32H80a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Z"></path>
            </svg>
        ),
    },
];

export default function LinkMapPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

                .lt-body {
                    font-family: 'Outfit', sans-serif;
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px 20px;
                    background: linear-gradient(-45deg, #d8b4e2, #a2bced, #f2c79a, #aedfb0);
                    background-size: 400% 400%;
                    animation: ltGradientBG 15s ease infinite;
                    box-sizing: border-box;
                }

                @keyframes ltGradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .lt-container {
                    width: 100%;
                    max-width: 440px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.45);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    padding: 50px 30px;
                    border-radius: 36px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
                    animation: ltFadeInSlideUp 1s ease forwards;
                    opacity: 0;
                }

                .lt-profile {
                    text-align: center;
                    margin-bottom: 35px;
                }

                .lt-logo {
                    width: 300px !important;
                    height: auto !important;
                    object-fit: contain;
                    margin-bottom: 18px;
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .lt-logo:hover {
                    transform: scale(1.04);
                }

                .lt-tagline {
                    font-size: 1.05rem;
                    color: #4b5563;
                    font-weight: 500;
                    margin: 0;
                }

                .lt-links {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .lt-btn {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 18px 24px;
                    background: rgba(255, 255, 255, 0.7);
                    color: #111827;
                    text-decoration: none;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    font-family: 'Outfit', sans-serif;
                    cursor: pointer;
                    opacity: 0;
                    animation: ltFadeInSlideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }

                .lt-btn-icon {
                    position: absolute;
                    left: 24px;
                    display: flex;
                    align-items: center;
                    transition: all 0.35s ease;
                    z-index: 1;
                    color: #111827;
                }

                .lt-btn-fill {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #111827;
                    transform: scaleX(0);
                    transform-origin: right;
                    transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);
                    z-index: 0;
                    border-radius: 20px;
                }

                .lt-btn-text {
                    position: relative;
                    z-index: 1;
                }

                .lt-btn:hover {
                    color: #ffffff;
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
                    border-color: transparent;
                    transform: translateY(-4px);
                }

                .lt-btn:hover .lt-btn-fill {
                    transform: scaleX(1);
                    transform-origin: left;
                }

                .lt-btn:hover .lt-btn-icon {
                    color: #ffffff;
                }

                @keyframes ltFadeInSlideUp {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="lt-body">
                <div className="lt-container">
                    {/* Profile */}
                    <header className="lt-profile">
                        <Image
                            src="/logo-w-re.png"
                            alt="BootWay Logo"
                            width={300}
                            height={120}
                            className="lt-logo"
                            priority
                        />
                        <p className="lt-tagline">Innovating the future, one step at a time.</p>
                    </header>

                    {/* Links */}
                    <main className="lt-links">
                        {links.map((link, index) => (
                            <a
                                key={link.title}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="lt-btn"
                                style={{ animationDelay: `${(index + 1) * 0.1 + 0.3}s` }}
                            >
                                <div className="lt-btn-fill" />
                                <span className="lt-btn-icon">{link.icon}</span>
                                <span className="lt-btn-text">{link.title}</span>
                            </a>
                        ))}
                    </main>
                </div>
            </div>
        </>
    );
}
