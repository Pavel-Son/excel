class ExcelTable {
  constructor(selector, { columns, rows }) {
    this.columns = columns || 10
    this.rows = rows || 10

    this.tableMap = {
      columns: [],
      rows: [],
    }

    this.initTable(selector)
  }

  initTable (selector) {
    const tableWrapper = document.querySelector(selector);
    tableWrapper.classList.add('spreadsheet-wrapper');
    
    tableWrapper.innerHTML = `<table class="spreadsheet"></table>\n
      <button id="addRow">+</button>\n
      <button id="addColumn">+</button>`
   
    this.excelFunctions = {
      sum: this.sum,
      average: this.average,
      min: this.min,
      max: this.max,
    }
  
    this.table = tableWrapper.getElementsByTagName('table')[0]

    this.drawTable(this.columns, this.rows)
  
    this.table.addEventListener('keydown', this.onInputKeydown.bind(this))
    this.table.addEventListener('focusout', this.onInputFocusOut.bind(this))
    this.table.addEventListener('focusin', this.onInputFocusIn.bind(this))
  
    document.getElementById('addColumn').addEventListener('click', this.onAddColumnClick)
    document.getElementById('addRow').addEventListener('click', this.onAddRowClick)
  }
  
  onInputKeydown (event) {
    const { key, which, keyCode, target } = event
  
    // Escape pressed
    if (key == 'Escape' || which == 27 || keyCode == 27) {
      target.dataset.formula = null
      target.value = null
      target.blur()
      return null
    }
  
    // Enter pressed
    if (key === "Enter" || which === 13 || keyCode === 13) {
      this.processCellData(event)
    }
  }
  
  onInputFocusOut (event) {
    // it might happend when you accept values in form
    if (!event.relatedTarget) {
      return
    }
    return this.processCellData(event)
  }
  
  onInputFocusIn (event) {
    const { target } = event
    const { formula } = target.dataset
  
    if (formula && formula !== 'null') {
      target.value = formula
    }
  }
}