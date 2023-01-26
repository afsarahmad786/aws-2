const btn = document.getElementById("forgo");

// const name = document.getElementById("name").value;
btn.addEventListener("click", function () {
  const email = document.getElementById("email").value;

  axios
    .post("http://localhost:3000/password/forgotpassword", {
      email: email,
    })
    .then((response) => {
      console.log(response);

      alert(response.data.message + " to " + response.data.emailId);
    })
    .catch((err) => {
      console.log(err);
    });
});
