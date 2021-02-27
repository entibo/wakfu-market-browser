import * as Comlink from "comlink"
import type { ExposedType } from "@/worker/my.worker"

const worker = Comlink.wrap<ExposedType>(new Worker("@/worker/my.worker", { name: "mine", type: "module" }))
const w = window as any
w.worker = worker
export default worker