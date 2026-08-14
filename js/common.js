document
  .querySelector("#login-container>form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll("#login-container input");
    const userInfo = {
      email: inputs[0].value,
      password: inputs[1].value,
    };
    const response = await fetch(
      "http://teacherdev09.kro.kr:10002/endpoint/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      },
    );
    if (!response.ok) {
      throw new Error("인증실패 : " + resposne.status);
    }
    const data = await response.json();
    console.log(data);
    if (data.success) {
      const user = data.data.user;
      // localStorage, sessionStorage -> 토큰저장
      document.querySelector("#login-container form").style.display = "none";
      const $btn = document.createElement("button");
      $btn.innerText = "내정보보기";
      $btn.addEventListener("click", async (e) => {
        const response = await fetch(
          "http://teacherdev09.kro.kr:10002/endpoint/api/users/me",
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer " +
                "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc4NjY5NDA1MywiZXhwIjoxNzg2Njk3NjUzfQ.XTFpWcqsW-wf8GiJfPum_gyYED5utH631B-BIfJ-FDbzqabuVR241weplCvlvIw4sPLIs3zzgTp1r-tbiBJjxA",
            },
          },
        );
        const d = await response.json();
        console.log(d);
      });
      document.querySelector("#login-container").appendChild($btn);
    }
  });
