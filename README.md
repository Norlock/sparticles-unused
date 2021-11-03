# Sparticles

## Start 
npm i && npm start

## Explanation grid

there is one grid of probabilities where a particle can be until it deems it as a collision. 

a probability can contain multiple cells 

```
a     b     
|-----|-----|
|x----|x----|
|---x-|-----|
```

will translate to:

```
|-      -     -     -     -|
|x(a,b) -     -     -     -|
|-      -     -     x(a)  -|
```

So x(a, b) means that a particle happens to be there on cell a & b. now you can easily check for collisions in each
cell. Just by filtering the probabilities of the same cell. 

## Roadmap
- [ ] physics
  - [ ] update side movement
- [ ] editor
- [ ] forces for particle (certain movement patterns)
- [ ] external forces (to create more lively effect)
