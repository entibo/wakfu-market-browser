import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"

@Module({ namespaced: true })
export default class Favorites extends VuexModule {
  list = [8248, 8257] as number[]

  get set() {
    return new Set(this.list)
  }

  get has() {
    return (itemID: number) => this.set.has(itemID)
  }

  @Mutation
  add(itemID: number) {
    if (this.list.includes(itemID)) return
    this.list.push(itemID)
  }
  @Mutation
  delete(itemID: number) {
    this.list = this.list.filter((x) => x !== itemID)
  }

  // action 'incr' commits mutation 'increment' when done with return value as payload
  @Action({ commit: "increment" })
  incr() {
    return 5
  }
}
