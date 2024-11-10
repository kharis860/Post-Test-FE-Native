document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:8081/ogya-internal-api/employees/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log(data.detail_massage);
      
      const jwtToken = data.info.detail_massage.split(": ")[1]; 
      localStorage.setItem("jwtToken", jwtToken);
      console.log("Login successful:", data);
      window.location.href = "/getEmployee.html"; 

    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    }
  });