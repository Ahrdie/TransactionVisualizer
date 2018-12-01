var fileContent;
var transactionFileName = "demoTransactionData.csv";
//var transactionFileName = "transactions.csv";

d3.text(transactionFileName).then(function(text){
    //console.log(text);
    fileContent = text;
    drawData();
});

function drawData(){
  var parseDate = d3.timeParse("%d.%m.%Y");

  var ssv = d3.dsvFormat(";");  // semicolon seperated values

  var data = ssv.parse(fileContent, function(d){
    return{
      dateSend:       parseDate(d.Buchung),
      dateValidated:  parseDate(d.Valuta),
      senderReceiver: d[ 'Sender / Empfänger' ],
      iban:           +d[ 'IBAN / Konto-Nr.' ],
      bic:            +d[ 'BIC / BLZ' ],
      text:           d.Buchungstext,
      use:            d.Verwendungszweck,
      category:       d.Kategorie,
      tags:           d[ 'Stichwörter' ],
      revenue:        +d[ 'Umsatz geteilt' ].replace(",","."),
      amount:         +d[ 'Betrag in EUR' ].replace(",",".")
    };
  });

  console.log(data);

  var height = 300;
  var width = 500;
  var margin = {left:50,right:50,top:40,bottom:20};

  var max = d3.max(data, function(d){return Math.abs(d.amount);});
  var minDate = d3.min(data, function(d){return d.dateSend;});
  var maxDate = d3.max(data, function(d){return d.dateSend;});

  console.log("max: " + max + "\nminDate: " + minDate + "\nmaxDate: " + maxDate);

  var y = d3.scaleLinear()
              .domain([0,max])
              .range([height,0]);
  var x = d3.scaleTime()
              .domain([minDate,maxDate])
              .range([0,width]);
  var yAxis = d3.axisLeft(y);
  var xAxis = d3.axisBottom(x)
    .ticks(8);

  var svg = d3.select("svg")
    .attr("height",height + margin.top + margin.bottom)
    .attr("width",width + margin.left + margin.right);

  var chartGroup =
    svg.append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");

  var line = d3.line()
    .x(function(d){return x(d.dateSend);})
    .y(function(d){return y(Math.abs(d.amount));});

  chartGroup.append("path")
    .attr("stroke","#22ee22")
    .attr("stroke-width","3")
    .attr("d",line(data));

  chartGroup.append("g")
    .attr("class","x-axis")
    .attr("transform","translate(0,"+height+")")
    .call(xAxis);

  chartGroup.append("g")
    .attr("class","y-axis")
    //.attr("transform","translate(0,"+ -margin.top +")")
    .call(yAxis);
}
