function graphJsonToCSV(jsonData) {
    let csv = "";
    for (const key in jsonData) {
        csv += key + ",";
        jsonData[key].forEach(value => {
            csv += value + ",";
        });
        csv = csv.slice(0, -1);
        csv += "\n";
    }
    return csv;
}

export { graphJsonToCSV };