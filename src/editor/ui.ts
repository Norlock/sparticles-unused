import {Grid} from "src/grid";

export interface Editor {
  update: () => void
}

export const editor = (grid: Grid) => {
  const container = document.createElement("div")
  container.id = "spar-container"
  document.body.append(container)

  addIntro(container)
  let update = addParticleCount(grid, container)
  addDevGridToggle(grid, container)
  addLoopTimer(container)

  return update
}

const addIntro = (container: HTMLDivElement) => {
  const title = document.createElement("h3")
  title.innerText = "Sparticles"
  title.classList.add("spar-h3")

  const subTitle = document.createElement("h4")
  subTitle.innerText = "Particle system"
  subTitle.classList.add("spar-h4")

  container.append(title, subTitle)
}

const addParticleCount = (grid: Grid, container: HTMLDivElement) => {
  const div = document.createElement("div")
  div.id = "spar-particle-count"

  const label = document.createElement("div")
  label.classList.add("spar-detail")
  label.innerText = "Particle count: "

  const answer = document.createElement("div")
  answer.innerText = "" + grid.particleCount

  const update = () => {
    answer.innerText = "" + grid.particleCount
  }

  div.append(label, answer)
  container.append(div)

  return {update}
}

const addDevGridToggle = (grid: Grid, container: HTMLDivElement) => {
  const div = document.createElement("div")
  div.id = "spar-dev-grid"

  const label = document.createElement("label") as HTMLLabelElement
  label.htmlFor = "spar-dev-grid-toggle"
  label.classList.add("spar-detail")
  label.innerText = "Show development grid"

  const input = document.createElement("input") as HTMLInputElement
  input.id = "spar-dev-grid-toggle"
  input.type = "checkbox"
  input.checked = true

  input.onclick = () => {
    if (input.checked) {
      grid.container.showDevGrid()
    } else {
      grid.container.hideDevGrid()
    }
  }

  label.append(input)
  div.append(label)
  container.append(div)
}

const loopTimer = document.createElement("span")

const addLoopTimer = (container: HTMLDivElement) => {
  const div = document.createElement("div")
  div.id = "loop-timer"
  div.innerText = "Loop time: "
  div.append(loopTimer)
  container.append(div)
}

export const updateLoopTimer = (time: number) => {
  loopTimer.innerText = time.toFixed(4)
}
