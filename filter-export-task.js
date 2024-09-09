const XLSX = require('xlsx');
const fs = require('fs');

async function getFilteredBranches() {
  // Load the Excel file
  // Ubah dengan file excel mu
  let file;
  try {
    file = await fs.readFileSync('LIST_TASKss.xlsx');
  } catch (error) {
    console.log('⚠️  Error reading the file: LIST_TASK.xlsx')
    process.exit(1)
  }

  // Parse the Excel file
  const workbook = XLSX.read(file, { type: 'buffer' });

  // Get the first sheet name
  const sheetName = workbook.SheetNames[0];

  // Get the worksheet data
  const worksheet = workbook.Sheets[sheetName];

  // Convert worksheet to JSON, starting from row 6
  const data = XLSX.utils.sheet_to_json(worksheet, {
    range: 5 // Skips the first 5 rows, starts at row 6 (zero-indexed)
  });

  const filterByPullRequerstCol = data.filter((item) => item.Column == 'Pull Request');
  const mapPullRequerstCol = filterByPullRequerstCol.map((item) => ({
    'column': item.Column,
    'title': item.Title,
    'code': item['Task Code'],
  }));

  return mapPullRequerstCol;
}

module.exports = {
  getFilteredBranches
};