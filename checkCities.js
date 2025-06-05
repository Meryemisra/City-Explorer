// checkCities.js
// cityRoutes.js dosyanızdaki cities nesnesini buraya yapıştırın
const cities = {
  // ... cities nesnesini buraya ekleyin ...
};

const requiredFields = ["name", "description", "location", "population", "attractions"];

for (const [cityKey, cityObj] of Object.entries(cities)) {
  requiredFields.forEach(field => {
    if (
      !cityObj.hasOwnProperty(field) ||
      cityObj[field] === undefined ||
      cityObj[field] === null ||
      (typeof cityObj[field] === "string" && cityObj[field].trim() === "") ||
      (Array.isArray(cityObj[field]) && cityObj[field].length === 0)
    ) {
      console.log(`${cityKey} şehrinde '${field}' alanı eksik veya boş!`);
    }
  });
} 