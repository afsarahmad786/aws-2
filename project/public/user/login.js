const btn = document.getElementById("lgn");
const msg = document.getElementsByClassName("user-not-found");

// const name = document.getElementById("name").value;
btn.addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const mess = document.getElementById("msg");

  axios
    .post("http://52.193.197.158:3000/login", {
      email: email,
      password: password,
    })
    .then((response) => {
      const messages = response.data["message"];
      const suc = response.data["success"];
      if (suc == true) {
        alert(messages + " " + response.data["status"]);
        localStorage.setItem("token", response.data.token);
        location.href = "expense.html";
      } else {
        alert(messages + " " + response.data["status"]);
      }
      // mesage.innerHTML = "Success";
      // console.log(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
});
