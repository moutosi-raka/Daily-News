let categoryList = [];

const loadData = async () => {
  const url = `https://openapi.programming-hero.com/api/news/categories`;
  try{
    const res = await fetch(url);
    const data = await res.json();
    const result = data.data.news_category;
    categoryList = result;
    displayCategory(result);
  }
  catch(error){
    console.log(error);
  }
  
};

const displayCategory = (categorys) => {
  const categoriesContainer = document.getElementById("category-container");

  categorys.forEach((category) => {
    const { category_id, category_name } = category;
    //  console.log(category_name)
    const li = document.createElement("li");
    li.innerHTML = `<a onclick="loadCategoryData('${category_id}')" class="text-decoration-none text-muted" href="#">${category_name}</a>`;
    categoriesContainer.appendChild(li);
  });
  toggleSpinner(true);
};

// load category data
const loadCategoryData = async (id) => {
  const url = `https://openapi.programming-hero.com/api/news/category/${id}`;
  try{
    const res = await fetch(url);
  const data = await res.json();
  displayCategoryData(data.data, id);
  }
  catch(error){
    console.log(error);
  }
};

const displayCategoryData = (news, id) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  // display no phone found
  const categoryMsg = document.getElementById("category-msg");
  categoryMsg.classList.remove("d-none");

  const categoryItems = document.getElementById("category-items");
  if (news.length === 0) {
    categoryItems.innerHTML = `No items found`;
  } else {
    const category = categoryList.find((cat) => cat.category_id === id);
    categoryItems.innerHTML = `${news.length} items for category ${category.category_name}`;
  }
  news = news.sort((news1, news2)=> {
       return news2.total_view-news1.total_view;
  });
  news.forEach((nw) => {
    const { _id, title, author, details, total_view, thumbnail_url } = nw;
    const { name, published_date, img } = author;

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "mb-3", "w-80");
    cardDiv.innerHTML = `
     <div class="row g-0">
              <div class="col-md-2">
                <img src="${thumbnail_url}" class="img-fluid rounded-start card-img" alt="...">
              </div>
              <div class="col-md-10">
                <div class="card-body ms-3">
                  <h5 class="card-title">${title}</h5>
                  <p class="card-text">${details.slice(0, 350)}</p>
                  
                  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-2">
                    <!-- author -->
                    <div class="d-flex" >
                        <img class="rounded-circle" style="width: 50px; height:50px;" src="${img}" alt="">
                        <div class="ms-3">
                            <p class="m-0">${name ? name : "No Author Name"}</p>
                            <p class="m-0 text-muted">${
                              published_date
                                ? published_date
                                : "No published Date"
                            }</p>
                        </div>
                    </div>
                    <!-- view -->
                    <div class="d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-eye"></i>
                        <span class="text-muted fw-bolder ms-3">${
                          total_view ? total_view : "No info"
                        }</span>
                    </div>

                    <!-- rating -->
                    <div class="d-flex align-items-center justify-content-center">
                    <div>
                        <i class="fa-solid fa-star-half-stroke"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                    </div>
                    </div>
                    <!-- show button -->
                   
                    <div id="show-news-btn" onclick="loadShowDetails('${_id}')" class="d-flex justify-content-end align-items-center pe-3">
                    <i class="fa-solid fa-arrow-right fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
     `;
    cardContainer.appendChild(cardDiv);
  });
  // stop spinner
  toggleSpinner(false);
};

const loadShowDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/news/${id}`;
  try{
    const res = await fetch(url);
  const data = await res.json();
  displayShowDetails(data.data[0]);
  }
  catch(error){
    console.log(error);
  }
};

const displayShowDetails = (data) => {
  const showModel = document.getElementById("showModal");
  showModel.style.display = "block";
  showModel.className = "modal fade show";
  showModel.style.backgroundColor = 'rgba(0,0,0,0.5)';
  const modalClsButton = document.getElementById("modal-cls-button");
  modalClsButton.addEventListener("click", (e) => {
    showModel.style.display = "none";
    showModel.className = "modal fade";
  });

  const {title,thumbnail_url,details} = data;
  const showNews = document.getElementById("show-News-Details");
  showNews.innerHTML = `
  <div class="card border-0 mx-auto text-center" style="width: 100%; ">
  <h5>${title}</h5>
  <div class = "w-25 mx-auto">
  <img src="${thumbnail_url}" class="card-img-top" alt="...">
  </div>
  
  <div class="card-body">
    <p>${details}</p>
  </div>
</div>
  `;
};

// display loader
const toggleSpinner = isLoading => {
    const loaderSection = document.getElementById('loader');
    if(isLoading){
        loaderSection.classList.remove('d-none');
    }
    else {
        loaderSection.classList.add('d-none');
    }
}
loadData ();

loadCategoryData('08');
