$(document).ready(function (){
  updateTables();
  setInterval(function(){ updateTables(); }, 3000);
});

function returnTeamHTML(teamName, vals) {
  const valsToRows = () => {
    let s = '<tr>';
    for(let val of vals) {
      s +=`<td>${val.name}</td>`
      s +=`<td>${val.ip}</td>`
    }
    s += '</tr>'
    return s;
  }
  const html = `
    <table>
      <tr><th>team</th><th>${teamName}</th></tr>
      <tr><th>Name</th><th>Server IP</th></tr>
      ${valsToRows()}
    </table>`;
  return html;
}

function tablesHTML(resp) {
  let html = '';
  for(let key in resp) {
    html += returnTeamHTML(key, resp[key]);
    html += '<br/>';
  }
  return html;
}

function updateTables() {
  $.ajax({                                      
    url: 'list',              
    type: 'get',          
    success: function(resp) { console.log(resp); $("#tables").html(tablesHTML(resp));  } //Change to this
 });
}