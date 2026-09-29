export type ProcessTableRow = {
  pid: number
  ppid: number
  pgid: number
  /** ps lstart text, kept verbatim. Delayed SIGKILL additionally requires an
   * unambiguous capture-second boundary and matching pgid. */
  command?: string
  startedAt: string
}

export function parseProcessTable(psOutput: string): ProcessTableRow[] {
  const rows: ProcessTableRow[] = []
  for (const line of psOutput.split('\n')) {
    // Keep lstart separate from the untruncated command used for ownership checks.
    const match = line.match(
      /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\w{3}\s+\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}\s+\d{4})(?:\s+(.*?))?\s*$/
    )
    if (!match) {
      continue
    }
    rows.push({
      pid: Number(match[1]),
      ppid: Number(match[2]),
      pgid: Number(match[3]),
      startedAt: match[4],
      ...(match[5] ? { command: match[5] } : {})
    })
  }
  return rows
}

