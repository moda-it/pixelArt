const loginBtn = document.getElementById("loginButton");
const usernameInp = document.getElementById("usernameInput");
const passwordInp = document.getElementById("passwordInput");

loginBtn.addEventListener("click", async () => {
  const username = usernameInp.value;
  const password = passwordInp.value;

  const loginData = {
    username: username,
    password: password,
  };

  const response = await fetch("http://127.0.0.1:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
  const data = await response.json();
  console.log("Відповідь від сервера:", data);

  if (data.token) {
    localStorage.setItem("pixelArttoken", data.token);
    console.log("Токен збережено в localStorage:", data.token);
    window.location.href = "index.html";
  } else {
    alert("Помилка входу: " + (data.message || "Невідомо"));
  }
});
