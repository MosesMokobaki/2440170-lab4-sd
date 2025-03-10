document.getElementById("searchButton").addEventListener("click", () => {
    const countryName = document.getElementById("countryInput").value.trim();
    
    if (countryName === "") {
        alert("Please enter a country name.");
        return;
    }

    fetchCountryData(countryName);
});

async function fetchCountryData(country) {
    const url = `https://restcountries.com/v3.1/name/${country}?fullText=true`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        displayCountryInfo(data[0]);
    } catch (error) {
        document.getElementById("country-info").innerHTML = `<p>Error: ${error.message}</p>`;
        document.getElementById("bordering-countries").innerHTML = "";
    }
}

function displayCountryInfo(country) {
    const countryInfoSection = document.getElementById("country-info");
    const borderingCountriesSection = document.getElementById("bordering-countries");

    countryInfoSection.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="200">
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
    `;

    if (country.borders) {
        fetchBorderingCountries(country.borders);
    } else {
        borderingCountriesSection.innerHTML = "<p>No bordering countries.</p>";
    }
}

async function fetchBorderingCountries(borderCodes) {
    const url = `https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching neighboring countries.");

        const data = await response.json();
        displayBorderingCountries(data);
    } catch (error) {
        document.getElementById("bordering-countries").innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayBorderingCountries(countries) {
    const borderingCountriesSection = document.getElementById("bordering-countries");
    borderingCountriesSection.innerHTML = "<h3>Bordering Countries:</h3>";

    countries.forEach(country => {
        const countryElement = document.createElement("div");
        countryElement.innerHTML = `
            <p><strong>${country.name.common}</strong></p>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">
        `;
        borderingCountriesSection.appendChild(countryElement);
    });
}
