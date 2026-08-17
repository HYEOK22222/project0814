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

      $a.setAttribute("href", "product-detail.html");
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
