document.addEventListener('DOMContentLoaded',function(){
  const select = document.getElementById('sortSelect');
  const list = document.getElementById('folderList');
  function sortList(mode){
    const items = Array.from(list.querySelectorAll('.folder'));
    let sorted;
    if(mode==='newest'){
      sorted = items.sort((a,b)=> new Date(b.dataset.date) - new Date(a.dataset.date));
    } else if(mode==='oldest'){
      sorted = items.sort((a,b)=> new Date(a.dataset.date) - new Date(b.dataset.date));
    } else {
      sorted = items.sort((a,b)=> a.dataset.title.localeCompare(b.dataset.title));
    }
    // re-append in new order
    sorted.forEach(i=> list.appendChild(i));
  }
  select.addEventListener('change',e=> sortList(e.target.value));
  // initialize
  sortList(select.value);
});