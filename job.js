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

var idParam="";
var jobData=null;

function assignJobId(id){
    idParam=id;
    console.log(idParam, "from function");
    console.log(id);
    
    fetchApi(`http://localhost:8081/ogya-internal-api/jobs/get/id/${idParam}`)
          .then(data =>{
              const readJob= document.getElementById('read-job');
              // console.log(readJob);
              console.log(readJob);
              jobData=data.content;
              console.log(jobData);
              document.getElementById("update-job-title").value = jobData.job_title;
              document.getElementById("update-max-salary").value = jobData.max_salary;
              document.getElementById("update-min-salary").value = jobData.min_salary;
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

  fetchApi('http://localhost:8081/ogya-internal-api/jobs/get/all')
    .then(data =>{
        const readJob= document.getElementById('read-job');
        jobData=data.content;
        console.log(jobData);
        readJob.innerHTML='';
        data.content.forEach(job => {
            console.log(job.job_id);
            readJob.innerHTML+=
            `<tr>
              <td>${job.job_id}</td>
              <td>${job.job_title}</td>
              <td>${job.max_salary}</td>
              <td>${job.min_salary}</td>
              <td><button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#updateModal" onclick="assignJobId('${job.job_id}')">Update</button> <button class="btn btn-warning" id="btn-delete" onclick="deleteJob('${job.job_id}')">Delete</button></td>
            </tr>`
          });
        const searchJob= document.getElementById("job-search")
        console.log(searchJob);
        searchJob.addEventListener('submit', (e)=>{
          e.preventDefault();
          console.log("berhasil submit");
          const formSearchJob= document.getElementById('job-search-input').value.toLowerCase();
          if (formSearchJob === '') {
            filterJob();
        } else {
            filterJob(formSearchJob);
        }
          console.log(formSearchJob);
          filterJob(formSearchJob)
        })
    } 
    )
    .catch(error => console.error(error));


    function filterJob(formSearchJob){
        console.log(jobData);
        const readJob= document.getElementById('read-job');
        const filteredDepartments= jobData.filter(emp=>{
          return emp.job_title.toLowerCase().includes(formSearchJob)||
          emp.job_id.toLowerCase().includes(formSearchJob) 
        });
        readJob.innerHTML='';
        filteredDepartments.forEach(job => {
            console.log(job.job_id);
            readJob.innerHTML+=
            `<tr>
              <td>${job.job_id}</td>
              <td>${job.job_title}</td>
              <td>${job.max_salary}</td>
              <td>${job.min_salary}</td>
              <td><button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#updateModal" onclick="assignJobId('${job.job_id}')">Update</button> <button class="btn btn-warning" id="btn-delete" onclick="deleteJob('${job.job_id}')">Delete</button></td>
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
    let isFormInitialized = false;
    function addJob() {
        if (isFormInitialized) return; // Cegah penambahan listener berulang
        isFormInitialized = true;
        console.log(document.getElementById("addJobForm"));
        document.getElementById("addJobForm").addEventListener("submit", async function(event) {
          const token = localStorage.getItem('jwtToken');
          console.log(token);
          event.preventDefault();
          const jobId = document.getElementById("job-id").value;
          const jobTitle = document.getElementById("job-title").value;
          const minSalary = document.getElementById("min-salary").value;
          const maxSalary= document.getElementById("max-salary").value;
          console.log(JSON.stringify({
            job_id: jobId, 
            job_title: jobTitle, 
            min_salary: minSalary, 
            max_salary: maxSalary
          }));
          try{
            const response = await fetch("http://localhost:8081/ogya-internal-api/jobs/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                job_id: jobId, 
                job_title: jobTitle, 
                min_salary: minSalary, 
                max_salary: maxSalary
              })
            });
            if (!response.ok) {
              throw new Error("Failed to to POST");
            }
            if(response.ok){
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Add Job Granted!",
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
            alert("Failed to add job.");
          }
        })
      }
      function updateJob() {
        // console.log(idParam);
        console.log(document.getElementById("updateJobForm"));
        document.getElementById("updateJobForm").addEventListener("submit", async function(event) {
          event.preventDefault();
          const token = localStorage.getItem('jwtToken');
          const jobTitle = document.getElementById("update-job-title").value;
          const minSalary = document.getElementById("update-min-salary").value;
          const maxSalary= document.getElementById("update-max-salary").value;
          console.log(JSON.stringify({
            job_id: idParam, 
            job_title: jobTitle, 
            min_salary: minSalary, 
            max_salary: maxSalary
          }));
          try{
            const response = await fetch(`http://localhost:8081/ogya-internal-api/jobs/update/${idParam}`, { // Ganti URL dengan endpoint Anda
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                job_id: idParam, 
                job_title: jobTitle, 
                min_salary: minSalary, 
                max_salary: maxSalary
              })
            });
            console.log(response);
            if (!response.ok) {
              throw new Error("Failed to to POST");
            }
            if(response.ok){
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Update Job Granted!",
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
            alert("Failed to update job.");
          }
        })
      }
      async function deleteJob(id) {
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
              const response = await fetch(`http://localhost:8081/ogya-internal-api/jobs/delete/${idParam}`, { 
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
            console.log("canceled delete");
          }
        });
      };
      
        // pagination
        // script.js

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
          .then(data =>{
              const readJob= document.getElementById('read-job');
              console.log(readJob);
              jobData=data.content;
              console.log(jobData);
                
          var paginationData = jobData;
          console.log(paginationData);

          const itemsPerPage = 5; // 
          let currentPage = 1;

          function displayData(page) {
              const start = (page - 1) * itemsPerPage;
              const end = page * itemsPerPage;
              const paginatedItems = paginationData.slice(start, end);
              console.log(paginatedItems);
              
              const container = document.getElementById('read-job');
              console.log(container);
              container.innerHTML = paginatedItems.map(item => 
                `<tr>
              <td>${item.job_id}</td>
              <td>${item.job_title}</td>
              <td>${item.max_salary}</td>
              <td>${item.min_salary}</td>
              <td><button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#updateModal" onclick="assignJobId('${item.job_id}')">Update</button> <button class="btn btn-warning" id="btn-delete" onclick="deleteJob('${item.job_id}')">Delete</button></td>
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
      