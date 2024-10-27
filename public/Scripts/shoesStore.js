document.getElementById("filter").addEventListener("change", function () {
  const selectedFilter = this.value;
  const genderFilter = document.getElementById("genderFilter").value;
  const currentPage =
    new URLSearchParams(window.location.search).get("page") || 1;

  window.location.href = `/store?page=${currentPage}&priceFilter=${selectedFilter}&genderFilter=${genderFilter}`;
});

document.getElementById("genderFilter").addEventListener("change", function () {
  const selectedGender = this.value;
  const priceFilter = document.getElementById("filter").value;
  const currentPage =
    new URLSearchParams(window.location.search).get("page") || 1;

  window.location.href = `/store?page=${currentPage}&priceFilter=${priceFilter}&genderFilter=${selectedGender}`;
});

const getExchangeRateILS = async (req, res) => {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/9f9809c90629cbd5096bc36d/latest/USD`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const result = await response.json();

  if (response.ok) {
    return result.conversion_rates.ILS;
  } else {
    return null;
  }
};

const convertPriceCurrency = async (code = 1) => {
  const shoesContainerEl = document.querySelector(".shoes-container");
  const rate = parseFloat((await getExchangeRateILS()).toFixed(3));
  const coinSymbol = document.querySelector(".coinSymbol")
  shoesContainerEl.querySelectorAll(".shoe").forEach((shoe) => {
    const priceEl = shoe.children[3].children[1];
    const priceVal = parseFloat(priceEl.textContent.replace(/[^\d.]/g, ""));
    let newPrice = 0;
    if (!isNaN(priceVal)) {
      if (code === 1) {
        coinSymbol.textContent="ILS"
        newPrice = (priceVal * rate).toFixed(2);
        priceEl.textContent = `₪${newPrice}`;
      } else {
        coinSymbol.textContent="USD"
        newPrice = (priceVal / rate).toFixed(2);
        priceEl.textContent = `$${newPrice}`;
      }
    }
  });
};
