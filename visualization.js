//var transactionFileName = "demoTransactionData.csv";
//var transactionFileName = "transactions.csv";
var transactionFileName = "Buchung;Valuta;Sender / Empfänger;IBAN / Konto-Nr.;BIC / BLZ;Buchungstext;Verwendungszweck;Kategorie;Stichwörter;Umsatz geteilt;Betrag in EUR\n27.11.2018;27.11.2018;NETFLIX.COM;922904916;12389455;Lastschrift (Einzugsermächtigung);VISA-5656262359553 13,99EUR0,0000000000 23.11.        0,00 56552265;Musik, Filme & Apps;;;-13,99\n30.10.2018;30.10.2018;Dein Vermieter;86523549;98555896;Lastschrift (Einzugsermächtigung);Miete ;Hotels & Unterkunft;;;-333,22";

var parseDate = d3.timeParse("%d.%m.%Y");

// removes german-style points in numbers and changes comma to point
function germanToNumber(germanAmount){
    return germanAmount.replace(/\./g, '').replace(',', '.');
}

var ssv = d3.dsvFormat(";");  // semicolon seperated values

var data = ssv.parse(transactionFileName, function(d){
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
    revenue:        +germanToNumber(d[ 'Umsatz geteilt' ]),
    amount:         +germanToNumber(d[ 'Betrag in EUR' ])
  };
});

console.log(data);
