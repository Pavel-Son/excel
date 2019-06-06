ExcelTable.prototype.onMousedown = function (event) {
  const { target } = event

  if (!target.classList.contains('resize-bar')) {
    return
  }

  if (target.classList.contains('column')) {
    this.onResizeColumnClick(event)
  }

  if (target.classList.contains('row')) {
    this.onResizeRowClick(event)
  }
}

ExcelTable.prototype.onMousemove = function (event) {
  if (this.focusedColumnResize) {
    this.onResizeColumn(event);
  }

  if (this.focusedRowResize) {
    this.onResizeRow(event);
  }
}

ExcelTable.prototype.onMouseup = function () {
  this.focusedColumnResize = null
  this.focusedRowResize = null
}

ExcelTable.prototype.onResizeColumnClick = function(event) {
  const { target, pageX } = event
  if (!target.classList.contains('resize-bar', 'column')) {
    return
  }
  
  const { column } = target.dataset;
  const startWidth = document.querySelector(`.cell.title[data-column="${column}"]`).clientWidth;

  this.focusedColumnResize = {
    column,
    startX: pageX,
    startWidth,
  }
}


ExcelTable.prototype.onResizeColumn = function (event) {
  const { column, startX, startWidth } = this.focusedColumnResize;
  const columnCell = document.querySelector(`.cell.title[data-column="${column}"]`)
  
  let newWidth = startWidth + (event.pageX - startX);

  if ( newWidth < this.columnMinWidth ) {
    return
  }
  columnCell.style.width = `${newWidth}px`
}



ExcelTable.prototype.onResizeRowClick = function(event) {
  const { target, pageY } = event

  if (!target.classList.contains('resize-bar', 'row')) {
    return
  }

  const { row } = target.dataset;
  const startHeight = document.querySelector(`.cell.title[data-row="${row}"]`).clientHeight;

  this.focusedRowResize = {
    row,
    startY: pageY,
    startHeight,
  }
}


ExcelTable.prototype.onResizeRow = function (event) {
  const { row, startY, startHeight } = this.focusedRowResize;
  const rowCell = document.querySelector(`.cell.title[data-row="${row}"]`)
  
  let newHeight = startHeight + (event.pageY - startY);

  if ( newHeight < this.rowMinHeight ) {
    return
  }
  rowCell.style.height = `${newHeight}px`
}
