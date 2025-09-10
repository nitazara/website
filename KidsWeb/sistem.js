document.getElementById('sembunyi').addEventListener('click', function() {
  document.getElementById('ingat').style.display = 'none';
  document.body.classList.remove('no-scroll');
  document.getElementById('rest').style.display = 'none';
});


//jam = 1000 * 60 * 60
//menit = 1000 * 60
//detik = 1000

//let hours = Math.floor(diff  / hour_to_miliseconds);

//let minutes = Math.floor((diff % hour_to_miliseconds) / minute_to_miliseconds);

//let seconds = Math.floor((diff % minute_to_miliseconds) / second_to_miliseconds);

function rest(){
  setTimeout( "resting()", 40000)
}
function resting(){
  document.body.classList.add('no-scroll');
  document.getElementById('rest').style.display = 'block';
  setTimeout( "notrest()", 20000)
}
function notrest(){
  document.getElementById('rest').style.display = 'none';
  document.body.classList.remove('no-scroll');
  document.getElementById('ingat').style.display = 'block';
}  

