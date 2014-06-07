module.exports.getRandom = (list) => {
  return list[Math.floor(Math.random() * list.length)]
}

module.exports.noop = () => {}

module.exports.isTypeCombo = (first, second, prop1, prop2) => {
  if (!first || !second || !prop1 || !prop2) return false

  var case1 = (first === prop1 && second === prop2)
  var case2 = (first === prop2 && second === prop1)

  return case1 || case2
}
