// Functions
ExcelTable.prototype.sum = function (args) {
  return args.reduce((a, b) => a + b)
}

ExcelTable.prototype.average = function (args) {
  return sum(args) / args.length
}

ExcelTable.prototype.min = function (args) {
  return Math.min.apply(0, args)
}

ExcelTable.prototype.max = function (args) {
  return Math.max.apply(0, args)
}

// Helpers
ExcelTable.prototype.processCellData = function (event) {
  const { target } = event
  const { value } = target

  if (value.charAt(0) === '=') {
    let result = this.executeExcelFunction(value)
    target.dataset.formula = value
    target.blur()

    if (result instanceof Error) {
      target.value = `# ${result}`
      return null
    }

    target.value = result

    return null
  }
}

ExcelTable.prototype.executeExcelFunction = function (functionString) {
  const functionArguments = this._getFunctionArguments(functionString)
  
  if (!functionArguments) {
    return new Error('Invalid fromula')
  }
  
  let [, functionName, args] = functionArguments

  if (!this.excelFunctions[functionName]) {
    return new Error(`Function: ${functionName} Does not exist`)
  }

  args = this._filterArguments(args)

  const hasErrors = args.some(arg => arg instanceof Error)

  if (hasErrors) {
    return new Error(`Formula contains wrong pointers`)
  }

  return this.excelFunctions[functionName](args)
}


// Private methods
ExcelTable.prototype._getFunctionArguments = function (funcString) {
  const regex = /^\=(\w+)\((.*\,*)\)/g

  return regex.exec(funcString)
}

ExcelTable.prototype._filterArguments = function (args) {
  return args.split(',')
    .filter(arg => arg != null)
    .map(arg => {
      arg = arg.replace(/^[ ]+|[ ]+$/g,'')
      let num = Number(arg)

      if (Number.isNaN(num)) {
        return this._getValueByPointer(arg)
      }

      return num
    })
}

ExcelTable.prototype._getValueByPointer = function (pointer) {
  pointer = pointer.toUpperCase()
  const pointedCell = document.getElementById(pointer)
  
  if (!pointedCell) {
    return new Error('Cell is not exist')
  }

  const value = pointedCell.value
  return Number(value) || 0
}