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
var jobHistoryData=null;

function assignId(id){
    idParam=id;
    console.log(idParam);
    
    fetchApi(`http://localhost:8081/ogya-internal-api/job-histories/get/id/${idParam}`)
          .then(data =>{
              const readJobHistories= document.getElementById('read-job-histories');
              // console.log(readJob);
              console.log(readJobHistories);
              jobHistoryData=data.content;
              console.log(jobHistoryData);
              document.getElementById("update-employee-id").value = jobHistoryData.employee_id.employee_id;
              document.getElementById("update-job-id").value = jobHistoryData.job_id.job_id;
              document.getElementById("update-department-id").value = jobHistoryData.department_id.department_id;
              
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
  
  fetchApi('http://localhost:8081/ogya-internal-api/job-histories/get/all')
    .then(data =>{
        const readJobHistory= document.getElementById('read-job-history');
        readJobHistory.innerHTML='';
        jobHistoryData= data.content;
        console.log(jobHistoryData);
        
        data.content.forEach(jobHistory => {
            // console.log(jobHistory);
            readJobHistory.innerHTML+=
            `<tr>
              <td>${jobHistory.job_history_id}</td>
              <td>${jobHistory.employee_id.first_name} ${jobHistory.employee_id.last_name}</td>
              <td>${jobHistory.start_date.substring(0, 10)}</td>
              <td>${jobHistory.end_date.substring(0, 10)}</td>
              <td>${jobHistory.job_id.job_title}</td>
              <td>${jobHistory.department_id.department_name}</td>
              <td><button class="btn btn-info" onclick="assignId(${jobHistory.job_history_id})" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button> <button class="btn btn-warning" id="btn-delete" onclick=deleteJobHistory(${jobHistory.job_history_id})>Delete</button></td>
            </tr>`
          });
          
        const searchJobHistory= document.getElementById("job-history-search")
        console.log(searchJobHistory);
        searchJobHistory.addEventListener('submit', (e)=>{
          e.preventDefault();
          console.log("berhasil submit");
          const formSearchJobHistory= document.getElementById('job-history-search-input').value.toLowerCase();
          console.log(formSearchJobHistory);
          
          if (formSearchJobHistory === '') {
            filterJobHistory();
        } else {
            filterJobHistory(formSearchJobHistory);
        }
          console.log(formSearchJobHistory);
          filterJobHistory(formSearchJobHistory)
        })
        } 
    )
    .catch(error => console.error(error));

    fetchApi('http://localhost:8081/ogya-internal-api/employees/get/all')
            .then(data => {
              const updateEmployeeSelect = document.getElementById('update-employee-id');
              console.log(updateEmployeeSelect);
              console.log(data.content);
              
              data.content.forEach(emp => {
                console.log(emp);
                const option = document.createElement('option');
                option.value = emp.employee_id;
                option.textContent = `${emp.employee_id} - ${emp.first_name} ${emp.last_name}`;
                updateEmployeeSelect.appendChild(option);
              });
            })
            .catch(error => console.error('Error loading job IDs:', error));

    fetchApi('http://localhost:8081/ogya-internal-api/jobs/get/all')
            .then(data => {
              const jobSelect = document.getElementById('job-id');
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

    fetchApi('http://localhost:8081/ogya-internal-api/jobs/get/all')
            .then(data => {
              const updateJobSelect = document.getElementById('update-job-id');
              console.log(updateJobSelect);
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

    fetchApi('http://localhost:8081/ogya-internal-api/departments/get/all')
            .then(data => {
              const departmentSelect = document.getElementById('department-id');
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

    fetchApi('http://localhost:8081/ogya-internal-api/departments/get/all')
            .then(data => {
              const updateDepartmentSelect = document.getElementById('update-department-id');
              console.log(updateDepartmentSelect);
              console.log(data.content);
              
              data.content.forEach(dep => {
                console.log(dep);
                const option = document.createElement('option');
                option.value = dep.department_id;
                option.textContent = `${dep.department_id} - ${dep.department_name}`;
                updateDepartmentSelect.appendChild(option);
              });
            })
            .catch(error => console.error('Error loading job IDs:', error));

    fetchApi('http://localhost:8081/ogya-internal-api/employees/get/all')
            .then(data => {
              const employeeSelect = document.getElementById('employee-id');
              console.log(employeeSelect);
              console.log(data.content);
              
              data.content.forEach(emp => {
                console.log(emp);
                const option = document.createElement('option');
                option.value = emp.employee_id;
                option.textContent = `${emp.employee_id} - ${emp.first_name} ${emp.last_name}`;
                employeeSelect.appendChild(option);
              });
            })
            .catch(error => console.error('Error loading job IDs:', error));

    function filterJobHistory(formSearchJobHistory){
        console.log(jobHistoryData);
        const readJobHistory= document.getElementById('read-job-history');
        const filteredJobHistory= jobHistoryData.filter(jobH=>{
          return jobH.employee_id.first_name.toLowerCase().includes(formSearchJobHistory)||
          jobH.employee_id.last_name.toLowerCase().includes(formSearchJobHistory)||
          jobH.job_id.job_title.toLowerCase().includes(formSearchJobHistory)||
          jobH.department_id.department_name.toLowerCase().includes(formSearchJobHistory)||
          jobH.job_history_id.toString().includes(formSearchJobHistory)
        })
        readJobHistory.innerHTML='';
  
        filteredJobHistory.forEach(jobHistory => {
            // console.log(jobHistory);
            readJobHistory.innerHTML+=
            `<tr>
              <td>${jobHistory.job_history_id}</td>
              <td>${jobHistory.employee_id.first_name} ${jobHistory.employee_id.last_name}</td>
              <td>${jobHistory.start_date.substring(0, 10)}</td>
              <td>${jobHistory.end_date.substring(0, 10)}</td>
              <td>${jobHistory.job_id.job_title}</td>
              <td>${jobHistory.department_id.department_name}</td>
              <td><button class="btn btn-info" onclick="assignId(${jobHistory.job_history_id})" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button> <button class="btn btn-warning" id="btn-delete" onclick=deleteJobHistory(${jobHistory.job_history_id})>Delete</button></td>
            </tr>`
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
    let isFormInitialized = false;
    function addJobHistory() {
        if (isFormInitialized) return; 
        isFormInitialized = true;
        console.log(document.getElementById("addJobHistoryForm"));
        document.getElementById("addJobHistoryForm").addEventListener("submit", async function(event) {
          const token = localStorage.getItem('jwtToken');
          console.log(token);
          event.preventDefault();
          const employeeId = document.getElementById("employee-id").value;
          const startDate = document.getElementById("start-date").value;
          const endDate = document.getElementById("end-date").value;
          const jobId = document.getElementById("job-id").value;
          const departmentId = document.getElementById("department-id").value;
          console.log(JSON.stringify({
            employee_id: employeeId, 
            start_date: startDate, 
            end_date: endDate, 
            job_id: jobId, 
            department_id: departmentId  
          }));

          if (!employeeId || !startDate || !endDate || !jobId || !departmentId) {
            Swal.fire({
              icon: 'warning',
              title: 'Incomplete Form',
              text: 'Please fill in all fields.'
            });
            return false;
          }else if (new Date(startDate) >= new Date(endDate)) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid Date Range',
              text: 'End date must be after the start date.'
            });
            return false;
          }else{
            try{
              const response = await fetch("http://localhost:8081/ogya-internal-api/job-histories/create", { 
                method: "POST",
                headers: {
                  "Content-Type": "application/json", 
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  employee_id: employeeId, 
                  start_date: startDate, 
                  end_date: endDate, 
                  job_id: jobId, 
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
                  title: "Add job History Granted!",
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
              alert("Failed to add job history.");
            }
          }
        })
      }

      function updateJobHistory() {
        console.log(idParam);
        console.log(document.getElementById("updateJobHistoryForm"));
        document.getElementById("updateJobHistoryForm").addEventListener("submit", async function(event) {
          event.preventDefault();
          const token = localStorage.getItem('jwtToken');
          const employeeId = document.getElementById("employee-id").value;
          const startDate = document.getElementById("update-start-date").value;
          const endDate = document.getElementById("update-end-date").value;
          const jobId = document.getElementById("update-job-id").value;
          const departmentId = document.getElementById("update-department-id").value;
          console.log(JSON.stringify({ 
            start_date: startDate, 
            end_date: endDate, 
            job_id: jobId, 
            department_id: departmentId
          }));
          if (!startDate || !endDate || !jobId || !departmentId) {
            Swal.fire({
              icon: 'warning',
              title: 'Incomplete Form',
              text: 'Please fill in all fields.'
            });
            return false;
          }else if (new Date(startDate) >= new Date(endDate)) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid Date Range',
              text: 'End date must be after the start date.'
            });
            return false;
          }else{
            try{
              const response = await fetch(`http://localhost:8081/ogya-internal-api/job-histories/update/${idParam}`, { // Ganti URL dengan endpoint Anda
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  job_history_id: idParam,
                  employee_id: employeeId, 
                  start_date: startDate, 
                  end_date: endDate, 
                  job_id: jobId, 
                  department_id: departmentId
                })
              });
              console.log(response);
              if (!response.ok) {
                throw new Error("Failed to to PUT");
              }
              if(response.ok){
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Update Department Granted!",
                  showConfirmButton: false,
                  timer: 2500
                });
              };
              const data = await response.json();
              console.log(data);
            }catch(err){
              console.error("Error:", err);
              alert("Failed to update department.");
            };
          }
        });
      };

      async function deleteJobHistory(id, e) {
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
          }).then(async (result) => {
            if (result.isConfirmed) {
              try{
                const response = await fetch(`http://localhost:8081/ogya-internal-api/job-histories/delete/${idParam}`, { 
                  method: "DELETE",
                  headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${token}`
                  }
              });
              
              console.log(response);
              if(response){
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Delete Job Granted!",
                  showConfirmButton: false,
                  timer: 2500
                });
              }
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }catch(err){
              console.error("Error:", err);
              alert("Failed to delete job.");
            };
          }else{
            console.log("Delete canceled");
          }
        })
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
        fetchApi('http://localhost:8081/ogya-internal-api/job-histories/get/all')
          .then(data =>{
              const readjobHistory= document.getElementById('read-jobHistory');
              console.log(readjobHistory);
              jobHistoryData=data.content;
              console.log(jobHistoryData);
                
          var paginationData = jobHistoryData;
          console.log(paginationData);

          const itemsPerPage = 5; 
          let currentPage = 1;
          function displayData(page) {
              const start = (page - 1) * itemsPerPage;
              const end = page * itemsPerPage;
              const paginatedItems = paginationData.slice(start, end);
              console.log(paginatedItems);
              const container = document.getElementById('read-job-history');
              console.log(container);
              container.innerHTML = paginatedItems.map(item => 
                `<tr>
              <td>${item.job_history_id}</td>
              <td>${item.employee_id.first_name} ${item.employee_id.last_name}</td>
              <td>${item.start_date.substring(0, 10)}</td>
              <td>${item.end_date.substring(0, 10)}</td>
              <td>${item.job_id.job_title}</td>
              <td>${item.department_id.department_name}</td>
              <td><button class="btn btn-info" onclick="assignId(${item.job_history_id})" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button> <button class="btn btn-warning" id="btn-delete" onclick=deleteJobHistory(${item.job_history_id})>Delete</button></td>
            </tr>`).join('');
          }

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