import React, { useState, useRef, useEffect } from "react";

const DropdownMenu = ({ setCurrentPage, isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dd" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`ddt ${isOpen ? "hidden" : ""}`}
      >
        Menu
      </button>
      <ul className={`ddm ${isOpen ? "open" : ""}`}>
        {!isAuthenticated ? (
          <>
            <li
              className="ddi"
              onClick={() => {
                toggleDropdown();
                setCurrentPage("page1");
              }}
            >
              Login
            </li>
            <li
              className="ddi"
              onClick={() => {
                toggleDropdown();
                setCurrentPage("page2");
              }}
            >
              Register
            </li>
            <li
              className="ddi"
              onClick={() => {
                toggleDropdown();
                setCurrentPage("page3");
              }}
            >
              Join
            </li>
            <li
              className="ddi"
              onClick={() => {
                toggleDropdown();
                setCurrentPage("displayer");
              }}
            >
              Displayer
            </li>
          </>
        ) : (
          <>
            <li
              className="ddi"
              onClick={() => {
                toggleDropdown();
                setCurrentPage("dashboard");
              }}
            >
              Dashboard
            </li>
            <li
              className="ddi"
              onClick={() => {
                toggleDropdown();
                setCurrentPage("page3");
              }}
            >
              Join
            </li>
            <li
              className="ddi"
              onClick={() => {
                toggleDropdown();
                setCurrentPage("displayer");
              }}
            >
              Displayer
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default DropdownMenu;
