import * as api from "@/api"
import { itemInfoMap } from "@/data/items"
import Vue from "vue"

export interface MarketEntry extends api.MarketEntry {
  scanID: number
  scanTime: number
}

const state = Vue.observable({
  scans: [] as api.Scan[],
  currentMarketEntries: [] as readonly MarketEntry[],
  top: [] as api.Top[],
})

let _sorted: any = null

export const getters = {
  scans() {
    return state.scans
  },
  currentMarketEntries() {
    return state.currentMarketEntries
  },
  foo() {
    const sorted =
      _sorted ??
      (_sorted = [...state.currentMarketEntries].sort((a, b) => a.realPrice - b.realPrice))
    return sorted.slice(0, 10)
  },
  currentMarketEntriesById() {
    console.log("computing currentMarketEntriesById")
    /* const m = new Map<number, MarketEntry[]>()
    for (const entry of state.currentMarketEntries) {
      let list = m.get(entry.itemID)
      if (!list) m.set(entry.itemID, (list = []))
      list.push(entry)
    } */
    const m = new Array(30000)
    for (const entry of state.currentMarketEntries) {
      let list = m[entry.itemID]
      if (!list) m[entry.itemID] = list = []
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
  state.scans = await api.fetchScans()
  const lastScan = state.scans[state.scans.length - 1]
  state.currentMarketEntries = Object.freeze(
    (await api.fetchCurrent()).map((obj) =>
      Object.freeze({
        ...obj,
        scanID: lastScan.id,
        scanTime: lastScan.time,
      }),
    ),
  )
  console.log(
    "can't get info:",
    state.currentMarketEntries.filter((x) => !itemInfoMap.get(x.itemID)),
  )
  state.top = await api.fetchTop()
}
init()
