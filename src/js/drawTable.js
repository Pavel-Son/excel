ExcelTable.prototype.drawTable = function () {
  this.tableMap.columns = this._getColumnsArray(this.columns)
  this.tableMap.rows = this._getRowsArray(this.rows)

  this._drawTitleRow()

  for (let column = 0; column < this.tableMap.rows.length; column++) {
    this._drawRow(column)
  }
}

ExcelTable.prototype.onAddColumnClick = function (event) {
  if (!event.target.classList.contains('addColumn')) {
    return;
  }

  const currentX = this.tableMap.columns.length
  const rows = this.table.getElementsByTagName('tr')

  this.tableMap.columns = this._getColumnsArray(currentX + 1)

  this._drawTitleCell(currentX)

  for (let y = 0; y < this.tableMap.rows.length; y++) {
    let rowToInsert = rows[y + 1]
    let rowName = this.tableMap.columns[currentX]
    this._drawCell(currentX, rowToInsert, rowName)
  }
}

ExcelTable.prototype.onAddRowClick = function () {
  if (!event.target.classList.contains('addRow')) {
    return;
  }

  const currentColumnIndex = this.tableMap.rows.length

  this.tableMap.rows = this._getRowsArray(currentColumnIndex + 1)
  this._drawRow(currentColumnIndex)
}

// Private functions

ExcelTable.prototype._drawTitleRow = function () {
  const titleRow = document.createElement('tr')
  const emptyTitle = document.createElement('td')

  emptyTitle.classList.add('cell')

  titleRow.appendChild(emptyTitle)
  this.table.appendChild(titleRow)

  for (let x = 0; x < this.tableMap.columns.length; x++) {
    this._drawTitleCell(x, titleRow)
  }
}

ExcelTable.prototype._drawRow = function (rowIndex) {
  const rowName = this.tableMap.rows[rowIndex]
  const newRow = document.createElement('tr')
  const rowTitleHTML = `<td class="cell title">${rowName}</td>`

  newRow.innerHTML = rowTitleHTML
  this.table.appendChild(newRow)

  for (let column = 0; column < this.tableMap.columns.length; column++) {
    this._drawCell(column, newRow, rowName)
  }
}

ExcelTable.prototype._drawTitleCell = function (columnIndex, row) {
  const titleRow = row || this.table.getElementsByTagName('tr')[0]
  const titleCell = document.createElement('td')
  const columnName = this.tableMap.columns[columnIndex];

  titleCell.classList.add('cell', 'title')
  titleCell.innerHTML = `
    ${columnName}
    <span
      class="resize-bar column"
      data-column="${columnName}"
    ></span>
  `

  titleRow.appendChild(titleCell)
}

ExcelTable.prototype._drawCell = function (columnIndex, row, rowName) {
  const columnName = this.tableMap.columns[columnIndex]
  const newCell = document.createElement('td')

  newCell.classList.add('cell')

  const inputHTML = `<input
    id="${columnName + rowName}"
    data-column="${columnName}"
    data-row="${rowName}"
  >`
  
  newCell.innerHTML = inputHTML

  row.appendChild(newCell)
}

ExcelTable.prototype._getRowsArray = function (rows) {
  let rowHeader = []
  
  for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {
    rowHeader.push(rowIndex)
  }

  return rowHeader
}

ExcelTable.prototype._getColumnsArray = function(n) {
  let result = []

  const indexA = "A".charCodeAt(0)
  const indexZ = "Z".charCodeAt(0)

  let alphabetLength = indexZ - indexA + 1
  const repeatNum = Math.floor(n / alphabetLength)

  let startIndex = 0
  let startString = ""
  let string = ""

  while (startIndex <= repeatNum) {
    if (startIndex > 0) {
      startString = String.fromCharCode(indexA + startIndex - 1)
    }

    if (startIndex === repeatNum) {
      alphabetLength = n % alphabetLength
    }

    for (let i = 0; i < alphabetLength; i++) {
      string = String.fromCharCode(indexA + i)

      result.push(startString + string)
    }
    startIndex++
  }

  return result
}
