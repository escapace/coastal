import { bench, describe } from 'vitest'
import { chunk } from './chunk'

type ChunkImplementation = <T>(array: T[], size: number) => T[][]

const validateChunkParameters = (_: unknown[], size: number): void => {
  if (size <= 0 || !Number.isInteger(size)) {
    throw new Error('Chunk size must be a positive integer')
  }
}

const handleEmptyArray = <T>(array: T[]): T[][] | null => (array.length === 0 ? [] : null)

// Core implementations representing different algorithmic approaches
const chunkReduceBased: ChunkImplementation = <T>(array: T[], size: number): T[][] => {
  validateChunkParameters(array, size)
  const emptyResult = handleEmptyArray(array)
  if (emptyResult !== null) return emptyResult

  return array.reduce<T[][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / size)
    resultArray[chunkIndex] ??= []
    resultArray[chunkIndex].push(item)
    return resultArray
  }, [])
}

const chunkArrayFrom: ChunkImplementation = <T>(array: T[], size: number): T[][] => {
  validateChunkParameters(array, size)
  const emptyResult = handleEmptyArray(array)
  if (emptyResult !== null) return emptyResult

  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size),
  )
}

// Implementation registry - reduced to 3 core approaches
const implementations: Record<string, ChunkImplementation> = {
  'Baseline (reduce-based)': chunkReduceBased,
  'Functional (Array.from)': chunkArrayFrom,
  'Optimized (pre-allocated)': chunk,
}

// Data management - simplified to numbers only
class OptimizedDataManager {
  private readonly data = new Map<string, number[]>()

  private readonly sizes = {
    large: 100_000, // Memory pattern analysis
    small: 100, // Overhead-dominated
    veryLarge: 1_000_000, // Algorithmic complexity
  }

  initialize(): void {
    Object.entries(this.sizes).forEach(([sizeName, count]) => {
      this.data.set(
        sizeName,
        Array.from({ length: count }, (_, index) => index),
      )
    })
  }

  get(size: keyof typeof this.sizes): number[] {
    const data = this.data.get(size)
    if (data === undefined) throw new Error(`Data not found: ${size}`)
    return data
  }
}

const dataManager = new OptimizedDataManager()
dataManager.initialize() // Initialize immediately

// Core performance matrix: Strategic combinations focusing on algorithmic boundaries
describe('Chunk Performance: Algorithmic Scaling Analysis', () => {
  // Performance research shows these ratios reveal algorithmic differences most clearly
  const strategicCombinations = [
    // Memory overhead dominated (small arrays, various chunk sizes)
    { chunkSizes: [1, 10, 50], dataSize: 'small', focus: 'overhead analysis' },
    // Algorithmic efficiency (large arrays, key boundaries)
    { chunkSizes: [10, 100, 1000], dataSize: 'large', focus: 'scaling behavior' },
    // Memory pattern analysis (very large arrays, optimal chunk sizes)
    { chunkSizes: [1000, 10_000], dataSize: 'veryLarge', focus: 'memory efficiency' },
  ] as const

  strategicCombinations.forEach(({ chunkSizes, dataSize, focus }) => {
    describe(`${dataSize} dataset - ${focus}`, () => {
      chunkSizes.forEach((chunkSize) => {
        const data = dataManager.get(dataSize)

        // Skip invalid combinations
        if (chunkSize > data.length) return

        describe(`chunk size ${chunkSize}`, () => {
          Object.entries(implementations).forEach(([name, impl]) => {
            bench(name, () => {
              impl(data, chunkSize)
            })
          })
        })
      })
    })
  })
})

// Edge case validation: Tests algorithmic boundaries that reveal implementation weaknesses
describe('Chunk Performance: Critical Edge Cases', () => {
  const criticalEdgeCases = [
    {
      data: 'large',
      name: 'Maximum fragmentation',
      rationale: 'Stress tests memory allocation patterns',
      size: 1,
    },
    {
      data: 'small',
      name: 'Single chunk boundary',
      rationale: 'Tests chunk size > array length optimization',
      size: 1000,
    },
  ] as const

  criticalEdgeCases.forEach(({ data: dataSize, name, rationale, size }) => {
    describe(`${name} - ${rationale}`, () => {
      Object.entries(implementations).forEach(([implName, impl]) => {
        bench(implName, () => {
          impl(dataManager.get(dataSize), size)
        })
      })
    })
  })
})

// Application-specific validation: Represents documented real-world usage patterns
describe('Chunk Performance: Production Scenarios', () => {
  const productionScenarios = [
    {
      chunkSize: 20,
      context: 'Standard page size for user interfaces',
      dataSize: 'large',
      name: 'REST API pagination',
    },
    {
      chunkSize: 10_000,
      context: 'Memory-efficient bulk operations',
      dataSize: 'veryLarge',
      name: 'Batch processing pipeline',
    },
  ] as const

  productionScenarios.forEach(({ chunkSize, context, dataSize, name }) => {
    describe(`${name} - ${context}`, () => {
      Object.entries(implementations).forEach(([implName, impl]) => {
        bench(implName, () => {
          impl(dataManager.get(dataSize), chunkSize)
        })
      })
    })
  })
})
