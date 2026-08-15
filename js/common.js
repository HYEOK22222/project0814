document.querySelector("").addEventListener('click', (e) => {
  const email = e.target.email.value;
  const password = e.target.password.value;
  const name = e.target.name.value;
  const address = e.target.address.value;
  async function saveData() {
    try {
      const response = await fetch("http://teacherdev09.kro.kr:10002/endpoint/api/users/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, address })
      });
      if (!response.ok) {
        throw new Error("서버 저장 실패");
      }
      const result = await response.json();
      console.log("서버에 저장 완료:", result);
      alert('회원가입이 완료되었습니다!')
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }
})