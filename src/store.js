import { writable } from 'svelte/store';

export const map = writable()

export const planning = writable()

export const graph = writable()

export const shortestPaths = writable()

export const tour = writable()

export const textTour = writable([])

export const loading = writable(false)

export const strategyTSP = writable("simulated-annealing")