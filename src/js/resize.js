ExcelTable.prototype.onMousedown = function (event) {
  const { target } = event

  if (!target.classList.contains('resize-bar')) {
    return
  }

  if (target.classList.contains('column')) {
    this.onResizeColumnClick(event)
  }
}

ExcelTable.prototype.onMousemove = function (event) {
  if (this.focusedColumnResize) {
    const { column, startX } = this.focusedColumnResize;

    let newWidth = this.columnMinWidth + (event.pageX - startX);
    document.querySelector(`.cell.title[data-column="${column}"]`).style.width = `${newWidth}px`
  }

  if (this.focusedRowResize) {

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

  this.focusedColumnResize = {
    column: target.dataset.column,
    startX: pageX
  }
}