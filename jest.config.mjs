/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main/**',
        '!<rootDir>/src/**/index.ts',
    ],
    coverageDirectory: "coverage",
    coverageProvider: 'babel',
    moduleNameMapper: {
        '@/tests/(.+)': '<rootDir>/tests/$1',
        '@/(.+)': '<rootDir>/src/$1'
    },
    roots: [
        '<rootDir>/src',
        '<rootDir>/tests'
    ],
    transform: {
        '\\.ts': 'ts-jest'
    }
};

export default config;
