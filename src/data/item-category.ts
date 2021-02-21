export const parentCategory: Partial<Record<number, number>> = {
  101: 519,
  108: 518,
  110: 518,
  111: 519,
  112: 520,
  113: 518,
  114: 519,
  115: 518,
  117: 519,
  189: 520,
  223: 519,
  253: 519,
  254: 518,

  511: -2,
  809: -2,
  811: 683,
  812: 719,
  822: -2,

  281: 761, // Récoltes mineur
  306: 226, // Récoltes forestier
  308: 567, // Pecheur
  309: 237, // Paysan
  "-1": 604,
}

export const inventory = {
  ring: 103,
  helmet: 134,
  boots: 119,
  amulet: 120,
  cloak: 132,
  belt: 133,
  breastplate: 136,
  epaulettes: 138,
  secondaryWeapon: 520,
  oneHandedWeapon: 518,
  twoHandedWeapon: 519,
  tool: 537,
  emblem: 646,
  pet: 582,
  mount: 611,
  costume: 647,
}
export const allEquipments = Object.values(inventory)
