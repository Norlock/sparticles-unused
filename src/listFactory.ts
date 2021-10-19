import {Cell} from "./cell";
import {List, ParticleLinkedList} from "./list";

export interface ListFactory {
  create(cell: Cell): List
}

export const ParticleLinkedListFactory = () => {
  const create = (cell: Cell) => {
    return new ParticleLinkedList(cell)
  }

  return {create}
}

