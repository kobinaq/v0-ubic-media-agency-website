"use client"

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function canUsePointerEffects(): boolean {
  if (typeof window === "undefined") return false
  if (prefersReducedMotion()) return false
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}
