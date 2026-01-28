let visitas = JSON.parse(localStorage.getItem("visitas")) || [];
let clientes = {};

document.getElementById("uploadClientes").addEventListener("change", function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const linhas = reader.result.split("\n");
    linhas.slice(1).forEach(l => {
      const [sap, nome] = l.split(",");
      if (sap && nome) clientes[sap.trim()] = nome.trim();
    });
  };

  reader.readAsText(file);
});

sap.addEventListener("input", () => {
  cliente.value = clientes[sap.value] || "";
});

function registrarVisita() {
  visitas.push({
    sap: sap.value,
    cliente: cliente.value,
    data: data.value,
    distancia: Number(distancia.value || 0),
    tipo: tipo.value,
    motivo: motivo.value
  });

  localStorage.setItem("visitas", JSON.stringify(visitas));
  renderizar();
}

function renderizar() {
  const filtro = filtroMes.value;
  let filtradas = visitas;

  if (filtro) {
    filtradas = visitas.filter(v => v.data.startsWith(filtro));
  }

  let total = filtradas.length;
  let presencial = filtradas.filter(v => v.tipo === "Presencial").length;
  let online = filtradas.filter(v => v.tipo === "Online").length;
  let km = filtradas.reduce((s, v) => s + v.distancia, 0);

  totalVisitas.innerText = total;
  totalPresencial.innerText = presencial;
  totalOnline.innerText = online;
  totalKm.innerText = km;

  visitasDiv.innerHTML = "";

  filtradas.forEach(v => {
    visitasDiv.innerHTML += `
      <div class="semana">
        <strong>${v.cliente}</strong><br>
        ${v.data} | ${v.tipo} | ${v.distancia} km<br>
        ${v.motivo}
      </div>
    `;
  });
}

function exportarCSV() {
  let csv = "SAP,Cliente,Data,Distância,Tipo,Motivo\n";
  visitas.forEach(v => {
    csv += `${v.sap},${v.cliente},${v.data},${v.distancia},${v.tipo},${v.motivo}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "visitas.csv";
  link.click();
}

renderizar();
