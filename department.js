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

const apiUrl ="http://localhost:8081/ogya-internal-api/departments/get/all";
var idParam=null;
var departmentData=null;

function fetchApi(url, method = 'GET', data = null) {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
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
  fetchApi('http://localhost:8081/ogya-internal-api/departments/get/all')
    .then(data =>{
        const readDepartment= document.getElementById('read-department');
        // console.log(readDepartment);
        console.log(readDepartment);
        readDepartment.innerHTML='';
        departmentData=data.content;
        console.log(departmentData);


        const searchDepartment= document.getElementById("department-search")
        console.log(searchDepartment);
        searchDepartment.addEventListener('submit', (e)=>{
          e.preventDefault();
          console.log("berhasil submit");
          const formSearchDepartment= document.getElementById('department-search-input').value.toLowerCase();
          if (formSearchDepartment === '') {
            filterDepartment();
            window.location.reload();
        } else {
            filterDepartment(formSearchDepartment);
        }
          console.log(formSearchDepartment);
          filterDepartment(formSearchDepartment)
        })
    } 
    ).catch(error => console.error(error));

    function filterDepartment(formSearchDepartment){
      console.log(departmentData);
      const readDepartment= document.getElementById('read-department');
      const filteredDepartments= departmentData.filter(dep=>{
        return dep.department_name.toLowerCase().includes(formSearchDepartment)||
        dep.department_id.toString().includes(formSearchDepartment)
      });
      readDepartment.innerHTML='';

      filteredDepartments.forEach(department => {
        // console.log(department.department_id);
        readDepartment.innerHTML+=
        `<tr>
          <td>${department.department_id}</td>
          <td>${department.department_name}</td>
          <td>${department.manager_id}</td>
          <td>${department.location_id}</td>
          <td><button class="btn btn-info" onclick="assignId(${department.department_id})" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button> <button class="btn btn-warning" id="btn-delete" onclick=deleteDepartment(${department.department_id})>Delete</button></td>
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

      function assignId(id){
        idParam=id;
        function fetchApi(url, method = 'GET', data = null) {
          const options = {
            method: method,
            headers: {
              'Content-Type': 'application/json'
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
        fetchApi(`http://localhost:8081/ogya-internal-api/departments/get/id/${idParam}`)
          .then(data =>{
              const readDepartment= document.getElementById('read-department');
              // console.log(readDepartment);
              console.log(readDepartment);
              departmentData=data.content;
              console.log(departmentData);
              document.getElementById("update-department-name").value = departmentData.department_name;
              document.getElementById("update-manager-id").value = departmentData.manager_id;
              document.getElementById("update-location-id").value = departmentData.location_id;
              });
      }
      let isFormInitialized = false;

      function addDepartment() {
        if (isFormInitialized) return; 
        isFormInitialized = true;
        console.log(document.getElementById("addDepartmentForm"));
        document.getElementById("addDepartmentForm").addEventListener("submit", async function(event) {
          const token = localStorage.getItem('jwtToken');
          console.log(token);
          event.preventDefault();
          const departmentName = document.getElementById("department-name").value;
          const managerId = document.getElementById("manager-id").value;
          const locationId = document.getElementById("location-id").value;
          console.log(JSON.stringify({
            department_name: departmentName, 
            manager_id: managerId, 
            location_Id: locationId
          }));

              // validasi
              if (departmentName === "") {
                Swal.fire({
                  icon: "warning",
                  title: "Validation Error",
                  text: "Department Name is required.",
                });
                return false;
              }else if (managerId === "" || isNaN(managerId)) {
                Swal.fire({
                  icon: "warning",
                  title: "Validation Error",
                  text: "Manager ID is required and should be a number.",
                });
                return false;
              }else if (locationId === "" || isNaN(locationId)) {
                Swal.fire({
                  icon: "warning",
                  title: "Validation Error",
                  text: "Location ID is required and should be a number.",
                });
                return false;
              }else if (!token) {
                Swal.fire({
                  icon: "error",
                  title: "Authentication Error",
                  text: "You are not authenticated.",
                });
                return false;
                // validasi
              }

                try{
                  const response = await fetch("http://localhost:8081/ogya-internal-api/departments/create", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      department_name: departmentName, 
                      manager_id: managerId, 
                      location_id: locationId
                    })
                  });
                  if (!response.ok) {
                    throw new Error("Failed to to POST");
                  }
                  if(response.ok){
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: "Add Department Granted!",
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
                  alert("Failed to add department.");
                };
              
        });
      };

      function updateDepartment() {
        console.log(document.getElementById("updateDepartmentForm"));
        document.getElementById("updateDepartmentForm").addEventListener("submit", async function(event) {
          event.preventDefault();
          const token = localStorage.getItem('jwtToken');
          const departmentName = document.getElementById("update-department-name").value;
          const managerId = document.getElementById("update-manager-id").value;
          const locationId = document.getElementById("update-location-id").value
          console.log(JSON.stringify({
            department_name: departmentName, 
            manager_id: managerId, 
            location_Id: locationId
          }));

          // validasi
          const namePattern = /^[A-Za-z\s]+$/;
          if (departmentName === "") {
            Swal.fire({
              icon: "warning",
              title: "Validation Error",
              text: "Department Name is required.",
            });
            return;
          }else if(!namePattern.test(departmentName)){
            Swal.fire({
              icon: "warning",
              title: "Validation Error",
              text: "Department Name should only contain letters.",
          });
          return;
          }
          else if (managerId === "" || isNaN(managerId)) {
            Swal.fire({
              icon: "warning",
              title: "Validation Error",
              text: "Manager ID is required and should be a number.",
            });
            return;
          }else if (locationId === "" || isNaN(locationId)) {
            Swal.fire({
              icon: "warning",
              title: "Validation Error",
              text: "Location ID is required and should be a number.",
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
              const response = await fetch(`http://localhost:8081/ogya-internal-api/departments/update/${idParam}`, { // Ganti URL dengan endpoint Anda
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  department_id: idParam,
                  department_name: departmentName, 
                  manager_id: managerId, 
                  location_id: locationId
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
              }
              const data = await response.json();
              console.log(data);
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }catch(err){
              console.error("Error:", err);
              alert("Failed to update department.");
            };
          };
        });
      };
      async function deleteDepartment(id) {
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
          if(result.isConfirmed){

          
          try{
            const response = await fetch(`http://localhost:8081/ogya-internal-api/departments/delete/${idParam}`, { 
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
              }
            });
            console.log(response);
            if (!response.ok) {
              throw new Error("Failed to to DELETE");
            }
            if(response.ok){
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Delete Department Granted!",
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
            alert("Failed to add department.");
          };
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          };
        }else{
          console.log("Delete Cancelled");
        }
        });
          
        };
      

        // pagination
        // script.js


        function fetchApi(url, method = 'GET', data = null) {
          const options = {
            method: method,
            headers: {
              'Content-Type': 'application/json'
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
        fetchApi('http://localhost:8081/ogya-internal-api/departments/get/all')
          .then(data =>{
              const readDepartment= document.getElementById('read-department');
              // console.log(readDepartment);
              console.log(readDepartment);
              departmentData=data.content;
              console.log(departmentData);
                

          // Contoh data yang akan dipaginasi
          var paginationData = departmentData;
          console.log(paginationData);

          // Pengaturan pagination
          const itemsPerPage = 5; // Jumlah item per halaman
          let currentPage = 1;

          // Fungsi untuk menampilkan data pada halaman tertentu
          function displayData(page) {
              const start = (page - 1) * itemsPerPage;
              const end = page * itemsPerPage;
              const paginatedItems = paginationData.slice(start, end);

              const container = document.getElementById('read-department');
              console.log(container);
              container.innerHTML = paginatedItems.map(item => 
                `<tr>
              <td>${item.department_id}</td>
              <td>${item.department_name}</td>
              <td>${item.manager_id}</td>
              <td>${item.location_id}</td>
              <td><button class="btn btn-info" onclick="assignId(${item.department_id})" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button> <button class="btn btn-warning" id="btn-delete" onclick=deleteDepartment(${item.department_id})>Delete</button></td>
              </tr>`)
                .join('');
          }

          //  pagination
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