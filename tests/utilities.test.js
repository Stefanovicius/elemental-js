import { describe, it, expect } from 'vitest'
import * as utils from '../src/utilities'

describe('Utilities', () => {
  describe('isQuote', () => {
    it('returns true for single quote', () => {
      expect(utils.isQuote("'")).toBe(true)
    })

    it('returns true for double quote', () => {
      expect(utils.isQuote('"')).toBe(true)
    })

    it('returns false for other characters', () => {
      expect(utils.isQuote('a')).toBe(false)
    })
  })

  describe('isWhitespace', () => {
    it('returns true for space', () => {
      expect(utils.isWhitespace(' ')).toBe(true)
    })

    it('returns true for tab', () => {
      expect(utils.isWhitespace('\t')).toBe(true)
    })

    it('returns true for new line', () => {
      expect(utils.isWhitespace('\n')).toBe(true)
    })

    it('returns false for other characters', () => {
      expect(utils.isWhitespace('a')).toBe(false)
    })
  })

  describe('isBool', () => {
    it('returns true for boolean values', () => {
      expect(utils.isBool(true)).toBe(true)
      expect(utils.isBool(false)).toBe(true)
    })

    it('returns false for other values', () => {
      expect(utils.isBool('true')).toBe(false)
      expect(utils.isBool('false')).toBe(false)
      expect(utils.isBool(1)).toBe(false)
      expect(utils.isBool(0)).toBe(false)
    })
  })
})
