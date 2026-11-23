let dataAlat = [];

let chart;

const tarifListrik = 1444.7;

function tambahAlat(){

let alat =
document.getElementById("alat").value;

let daya =
parseFloat(document.getElementById("daya").value);

let jumlah =
parseFloat(document.getElementById("jumlah").value);

let jam =
parseFloat(document.getElementById("jam").value);

dataAlat.push({
alat,
daya,
jumlah,
jam
});

render();
}

function render(){

let tbody =
document.getElementById("tabelAlat");

tbody.innerHTML = "";

let totalEnergiHari = 0;

let ranking = [];

let labels = [];
let energiData = [];

let struk =
"===== STRUK KONSUMSI ENERGI =====\n\n";

dataAlat.forEach(item=>{

let energiHari =
(item.daya * item.jumlah * item.jam)/1000;

let energiBulan =
energiHari * 30;

let biaya =
energiBulan * tarifListrik;

totalEnergiHari += energiHari;

ranking.push({
nama:item.alat,
energi:energiBulan
});

labels.push(item.alat);
energiData.push(energiBulan);

tbody.innerHTML += `
<tr>
<td>${item.alat}</td>
<td>${item.daya}</td>
<td>${item.jumlah}</td>
<td>${item.jam}</td>
</tr>
`;

struk +=
`${item.alat}
Energi Bulanan : ${energiBulan.toFixed(2)} kWh
Biaya : Rp ${biaya.toLocaleString()}
-----------------------
`;

});

let energiBulan =
totalEnergiHari * 30;

let biayaBulanan =
energiBulan * tarifListrik;

let emisi =
energiBulan * 0.85;

document.getElementById("totalAlat").innerHTML =
dataAlat.length;

document.getElementById("energiHarian").innerHTML =
totalEnergiHari.toFixed(2)+" kWh";

document.getElementById("energiBulanan").innerHTML =
energiBulan.toFixed(2)+" kWh";

document.getElementById("biayaBulanan").innerHTML =
"Rp "+biayaBulanan.toLocaleString();

document.getElementById("co2").innerHTML =
emisi.toFixed(2)+
" kg CO₂ / bulan";

ranking.sort((a,b)=>b.energi-a.energi);

let rankingHTML = "";

ranking.forEach(item=>{

rankingHTML +=
`<li>${item.nama}
(${item.energi.toFixed(2)} kWh)</li>`;

});

document.getElementById("ranking").innerHTML =
rankingHTML;

struk += `

TOTAL ENERGI :
${energiBulan.toFixed(2)} kWh

TOTAL BIAYA :
Rp ${biayaBulanan.toLocaleString()}

ESTIMASI CO2 :
${emisi.toFixed(2)} kg
`;

document.getElementById("struk").textContent =
struk;

buatChart(labels,energiData);
}

function buatChart(labels,data){

if(chart){
chart.destroy();
}

chart =
new Chart(
document.getElementById("myChart"),
{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Energi Bulanan (kWh)",
data:data
}]
}
});
}

async function downloadPDF(){

const { jsPDF } = window.jspdf;

let doc =
new jsPDF();

let text =
document.getElementById("struk").textContent;

doc.text(text,10,10);

doc.save("struk_energi.pdf");
}