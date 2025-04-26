import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-dark-glow bg-cover bg-center bg-no-repeat animate-pan-gradient">
            <header className="bg-black bg-opacity-60 text-white p-4">
                <h1 className="text-2xl font-extrabold text-center">DataTalk - Democratizing Data Accessibility</h1>
                {/* Navigation or other header elements */}
            </header>
            <main className="flex-grow p-4">{children}</main>
            <footer className="bg-black bg-opacity-60 text-center p-2 font-bold text-white">
                <p>Made with ❤️ by <a className="text-red-500" href="https://www.linkedin.com/in/keshav-bansal-iit/">Keshav Bansal</a></p>
            </footer>
        </div>
    );
};

export default MainLayout;
