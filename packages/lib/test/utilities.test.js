import { describe, it, expect } from 'vitest'
import * as utilities from '../src/utilities'

describe('Utilities', () => {
  describe('isQuote', () => {
    it('returns true for single quote', () => {
      expect(utilities.isQuote("'")).toBe(true)
    })

    it('returns true for double quote', () => {
      expect(utilities.isQuote('"')).toBe(true)
    })

    it('returns false for other characters', () => {
      expect(utilities.isQuote('a')).toBe(false)
    })
  })

  describe('isSingleQuote', () => {
    it('returns true for single quote', () => {
      expect(utilities.isSingleQuote("'")).toBe(true)
    })

    it('returns false for double quote', () => {
      expect(utilities.isSingleQuote('"')).toBe(false)
    })

    it('returns false for other characters', () => {
      expect(utilities.isSingleQuote('a')).toBe(false)
    })
  })

  describe('isWhitespace', () => {
    it('returns true for space', () => {
      expect(utilities.isWhitespace(' ')).toBe(true)
    })

    it('returns true for tab', () => {
      expect(utilities.isWhitespace('\t')).toBe(true)
    })

    it('returns true for new line', () => {
      expect(utilities.isWhitespace('\n')).toBe(true)
    })

    it('returns false for other characters', () => {
      expect(utilities.isWhitespace('a')).toBe(false)
    })
  })

  describe('isAlphabetic', () => {
    it('returns true for alphabetic characters', () => {
      expect(utilities.isAlphabetic('a')).toBe(true)
      expect(utilities.isAlphabetic('z')).toBe(true)
      expect(utilities.isAlphabetic('A')).toBe(true)
      expect(utilities.isAlphabetic('Z')).toBe(true)
    })

    it('returns false for other characters', () => {
      expect(utilities.isAlphabetic('1')).toBe(false)
      expect(utilities.isAlphabetic('!')).toBe(false)
      expect(utilities.isAlphabetic(' ')).toBe(false)
    })
  })

  describe('isBool', () => {
    it('returns true for boolean values', () => {
      expect(utilities.isBool(true)).toBe(true)
      expect(utilities.isBool(false)).toBe(true)
    })

    it('returns false for other values', () => {
      expect(utilities.isBool('true')).toBe(false)
      expect(utilities.isBool('false')).toBe(false)
      expect(utilities.isBool(1)).toBe(false)
      expect(utilities.isBool(0)).toBe(false)
    })
  })
})
