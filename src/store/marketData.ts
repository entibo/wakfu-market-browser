import { CurrentEntry, fetchCurrent, fetchScans, fetchTop, Scan, Top } from "@/api"
import Vue from "vue"

export interface MarketEntry extends CurrentEntry {
  scanID: number
  scanTime: number
}

const state = Vue.observable({
  scans: [] as Scan[],
  currentMarketEntries: [] as readonly MarketEntry[],
  top: [] as Top[],
})

export const getters = {
  scans() {
    return state.scans
  },
  currentMarketEntries() {
    return state.currentMarketEntries
  },
  currentMarketEntriesById() {
    console.log("computing currentMarketEntriesById")
    const m = new Map<number, MarketEntry[]>()
    for (const entry of state.currentMarketEntries) {
      let list = m.get(entry.itemID)
      if (!list) m.set(entry.itemID, (list = []))
      list.push(entry)
    }
    return m
  },
  top() {
    return state.top
  },
}
export const actions = {}

export async function init() {
  state.scans = await fetchScans()
  const lastScan = state.scans[state.scans.length - 1]
  state.currentMarketEntries = Object.freeze(
    (await fetchCurrent()).map((obj) => ({
      ...obj,
      scanID: lastScan.id,
      scanTime: lastScan.time,
    })),
  )
  state.top = await fetchTop()
}
init()
