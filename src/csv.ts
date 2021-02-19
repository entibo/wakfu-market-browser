export function decode(str: string) {
  const rows = []
  const [firstLine, ...lines] = str.split("\n")
  const columnNames = firstLine.split(",")
  for (const line of lines) {
    if (line === "") continue
    const values = line.split(",")
    const obj = {} as any
    for (const [idx, name] of columnNames.entries()) {
      if (idx >= values.length) break
      obj[name] = values[idx] === "" ? undefined : JSON.parse(values[idx])
    }
    rows.push(obj)
  }
  return rows
}
