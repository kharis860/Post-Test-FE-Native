const token = localStorage.getItem('jwtToken');
console.log(token);

if (!token) {
  Swal.fire({
    icon: "error",
    title: "Authentication Error",
    text: "You are not authenticated.",
  });
  console.log("anda belum login");
  
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 500);
}
var idParam=null;
var employeeData=null;

function assignId(id){
  idParam=id;
  function fetchApi(url, method = 'GET', data = null) {
    const token = localStorage.getItem('jwtToken');
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json(); 
      })
      .catch(error => {
        console.error('Fetch error:', error);
        throw error; 
      });
  };

  fetchApi('http://localhost:8081/ogya-internal-api/employees/get/id/'+idParam)
    .then(data =>{
        // const readEmployee= document.getElementById('read-employee');
        employeeData=data.content;
        console.log(employeeData);
        document.getElementById("update-first-name").value = employeeData.first_name;
        document.getElementById("update-last-name").value = employeeData.last_name;
        document.getElementById("update-email").value = employeeData.email;
        // document.getElementById("update-password").value = employeeData.password;
        document.getElementById("update-phone-number").value = employeeData.phone_number;
        document.getElementById("update-hire-date").value = employeeData.hire_date;
        document.getElementById("update-job-id").value = employeeData.job_id.job_id;
        document.getElementById("update-salary").value = employeeData.salary;
        document.getElementById("update-commission-pct").value = employeeData.commission_pct;
        document.getElementById("update-manager-id").value = employeeData.manager_id;
        document.getElementById("update-department-id").value = employeeData.department_id.department_id;
});
}

function fetchApi(url, method = 'GET', data = null) {
    const token = localStorage.getItem('jwtToken');
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json(); 
      })
      .catch(error => {
        console.error('Fetch error:', error);
        throw error; 
      });
  }

function fetchApi(url, method = 'GET', data = null) {
    const token = localStorage.getItem('jwtToken');
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json(); 
      })
      .catch(error => {
        console.error('Fetch error:', error);
        throw error; 
      });
  }
  
  fetchApi('http://localhost:8081/ogya-internal-api/employees/get/all')
    .then(data =>{
        const readEmployee= document.getElementById('read-employee');
        readEmployee.innerHTML='';
        employeeData=data.content;
        console.log(employeeData);
        data.content.forEach(emp => {
            // console.log(emp);
            readEmployee.innerHTML+=
            `
            <tr>
                    <td>${emp.employee_id}</td>
                    <td>${emp.first_name} ${emp.last_name}</td>
                    <td>${emp.email}</td>
                    <td>${emp.phone_number}</td>
                    <td>${emp.hire_date.substring(0, 10)}</td>
                    <td>${emp.job_id.job_title}</td>
                    <td>${emp.salary}</td>
                    <td><button class="btn btn-info" onclick="assignId(${emp.employee_id})" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button> <button class="btn btn-warning" id="btn-delete" onclick=deleteEmployee(${emp.employee_id})>Delete</button></td>
              </tr>  
            `
          });
        const searchEmployee= document.getElementById("employee-search")
        console.log(searchEmployee);
        searchEmployee.addEventListener('submit', (e)=>{
          e.preventDefault();
          console.log("berhasil submit");
          const formSearchEmployee= document.getElementById('employee-search-input').value.toLowerCase();
          if (formSearchEmployee === '') {
            filterEmployee();
        } else {
            filterEmployee(formSearchEmployee);
        }
          console.log(formSearchEmployee);
          filterEmployee(formSearchEmployee)
        })
    } 
    )
    .catch(error => console.error(error));

    fetchApi('http://localhost:8081/ogya-internal-api/departments/get/all')
            .then(data => {
              const departmentSelect = document.getElementById('department-id');
              const updateDepartmentSelect = document.getElementById('update-department-id');
              console.log(departmentSelect);
              console.log(data.content);
              
              data.content.forEach(dep => {
                console.log(dep);
                const option = document.createElement('option');
                option.value = dep.department_id;
                option.textContent = `${dep.department_id} - ${dep.department_name}`;
                updateDepartmentSelect.appendChild(option);
              });
            })
            .catch(error => console.error('Error loading department ID:', error));
            fetchApi('http://localhost:8081/ogya-internal-api/jobs/get/all')
            .then(data => {
              const jobSelect = document.getElementById('job-id');
              const updateJobSelect = document.getElementById('update-job-id');
              console.log(jobSelect);
              console.log(data.content);
              
              data.content.forEach(job => {
                console.log(job);
                
                const option = document.createElement('option');
                option.value = job.job_id;
                option.textContent = `${job.job_id} - ${job.job_title}`;
                updateJobSelect.appendChild(option);
              });
            })
            .catch(error => console.error('Error loading job IDs:', error));


    function filterEmployee(formSearchEmployee){
      console.log(employeeData);
      const readEmployee= document.getElementById('read-employee');
      const filteredEmployees= employeeData.filter(emp=>{
        return emp.first_name.toLowerCase().includes(formSearchEmployee)||
        emp.last_name.toLowerCase().includes(formSearchEmployee)||
        emp.employee_id.toString().includes(formSearchEmployee)||
        emp.email.toLowerCase().includes(formSearchEmployee)||
        emp.job_id.job_title.toLowerCase().includes(formSearchEmployee)||
        emp.hire_date.toLowerCase().includes(formSearchEmployee)
      })
      readEmployee.innerHTML='';
      filteredEmployees.forEach(emp => {
        // console.log(emp);
        readEmployee.innerHTML+=
        `
        <tr>
                <td>${emp.employee_id}</td>
                <td>${emp.first_name} ${emp.last_name}</td>
                <td>${emp.email}</td>
                <td>${emp.phone_number}</td>
                <td>${emp.hire_date.substring(0, 10)}</td>
                <td>${emp.job_id.job_title}</td>
                <td>${emp.salary}</td>
                <td><button class="btn btn-info" onclick="assignId(${emp.employee_id})" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button> <button class="btn btn-warning" id="btn-delete" onclick=deleteEmployee(${emp.employee_id})>Delete</button></td>
          </tr>  
        `
      });
}

    function logout(){
      Swal.fire({
        title: "Are you sure want to logout?",
        text: "You have to relog after this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Logout!",
            text: "Directed to login page.",
            icon: "success"
          });
          localStorage.removeItem("jwtToken");
          setTimeout(() => {
            window.location.href = "login.html"
          }, 2000);
        }
      });
    }
    document.getElementById("logout").addEventListener("click", logout);
    
    // end pagination
    let isFormInitialized = false;
    function addEmployee() {
      if (isFormInitialized) return; 
      isFormInitialized = true;
      console.log(document.getElementById("addEmployeeForm"));
      document.getElementById("addEmployeeForm").addEventListener("submit", async function(event) {
        const token = localStorage.getItem('jwtToken');
        console.log(token);
        event.preventDefault();
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
          return
        } else if (!lastName) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Last name is required.",
          });
          return;
        }
    
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "A valid email is required.",
          });
          return;
        }else if (!password || password.length < 6) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Password is required and must be at least 6 characters long.",
          });
          return;
        }else if (!phoneNumber || isNaN(phoneNumber)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Phone number is required and must be a number.",
          });
          return;
        }else if (!hireDate) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Hire date is required.",
          });
          return;
        }else if (!jobId || typeof jobId !== 'string') {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Job ID is required.",
          });
          return;
        }else if (!salary || isNaN(salary) || salary <= 0) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Salary is required and must be a positive number.",
          });
          return;
        }else if (!commissionPct && (isNaN(commissionPct) || commissionPct < 0 || commissionPct > 100)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Commission Percentage must be a number between 0 and 100.",
          });
          return;
        }else if (!managerId && isNaN(managerId)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Manager ID must be a number.",
          });
          return;
        }else if (!departmentId && isNaN(departmentId)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Department ID must be a number.",
          });
          return;
        }else if (!token) {
          Swal.fire({
            icon: "error",
            title: "Authentication Error",
            text: "You are not authenticated.",
          });
          return;

          // validasi
        
        }else{
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
                title: "Add Employee Granted!",
                showConfirmButton: false,
                timer: 2500
              });
            }
            const data = await response.json();
            console.log(data);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }catch(err){
            console.error("Error:", err);
            alert("Failed to add Employee.");
          }
        }
      })
    }
    function updateEmployee() {
      console.log(idParam);
      console.log(document.getElementById("updateEmployeeForm"));
      document.getElementById("updateEmployeeForm").addEventListener("submit", async function(event) {
        const token = localStorage.getItem('jwtToken');
        console.log(token);
        event.preventDefault();
        const firstName = document.getElementById("update-first-name").value;
        const lastName = document.getElementById("update-last-name").value;
        const email = document.getElementById("update-email").value;
        const password = document.getElementById("update-password").value;
        const phoneNumber = document.getElementById("update-phone-number").value;
        const hireDate = document.getElementById("update-hire-date").value;
        const jobId = document.getElementById("update-job-id").value;
        const salary = document.getElementById("update-salary").value;
        const commissionPct = document.getElementById("update-commission-pct").value;
        const managerId = document.getElementById("update-manager-id").value;
        const departmentId = document.getElementById("update-department-id").value;
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
          return
        } else if (!lastName) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Last name is required.",
          });
          return;
        }
    
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "A valid email is required.",
          });
          return;
        }else if (!password || password.length < 6) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Password is required and must be at least 6 characters long.",
          });
          return;
        }else if (!phoneNumber || isNaN(phoneNumber)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Phone number is required and must be a number.",
          });
          return;
        }else if (!hireDate) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Hire date is required.",
          });
          return;
        }else if (!jobId || typeof jobId !== 'string') {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Job ID is required.",
          });
          return;
        }else if (!salary || isNaN(salary) || salary <= 0) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Salary is required and must be a positive number.",
          });
          return;
        }else if (!commissionPct && (isNaN(commissionPct) || commissionPct < 0 || commissionPct > 100)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Commission Percentage must be a number between 0 and 100.",
          });
          return;
        }else if (!managerId && isNaN(managerId)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Manager ID must be a number.",
          });
          return;
        }else if (!departmentId && isNaN(departmentId)) {
          Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Department ID must be a number.",
          });
          return;
        }else if (!token) {
          Swal.fire({
            icon: "error",
            title: "Authentication Error",
            text: "You are not authenticated.",
          });
          return;

          // validasi
        }else{
          try{
            const response = await fetch(`http://localhost:8081/ogya-internal-api/employees/update/${idParam}`, { 
              method: "PUT",
              headers: {
                "Content-Type": "application/json", 
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                employee_id: idParam,
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
                title: "update Employee Granted!",
                showConfirmButton: false,
                timer: 2500
              });
            }
            const data = await response.json();
            console.log(data);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }catch(err){
            console.error("Error:", err);
            alert("Failed to add employee.");
          }
        }
      })
    }
    async function deleteEmployee(id) {
      idParam=id;
      console.log(idParam);
      const token = localStorage.getItem('jwtToken');   
      Swal.fire({
        title: "Are you sure want to delete this data?",
        text: "Your data will deleted permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete!"
      }).then(async(result) => {
        if (result.isConfirmed) {
          try{
            const response = await fetch(`http://localhost:8081/ogya-internal-api/employees/delete/${idParam}`, { 
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
              }
            });
            if(response){
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Delete Employee Granted!",
                showConfirmButton: false,
                timer: 2500
              });
            }
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }catch(err){
            console.error("Error:", err);
            alert("Failed to add department.");
          };
        }else{
          console.log("Delete Cancelled");
        }
      });
    }
        

      // pagination
        function fetchApi(url, method = 'GET', data = null) {
          const token = localStorage.getItem('jwtToken');
          const options = {
            method: method,
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`
            }
          };
        
          if (data) {
            options.body = JSON.stringify(data);
          }
        
          return fetch(url, options)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
              }
              return response.json(); 
            })
            .catch(error => {
              console.error('Fetch error:', error);
              throw error; 
            });
        }
        fetchApi('http://localhost:8081/ogya-internal-api/employees/get/all')
          .then(data =>{
              const readEmployee= document.getElementById('read-employee');
              // console.log(readDepartment);
              console.log(readEmployee);
              employeeData=data.content;
              console.log(employeeData);
                
          var paginationData = employeeData;
          console.log(paginationData);

          const itemsPerPage = 5; 
          let currentPage = 1;

          function displayData(page) {
              const start = (page - 1) * itemsPerPage;
              const end = page * itemsPerPage;
              const paginatedItems = paginationData.slice(start, end);
              console.log(paginatedItems);
              
              const container = document.getElementById('read-employee');
              console.log(container);
              container.innerHTML = paginatedItems.map(item => 
                `
                  <tr>
                      <td>${item.employee_id}</td>
                      <td>${item.first_name} ${item.last_name}</td>
                      <td>${item.email}</td>
                      <td>${item.phone_number}</td>
                      <td>${item.hire_date.substring(0, 10)}</td>
                      <td>${item.job_id.job_title}</td>
                      <td>${item.salary}</td>
                      <td><button class="btn btn-info" onclick="assignId(${item.employee_id})" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button> <button class="btn btn-warning" id="btn-delete" onclick=deleteEmployee(${item.employee_id})>Delete</button></td>
                  </tr>  
                `).join('');
          }
          // control
          function setupPagination(totalItems) {
              const pageCount = Math.ceil(totalItems / itemsPerPage);
              const paginationControls = document.getElementById('pagination-controls');
              paginationControls.innerHTML = '';

              // Prev
              const prevButton = document.createElement('span');
              prevButton.textContent = 'Previous';
              prevButton.classList.add('pagination-button');
              prevButton.classList.toggle('disabled', currentPage === 1);
              prevButton.onclick = () => goToPage(currentPage - 1);
              paginationControls.appendChild(prevButton);

              // nomor
              for (let i = 1; i <= pageCount; i++) {
                  const pageButton = document.createElement('span');
                  pageButton.textContent = i;
                  pageButton.classList.add('pagination-button');
                  if (i === currentPage) pageButton.classList.add('active');
                  pageButton.onclick = () => goToPage(i);
                  paginationControls.appendChild(pageButton);
              }

              // Next
              const nextButton = document.createElement('span');
              nextButton.textContent = 'Next';
              nextButton.classList.add('pagination-button');
              nextButton.classList.toggle('disabled', currentPage === pageCount);
              nextButton.onclick = () => goToPage(currentPage + 1);
              paginationControls.appendChild(nextButton);
          }

          // move
          function goToPage(page) {
              const pageCount = Math.ceil(data.length / itemsPerPage);
              if (page < 1 || page > pageCount) return;

              currentPage = page;
              displayData(page);
              setupPagination(paginationData.length);
          }
          displayData(currentPage);
          setupPagination(paginationData.length);
        });
        // pagination

        
        async function dropdownJobId(){
            function fetchApi(url, method = 'GET', data = null) {
              const token = localStorage.getItem('jwtToken');
              const options = {
                method: method,
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`
                }
              };
              
              if (data) {
                options.body = JSON.stringify(data);
              }
              return fetch(url, options)
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                  }
                  return response.json(); 
                })
                .catch(error => {
                  console.error('Fetch error:', error);
                  throw error; 
                });
            }
            fetchApi('http://localhost:8081/ogya-internal-api/jobs/get/all')
            .then(data => {
              const jobSelect = document.getElementById('job-id');
              const updateJobSelect = document.getElementById('update-job-id');
              console.log(jobSelect);
              console.log(data.content);
              
              data.content.forEach(job => {
                console.log(job);
                const option = document.createElement('option');
                option.value = job.job_id;
                option.textContent = `${job.job_id} - ${job.job_title}`;
                jobSelect.appendChild(option);
              });
            })
            .catch(error => console.error('Error loading job IDs:', error));

            
            fetchApi('http://localhost:8081/ogya-internal-api/departments/get/all')
            .then(data => {
              const departmentSelect = document.getElementById('department-id');
              const updateDepartmentSelect = document.getElementById('update-department-id');
              console.log(departmentSelect);
              console.log(data.content);
              
              data.content.forEach(dep => {
                console.log(dep);
                const option = document.createElement('option');
                option.value = dep.department_id;
                option.textContent = `${dep.department_id} - ${dep.department_name}`;
                departmentSelect.appendChild(option);
              });
            })
            .catch(error => console.error('Error loading job IDs:', error));
        }