document.addEventListener("DOMContentLoaded", function () {
    const authToken = localStorage.getItem("authToken");
    
    if (authToken) {
      document.querySelector(".nav-link[href='signup.html']").style.display = "none";
      const fullname = localStorage.getItem("fullname");
      if (fullname) {
        const navbar = document.querySelector(".navbar-nav");
        const fullnameElement = document.createElement("li");
        fullnameElement.classList.add("nav-item");
        fullnameElement.innerHTML = `<a class="nav-link">${fullname}</a>`;
              navbar.insertBefore(fullnameElement, navbar.lastElementChild);
      }
  
      const navbar = document.querySelector(".navbar-nav");
      const logoutElement = document.createElement("li");
      logoutElement.classList.add("nav-item");
      logoutElement.innerHTML = `<a class="nav-link" onclick="logout()">Logout</a>`;
      navbar.insertBefore(logoutElement, navbar.lastElementChild);
  
    }
  });
  
  
  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("fullname");
    window.location.href = "index.html";
  }
  