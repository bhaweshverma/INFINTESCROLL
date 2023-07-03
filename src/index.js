import "./styles.css";

const ancestorEle = document.querySelector(".ancestorElementsContainer");
const target = document.querySelector(".target");
const limit = 15;
let currentPage = 1;
let total = 0;

const getDataFromAPI = async (page, limit) => {
  const url = `https://catfact.ninja/facts?page=${page}&limit=${limit}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `An errored occured during the api call: ${response.status}`
    );
  }

  return await response.json();
};

const showData = async (data) => {
  data.forEach(function (val, index) {
    const ele = document.createElement("blockData");
    ele.classList.add("ancestorElement");
    ele.innerHTML = `${val.fact}`;
    ancestorEle.appendChild(ele);
  });
};

const hasMoreData = (page, limit, total) => {
  const startIndex = (page - 1) * limit + 1;
  return total === 0 || startIndex < total;
};

const loadData = async (page, limit) => {
  try {
    if (hasMoreData(page, limit, total)) {
      const response = await getDataFromAPI(page, limit);
      showData(response.data);
      total = response.total;
    }
  } catch (error) {
    console.log(error.message);
  } finally {
  }
};

loadData(currentPage, limit);

//Intersection Observer API
//https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
let options = {
  root: document.querySelector(".root"),
  rootMargin: "0px",
  threshold: 1
};

let observer = new IntersectionObserver((entries, options) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      currentPage++;
      loadData(currentPage, limit);
    }
  });
});
observer.observe(target);
