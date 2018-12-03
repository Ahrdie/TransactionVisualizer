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

  function convertFromGermanNumber(germanNumber){
    return germanNumber.replace(".","").replace(",",".");
}

function CheckForCorruptAmounts(){
  var corruptDatapoints = new Array();
  for (var i = 0; i < data.length;i++ ){
    if(Number.isNaN(data[i].amount)){
      console.log("Datapoint corrupt"+ i +": " + data[i].amount + "\t\t\t" + data[i].dateSend);
      corruptDatapoints.push(i);
    }
  }

  for(var i = corruptDatapoints.length-1; i >= 0; i--){
    console.log("splicing datapoint " + corruptDatapoints[i]);
    data.splice(corruptDatapoints[i],1);
  }
}

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
      revenue:        +convertFromGermanNumber(d[ 'Umsatz geteilt' ]),
      amount:         +convertFromGermanNumber(d[ 'Betrag in EUR' ])
    };
  });

  CheckForCorruptAmounts();

  var height = 300;
  var width = 800;
  var margin = {left:50,right:50,top:40,bottom:20};

  var max = d3.max(data, function(d){return Math.abs(d.amount);});
  var minDate = d3.min(data, function(d){return d.dateSend;});
  var maxDate = d3.max(data, function(d){return d.dateSend;});

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
