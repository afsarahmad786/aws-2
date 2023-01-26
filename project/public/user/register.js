const mesage = document.getElementById("msg");
const msg = document.getElementsByClassName("user-not-found");

const reg = document.getElementById("regsi");

reg.addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  axios
    .post("http://52.193.197.158:3000/register", {
      email: email,
      password: password,
      name: name,
    })
    .then((response) => {
      // alert("dddddddddd");
      console.log(response);
      const messages = response.data["message"];
      const suc = response.data["success"];
      if (suc == true) {
        alert(messages);
      } else {
        alert(messages);
      }
      // mesage.innerHTML = "Success";
      // console.log(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
});
