import * as csv from "@/csv"

export const fetchCSV = (url: string) =>
  fetch(url)
    .then((resp) => resp.text())
    .then(csv.decode)

export interface Scan {
  id: number
  time: number
  entryCount: number
  playerCount: number
}
export async function fetchScans(): Promise<Scan[]> {
  return fetchCSV("https://entibo.github.io/wakfu-market-data/pandora/scans.csv")
}

export interface Top {
  username: string
  entryCount: number
}
export async function fetchTop(): Promise<Top[]> {
  return fetchCSV("https://entibo.github.io/wakfu-market-data/pandora/top.csv")
}

interface MarketEntry {
  username: string
  added: number
  price: number
  duration: number
  amount: number
  initAmount: number
  stack: number
  elementsDMG: number
  elementsRES: number
  subSub1: number
  subSub2: number
  subCharges: number
  subSlot1Type: number
  subSlot1LVL: number
  subSlot1Effect: number
  subSlot2Type: number
  subSlot2LVL: number
  subSlot2Effect: number
  subSlot3Type: number
  subSlot3LVL: number
  subSlot3Effect: number
  subSlot4Type: number
  subSlot4LVL: number
  subSlot4Effect: number
  petLVL: number
  petHP: number
  petName: string
  petLastAte: number
  makaLVL: number
}

export interface CurrentEntry extends MarketEntry {
  itemID: number
}
export async function fetchCurrent(): Promise<CurrentEntry[]> {
  return fetchCSV("https://entibo.github.io/wakfu-market-data/pandora/current.csv")
}

const dateToPage = (date: Date) =>
  date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0")
const dateRewindMonths = (date: Date, months: number) => {
  date.setMonth(date.getMonth() - months)
  return date
}

abstract class PagedFetcher<T> {
  data: T[] = []
  hasMoreData = true
  fetchedPages = new Set<string>()
  indexPromise: Promise<string[]>
  constructor(public dir: string, public months = 0) {
    this.indexPromise = fetchCSV(dir + "index.csv").then((list) =>
      list.map((o) => o.filename).reverse(),
    )
  }
  async fetch(): Promise<{ data: T[]; hasMoreData: boolean }> {
    try {
      const index = await this.indexPromise
      const date = new Date()
      const pageEnd = dateToPage(dateRewindMonths(date, this.months))
      for (const [i, page] of index.entries()) {
        if (this.fetchedPages.has(page)) continue
        const data = (await fetchCSV(this.dir + page + ".csv")) as T[]
        this.data = this.data.concat(data)
        if (page === pageEnd) break
        if (i === index.length - 1) {
          this.hasMoreData = false
        }
      }
      return {
        data: this.data,
        hasMoreData: this.hasMoreData,
      }
    } catch (e) {
      console.log(e)
      this.hasMoreData = false
      return {
        data: [],
        hasMoreData: this.hasMoreData,
      }
    }
  }
}

export interface ArchivedEntry extends MarketEntry {
  scanID: number
}

class ArchivedEntryFetcher extends PagedFetcher<ArchivedEntry> {
  constructor(itemID: number, months = 0) {
    const url = `https://entibo.github.io/wakfu-market-data/pandora/archive/${itemID}/entries/`
    super(url, months)
  }
}

export interface PartialSale {
  scanID: number
  amount: number
  price: number
}

class PartialSaleFetcher extends PagedFetcher<PartialSale> {
  constructor(itemID: number, months = 0) {
    const url = `https://entibo.github.io/wakfu-market-data/pandora/archive/${itemID}/sales/`
    super(url, months)
  }
}
