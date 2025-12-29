function go() {
  const c = document.getElementById("codeInput").value;
  window.location.href = "/go/" + c;
}

async function create() {
  await fetch("/api/create", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      code: newCode.value,
      url: newUrl.value
    })
  });
  alert("Gespeichert");
}
