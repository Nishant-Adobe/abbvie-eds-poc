#!/usr/bin/env node
/**
 * Builds component-models.json, component-filters.json, and component-definition.json
 * by resolving all "..." spread references in the models/ source files.
 *
 * Spread syntax: { "...": "<glob>#/<key>" }
 * - glob is resolved relative to the file containing the spread
 * - #/<key> selects a top-level array from the resolved JSON
 */

const { readFileSync, writeFileSync } = require('fs');
const { resolve, dirname } = require('path');
const { sync: globSync } = require('glob');

const ROOT = resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8').replace(/^﻿/, ''));
}

function resolveSpread(spreadRef, baseDir) {
  const [globPart, keyPart] = spreadRef.split('#/');
  const key = keyPart || null;
  const files = globSync(resolve(baseDir, globPart)).sort();
  const results = [];
  for (const file of files) {
    const data = readJson(file);
    const items = key ? data[key] : data;
    if (Array.isArray(items)) results.push(...items);
    else if (items !== undefined) results.push(items);
  }
  return results;
}

function resolveValue(value, baseDir) {
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) {
      if (item && typeof item === 'object' && '...' in item) {
        out.push(...resolveSpread(item['...'], baseDir));
      } else {
        out.push(resolveValue(item, baseDir));
      }
    }
    return out;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolveValue(v, baseDir);
    }
    return out;
  }
  return value;
}

function build(srcFile, outFile) {
  const srcPath = resolve(ROOT, 'models', srcFile);
  const outPath = resolve(ROOT, outFile);
  const baseDir = dirname(srcPath);
  const src = readJson(srcPath);
  const resolved = resolveValue(src, baseDir);
  writeFileSync(outPath, `${JSON.stringify(resolved, null, 2)}\n`, 'utf-8');
  console.log(`built: ${outFile}`);
}

build('_component-models.json', 'component-models.json');
build('_component-filters.json', 'component-filters.json');
build('_component-definition.json', 'component-definition.json');
