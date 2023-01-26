document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  axios
    .get("http://localhost:3000/report", {
      headers: { Authorization: token },
    })
    .then((res) =>
      // console.log(res.data.data)
      reportgenerate(res.data)
    )
    .catch((err) => console.error(err));
});

function reportgenerate(res) {
  // console.log(res.data);
  const total = res.data.total_amount;
  for (let i = 0; i < Object.keys(res.data).length - 1; i++) {
    report(res.data[i], total);
  }
  callonlast(total);
  reportdata = res.data;
  // download_csv(res.data);
}
let reportdata;
let ans = [];
function report(item1, total) {
  const t1 = document.getElementById("all-expense");

  const tr = document.createElement("tr");
  // tr.innerHTML = item1.description;

  const th = document.createElement("th");
  th.innerText = item1.createdAt.split("T")[0];
  th.scope = "row";
  const td = document.createElement("td");
  td.innerText = item1.description;

  const td2 = document.createElement("td");
  td2.innerText = item1.category;

  const td3 = document.createElement("td");
  td3.innerText = item1.amount;

  const td4 = document.createElement("td");
  td4.innerText = item1.amount;
  // let datas = [];
  ans.push({
    date: item1.createdAt.split("T")[0],
    Description: item1.description,
    Category: item1.category,
    Income: item1.amount,
    Expense: item1.amount,
    TotalA: total,
  });

  t1.append(tr);
  tr.append(th);
  tr.append(td);
  tr.append(td2);
  tr.append(td3);
  tr.append(td4);
}

function callonlast(total_amount) {
  const t1 = document.getElementById("all-expense");
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 5;
  td.className = "text-end";
  td.innerText = "Total Amount : " + total_amount;

  t1.append(tr);
  tr.append(td);

  const month = document.getElementById("monthly");
  const month_tr = document.createElement("tr");
  const month_td = document.createElement("td");
  month_td.innerText = "March";

  const month_td1 = document.createElement("td");
  month_td1.innerText = "Income : " + total_amount;

  const month_td2 = document.createElement("td");
  month_td2.innerText = "Expense : " + total_amount;

  const month_td3 = document.createElement("td");
  month_td3.innerText = "Savings : " + total_amount;

  month.append(month_tr);
  month_tr.append(month_td);
  month_tr.append(month_td1);
  month_tr.append(month_td2);
  month_tr.append(month_td3);
}

function download_csv(data) {
  // const entries = Object.entries(data);
  // console.log(entries);

  // const csvString = [
  //   ["Item ID", "Item Reference"],
  //   ...data.map((item) => [item, item.description]),
  // ];

  // var hiddenElement = document.createElement("a");
  // hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(data);
  // hiddenElement.target = "_blank";
  // hiddenElement.download = "people.csv";
  // hiddenElement.click();
  console.log("data:text/csv;charset=utf-8," + encodeURI(data));
}

const getCSV = (object) => {
  let csv = Object.entries(Object.entries(object)[0][1])
    .map((e) => e[0])
    .join(",");
  for (const [k, v] of Object.entries(object)) {
    csv += "\r\n" + Object.values(v).join(","); // \n is enough in linux to reduce the csv size
  }

  return csv;
};

document.addEventListener("click", function () {
  // console.log(ans);
  let dreport = getCSV(ans);
  download_csv(dreport);
});
