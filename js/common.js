document.addEventListener("DOMContentLoaded", async () => {
  const productListEl = document.getElementById("product-list");

  try {
    // 1. 전체 상품 목록 주소로 수정, GET 방식은 body가 필요 없음!
    const response = await fetch(
      "http://teacherdev09.kro.kr:10002/endpoint/api/products?size=50",
    );

    const result = await response.json();

    // 2. 응답 데이터 확인
    const products = result.data.content;

    if (!result.success || !products) {
      throw new Error("상품 정보가 없습니다");
    }
    for (let i = products.length - 1; i >= 0; i--) {
      const $a = document.createElement("a");
      const $div = document.createElement("div");
      const $h4 = document.createElement("h4");
      const $p = document.createElement("p");

      $a.href = `product-detail.html?id=${products[i].id}`;
      $div.setAttribute("class", "info");

      $h4.textContent = products[i].name;
      $p.textContent = products[i].price;
      $div.append($h4, $p);
      $a.appendChild($div);
      document.getElementById("product-list").appendChild($a);
    }
  } catch (error) {
    alert(error.message);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const productListEl = document.getElementById("product-list");
  const searchInput = document.querySelector(".searchbox input");
  const searchBtn = document.querySelector(".searchbox button");
  const categorySelect = document.getElementById("category-select");

  // 1. 로딩 화면 & 결과 없음 UI 만들기 (기존 목록 부모 요소에 추가)
  const loadingMsg = document.createElement("div");
  loadingMsg.innerHTML = "<h3 style='color: #fff;'>⏳ 검색 중입니다...</h3>";
  loadingMsg.style.cssText =
    "width: 100%; text-align: center; padding: 50px; display: none;";

  const noResultMsg = document.createElement("div");
  noResultMsg.innerHTML =
    "<h3 style='color: #888;'>❌ 조건에 맞는 상품이 없습니다.</h3>";
  noResultMsg.style.cssText =
    "width: 100%; text-align: center; padding: 50px; display: none;";

  // 리스트 컨테이너 바로 위에 메시지 요소들 몰래 끼워넣기
  productListEl.parentNode.insertBefore(loadingMsg, productListEl);
  productListEl.parentNode.insertBefore(noResultMsg, productListEl);

  let allProducts = []; // 검색용 데이터를 따로 보관할 변수

  // 2. 카테고리 세팅 & 검색용 데이터 백그라운드 로드
  try {
    const res = await fetch(
      "http://teacherdev09.kro.kr:10002/endpoint/api/products?size=50",
    );
    const result = await res.json();

    if (result.success && result.data && result.data.content) {
      allProducts = result.data.content;

      // 카테고리 중복 제거 후 select 태그에 옵션 추가
      const categories = [
        ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
      ];
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        if (categorySelect) categorySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("검색용 데이터 로드 실패", error);
  }

  // 3. 검색된 결과만 화면에 다시 그리는 함수 (기존 로직과 똑같이 생성)
  function renderFilteredProducts(filtered) {
    loadingMsg.style.display = "none"; // 로딩 끄기
    productListEl.innerHTML = ""; // 기존 그려진 목록 싹 비우기

    // 결과가 0개면 '결과 없음' 메시지 띄우기
    if (filtered.length === 0) {
      noResultMsg.style.display = "block";
      productListEl.style.display = "none";
      return;
    }

    // 결과가 있으면 리스트 보이고 메시지 숨기기
    noResultMsg.style.display = "none";
    productListEl.style.display = "grid"; // (또는 flex 등 원래 속성)

    // 기존 코드의 태그 생성 로직(역순) 그대로 재사용!
    for (let i = filtered.length - 1; i >= 0; i--) {
      const $a = document.createElement("a");
      const $div = document.createElement("div");
      const $h4 = document.createElement("h4");
      const $p = document.createElement("p");

      $a.href = `product-detail.html?id=${filtered[i].id}`;
      $div.setAttribute("class", "info");

      $h4.textContent = filtered[i].name;
      $p.textContent = filtered[i].price;

      $div.append($h4, $p);
      $a.appendChild($div);
      productListEl.appendChild($a);
    }
  }

  // 4. 검색 버튼이나 엔터를 쳤을 때 실행되는 필터링 로직
  function executeSearch() {
    // 검색 시작할 때 기존 목록 숨기고 로딩 화면 보여주기
    productListEl.style.display = "none";
    noResultMsg.style.display = "none";
    loadingMsg.style.display = "block";

    // 검색하는 느낌을 주기 위해 0.3초(300ms) 딜레이 후 결과 띄우기
    setTimeout(() => {
      const keyword = searchInput.value.toLowerCase().trim();
      const selectedCategory = categorySelect ? categorySelect.value : "";

      const filtered = allProducts.filter((product) => {
        const matchKeyword = product.name.toLowerCase().includes(keyword);
        const matchCategory =
          selectedCategory === "" || product.category === selectedCategory;
        return matchKeyword && matchCategory;
      });

      renderFilteredProducts(filtered);
    }, 300);
  }

  // 5. 사용자가 액션을 취할 때 검색 기능 발동!
  if (searchBtn) searchBtn.addEventListener("click", executeSearch);
  if (categorySelect) categorySelect.addEventListener("change", executeSearch);
  if (searchInput) {
    searchInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") executeSearch();
    });
  }
});
