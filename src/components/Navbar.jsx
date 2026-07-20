import "./Navbar.css";

function Navbar() {
  return (
    <nav>
      <div className="logo">
        📜 WisdomScroll
      </div>

      <div className="links">
        <a href="#">Home</a>
        <a href="#">Quotes</a>
        <a href="#">About</a>
      </div>
    </nav>
  );
}

export default Navbar;