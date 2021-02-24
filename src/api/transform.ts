import { itemInfoMap } from "@/data/items"
import { CSVMarketEntryWithItemID } from "."

enum Element {
  FIRE = 1,
  WATER,
  EARTH,
  AIR,
}

export interface MarketEntry extends CSVMarketEntryWithItemID {
  realLevel: number
  realStack: number
  realAmount: number
  realInitAmount: number
  realPrice: number
  realPriceWhole: string
  realPriceDecimals: string
  expirationDate: number
  elements?: {
    damage: Element[]
    resistance: Element[]
  }
  enchantment?: {
    charges: number
    slots: EnchantmentSlot[]
    sublimations: number[]
  }
}
interface EnchantmentSlot {
  type: number
  color: string
  level: number
  effectID: number
}

const slotShardToLevelTable: Partial<Record<number, number>> = {
  0: 0,
  1: 1,
  3: 2,
  7: 3,
  15: 4,
  31: 5,
  63: 6,
  127: 7,
  319: 8,
  895: 9,
  3199: 10,
}
function slotLevel(shards: number) {
  return slotShardToLevelTable[shards] ?? 0
}
const slotTypeToColorTable: Partial<Record<number, string>> = [
  "old",
  "red",
  "green",
  "blue",
  "white",
]
function slotColor(slotType: number) {
  return slotTypeToColorTable[slotType] ?? ""
}

export function formatPrice(x: number | string) {
  const [whole, decimals] = x.toString().split(".")
  const digits = [...whole].reverse()
  const result = []
  for (let i = 0; i < digits.length; i++) {
    result.push(digits[i])
    if (i < digits.length - 1 && (i + 1) % 3 === 0) result.push(" ")
  }
  return result.reverse().join("") + (decimals ? "." + decimals : "")
}

export function marketEntry(entry: CSVMarketEntryWithItemID): MarketEntry {
  const realLevel = entry.petLVL ?? entry.makaLVL ?? itemInfoMap.get(entry.itemID)?.level ?? 0
  const realStack = [0, 1, 10, 50, 100][entry.stack]
  const realAmount = entry.amount * realStack
  const realInitAmount = entry.initAmount * realStack
  const realPrice = entry.price / realStack
  const [_realPriceWhole, _realPriceDecimals] = realPrice.toString().split(".")
  const realPriceWhole = formatPrice(_realPriceWhole)
  const realPriceDecimals = _realPriceDecimals ? "." + _realPriceDecimals : ""
  const durationDays = [0, 7, 14, 28][entry.duration]
  const durationHours = durationDays * 24 - 1
  const expirationDate = entry.added + durationHours * 60 * 60 * 1000
  const enchantment =
    entry.subSlot1Type === undefined
      ? undefined
      : {
          charges: entry.subCharges,
          sublimations: [entry.subSub1, entry.subSub2].filter((x) => x),
          slots: [
            {
              type: entry.subSlot1Type,
              color: slotColor(entry.subSlot1Type),
              level: slotLevel(entry.subSlot1LVL),
              effectID: entry.subSlot1Effect,
            },
            {
              type: entry.subSlot2Type,
              color: slotColor(entry.subSlot2Type),
              level: slotLevel(entry.subSlot2LVL),
              effectID: entry.subSlot2Effect,
            },
            {
              type: entry.subSlot3Type,
              color: slotColor(entry.subSlot3Type),
              level: slotLevel(entry.subSlot3LVL),
              effectID: entry.subSlot3Effect,
            },
            {
              type: entry.subSlot4Type,
              color: slotColor(entry.subSlot4Type),
              level: slotLevel(entry.subSlot4LVL),
              effectID: entry.subSlot4Effect,
            },
          ].filter((x) => x.type !== undefined),
        }
  return {
    ...entry,
    realLevel,
    realStack,
    realAmount,
    realInitAmount,
    realPrice,
    realPriceWhole,
    realPriceDecimals,
    expirationDate,
    enchantment,
  }
}
