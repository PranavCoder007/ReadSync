import React from 'react';
import './about.css';
import pic1 from './assets/aditya.jpg';
import pic2 from './assets/varin1.jpg';
import pic3 from './assets/pranav1.jpg';
import pic4 from './assets/ayush1.jpg';
import Navbar from './Components/Navbar/Navbar.jsx'; 
const about = () => {
  return (
    <div>
      <Navbar/>
    <div className='about'>
    <h1 className="motivation-head">Our Motivation</h1>
      <p className="motivation-paragraph">
        ReadSync aims to create a platform where users can read together, share their thoughts, and discuss their favorite books. By leveraging the power of technology, we aim to foster a sense of community and connection among readers. Our mission is to empower individuals to discover new books, share their thoughts, and create meaningful connections with others.
      </p>
      <h1 className="team-head">Our Team</h1>
      <div className="about-container">
        <div className="card">
          <div className="card-image">
            <img src={pic1} alt="Profile" />
          </div>
          <p className="name">Aditya Mhatre</p>
          <p>Backend developer</p>
          <p>
            I am experienced in building scalable and efficient server-side applications, eager to apply my technical expertise and problem-solving skills in a dynamic and collaborative environment.
          </p>
          <h3>Tech Stack</h3>
          <div className="tech-stack">
            <span className="tech">Node</span>
            <span className="tech">Python</span>
            <span className="tech">Javascript</span>
            <span className="tech">C++</span>
          </div>
          <div className="socials">
            <button className="github" onClick={() => window.open('https://github.com/Lockstyles', '_blank')}>
              <i className="fab fa-github"></i>
            </button>
            <button className="instagram" onClick={() => window.open('https://www.instagram.com/lock.styles/', '_blank')}>
              <i className="fab fa-instagram"></i>
            </button>
            <button className="linkedin" onClick={() => window.open('https://www.linkedin.com/in/aditya-mhatre-156321311', '_blank')}>
              <i className="fab fa-linkedin"></i>
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-image">
            <img src={pic2} alt="Profile" />
          </div>
          <p className="name">Varin Mehta</p>
          <p>Backend developer</p>
          <p>
            I am experienced in designing robust APIs and managing databases, passionate about optimizing performance and creating seamless integrations to drive efficient systems.
          </p>
          <h3>Tech Stack</h3>
          <div className="tech-stack">
            <span className="tech">Node</span>
            <span className="tech">Java</span>
            <span className="tech">React</span>
          </div>
          <div className="socials">
            <button className="github" onClick={() => window.open('https://github.com/varinmehta', '_blank')}>
              <i className="fab fa-github"></i>
            </button>
            <button className="twitter" onClick={() => window.open('https://www.x.com/vrnmht', '_blank')}>
              <i className="fab fa-twitter"></i>
            </button>
            <button className="linkedin" onClick={() => window.open('https://www.linkedin.com/in/varinmehta', '_blank')}>
              <i className="fab fa-linkedin"></i>
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-image">
            <img src={pic3} alt="Profile" />
          </div>
          <p className="name">Pranav Nair</p>
          <p>Front-End developer</p>
          <p>
            I am experienced in developing scalable and high-performance web applications, eager to apply my technical skills and problem-solving abilities in a dynamic and collaborative environment.
          </p>
          <h3>Tech Stack</h3>
          <div className="tech-stack">
            <span className="tech">HTML/CSS</span>
            <span className="tech">C++</span>
            <span className="tech">Javascript</span>
            <span className="tech">React</span>
          </div>
          <div className="socials">
            <button className="github" onClick={() => window.open('https://github.com/PranavCoder007', '_blank')}>
              <i className="fab fa-github"></i>
            </button>
            <button className="instagram" onClick={() => window.open('https://www.instagram.com/pranav_0702/', '_blank')}>
              <i className="fab fa-instagram"></i>
            </button>
            <button className="linkedin" onClick={() => window.open('https://www.linkedin.com/in/pranavnair07/', '_blank')}>
              <i className="fab fa-linkedin"></i>
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-image">
            <img src={pic4} alt="Profile" />
          </div>
          <p className="name">Ayush Nemade</p>
          <p>Project Manager</p>
          <p>
            I have a track record in leading cross-functional teams and delivering high-impact projects on time, dedicated to fostering collaboration and ensuring the successful execution of complex initiatives.
          </p>
          <h3>Tech Stack</h3>
          <div className="tech-stack">
            <span className="tech">Java</span>
            <span className="tech">Javascript</span>
          </div>
          <div className="socials">
            <button className="github" onClick={() => window.open('https://github.com/Atom717', '_blank')}>
              <i className="fab fa-github"></i>
            </button>
            <button className="linkedin" onClick={() => window.open('https://www.linkedin.com/in/ayush-nemade-848ab72b6/', '_blank')}>
              <i className="fab fa-linkedin"></i>
            </button>
          </div>
        </div>
        
      </div>
    </div>
    </div>
  );
};

export default about;
