  document.getElementById('filter').addEventListener('change', function() {
  const selectedFilter = this.value;
  const genderFilter = document.getElementById('genderFilter').value;
  const currentPage = new URLSearchParams(window.location.search).get('page') || 1;
  
  window.location.href = `/store?page=${currentPage}&priceFilter=${selectedFilter}&genderFilter=${genderFilter}`;
});

document.getElementById('genderFilter').addEventListener('change', function() {
  const selectedGender = this.value;
  const priceFilter = document.getElementById('filter').value;
  const currentPage = new URLSearchParams(window.location.search).get('page') || 1;
  
  window.location.href = `/store?page=${currentPage}&priceFilter=${priceFilter}&genderFilter=${selectedGender}`;
});