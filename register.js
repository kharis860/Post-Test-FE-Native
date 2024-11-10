let isFormInitialized = false;
function addEmployee() {
    if (isFormInitialized) return; 
    isFormInitialized = true;
    console.log(document.getElementById("registrationForm"));
    document.getElementById("registrationForm").addEventListener("submit", async function(event) {
      event.preventDefault();
      const token = localStorage.getItem('jwtToken');
      console.log(token);
      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const phoneNumber = document.getElementById("phone-number").value;
      const hireDate = document.getElementById("hire-date").value;
      const jobId = document.getElementById("job-id").value;
      const salary = document.getElementById("salary").value;
      const commissionPct = document.getElementById("commission-pct").value;
      const managerId = document.getElementById("manager-id").value;
      const departmentId = document.getElementById("department-id").value;
      console.log(JSON.stringify({
        first_name: firstName, 
        last_name: lastName, 
        email: email, 
        password: password, 
        phone_number: phoneNumber, 
        hire_date: hireDate, 
        job_id: jobId, 
        salary: salary, 
        commission_pct: commissionPct,
        manager_id: managerId, 
        department_id: departmentId
      }));

      // validasi
      if (!firstName) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "First name is required.",
        });
        return false;
      } else if (!lastName) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Last name is required.",
        });
        return false;
      }else if (!password || password.length < 6) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Password is required and must be at least 6 characters long.",
        });
        return false;
      }else if (!phoneNumber || isNaN(phoneNumber)) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Phone number is required and must be a number.",
        });
        return false;
      }else if (!hireDate) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Hire date is required.",
        });
        return false;
      }else if (!jobId || typeof jobId !== 'string') {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Job ID is required.",
        });
        return false;
      }else if (!salary || isNaN(salary) || salary <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Salary is required and must be a positive number.",
        });
        return false;
      }else if (!commissionPct && (isNaN(commissionPct) || commissionPct < 0 || commissionPct > 1)) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Commission Percentage must be a number between 0 and 100.",
        });
        return false;
      }else if (!managerId && isNaN(managerId)) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Manager ID must be a number.",
        });
        return false;
      }else if (!departmentId && isNaN(departmentId)) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Department ID must be a number.",
        });
        return false;
      }

        try{
          const response = await fetch("http://localhost:8081/ogya-internal-api/employees/create", { 
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              first_name: firstName, 
              last_name: lastName, 
              email: email, 
              password: password, 
              phone_number: phoneNumber, 
              hire_date: hireDate, 
              job_id: jobId, 
              salary: salary, 
              commission_pct: commissionPct,
              manager_id: managerId,  
              department_id: departmentId
            })
          });
          if (!response.ok) {
            throw new Error("Failed to to POST");
          }
          console.log(response);
          if(response.ok){
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Register Granted!",
              showConfirmButton: false,
              timer: 2500
            });
          }
          const data = await response.json();
          console.log(data);
          setTimeout(() => {
            window.location.href = "/login.html";
          }, 3000);
          
        }catch(err){
          console.error("Error:", err);
          alert("Failed to add Employee.");
        }
      
    })
  }